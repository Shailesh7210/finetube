'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Plus, Check, Loader2 } from 'lucide-react';
import { store } from '@/lib/store';
import { api } from '@/lib/api';
import { VideoCard } from '@/components/VideoCard';
import { Video } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';

function SearchContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const { user, updateProfile } = useAuth();

  const [query, setQuery] = useState(queryParam);
  const [activeFilter, setActiveFilter] = useState<'all' | 'videos' | 'topics' | 'playlists'>('all');
  const [prioritizeContext, setPrioritizeContext] = useState(true);
  const [strictStreamOnly, setStrictStreamOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);
  const [discoveredVideos, setDiscoveredVideos] = useState<Video[]>([]);
  const [addedInterestNotice, setAddedInterestNotice] = useState(false);

  const allTopics = store.getTopics();
  const allSubjects = store.getSubjects();
  const allPlaylists = store.getPlaylists();
  const userInterests = user?.customInterests || store.user.customInterests || [];
  const userEducationLevel = user?.educationLevel || store.user.educationLevel;
  const followedSubjectIds = user?.followedSubjectIds || store.user.followedSubjectIds || [];
  const primarySubjectId = followedSubjectIds[0];
  const primarySubjectName = allSubjects.find(s => s.id === primarySubjectId)?.name || user?.stream;

  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setDiscoveredVideos([]);
      setNextPageToken(undefined);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const timer = setTimeout(async () => {
      try {
        const searchOptions: any = {};
        if (prioritizeContext && userEducationLevel && userEducationLevel !== 'not_specified') {
          searchOptions.educationLevel = userEducationLevel;
        }
        if (strictStreamOnly && primarySubjectId) {
          searchOptions.subjectId = primarySubjectId;
          searchOptions.strict = true;
        }

        const res = await api.searchYouTube(trimmed, searchOptions);
        if (isMounted && res && Array.isArray(res.data)) {
          setDiscoveredVideos(res.data);
          setNextPageToken(res.nextPageToken);
        }
      } catch (err) {
        console.error('YouTube search error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }, 350);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query, prioritizeContext, strictStreamOnly, primarySubjectId, userEducationLevel]);

  const handleLoadMore = async () => {
    const trimmed = query.trim();
    if (!trimmed || !nextPageToken || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const searchOptions: any = { pageToken: nextPageToken };
      if (prioritizeContext && userEducationLevel && userEducationLevel !== 'not_specified') {
        searchOptions.educationLevel = userEducationLevel;
      }
      if (strictStreamOnly && primarySubjectId) {
        searchOptions.subjectId = primarySubjectId;
        searchOptions.strict = true;
      }

      const res = await api.searchYouTube(trimmed, searchOptions);
      setNextPageToken(res.nextPageToken);
      if (Array.isArray(res.data) && res.data.length > 0) {
        setDiscoveredVideos(prev => {
          const seen = new Set(prev.map(v => v.id));
          const fresh = res.data.filter(v => !seen.has(v.id));
          return [...prev, ...fresh];
        });
      }
    } finally {
      setIsLoadingMore(false);
    }
  };

  const q = query.trim().toLowerCase();

  const matchedTopics = useMemo(() => {
    if (!q) return [];
    return allTopics.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.aliases?.some(a => a.toLowerCase().includes(q))
    );
  }, [allTopics, q]);

  const matchedPlaylists = useMemo(() => {
    if (!q) return [];
    return allPlaylists.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }, [allPlaylists, q]);

  const totalResults = discoveredVideos.length + matchedTopics.length + matchedPlaylists.length;

  const isAlreadyInInterests = useMemo(() => {
    if (!query.trim()) return false;
    return userInterests.some(item => item.toLowerCase() === query.trim().toLowerCase());
  }, [userInterests, query]);

  const handleAddInterest = async () => {
    const clean = query.trim();
    if (!clean || isAlreadyInInterests) return;

    const nextInterests = [...userInterests, clean];
    store.user.customInterests = nextInterests;
    await updateProfile({ customInterests: nextInterests });

    setAddedInterestNotice(true);
    setTimeout(() => setAddedInterestNotice(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      <div className="space-y-4">
        <div className="relative max-w-3xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any subject, topic, or chapter..."
            className="w-full bg-white border border-slate-300 rounded-2xl pl-12 pr-12 py-3.5 text-base text-slate-900 placeholder-slate-400 shadow-xs focus:outline-none focus:border-indigo-500 transition-colors"
          />
          {isLoading && (
            <Loader2 className="w-5 h-5 text-indigo-600 animate-spin absolute right-4 top-1/2 -translate-y-1/2" />
          )}
        </div>

        {q && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              {userEducationLevel && userEducationLevel !== 'not_specified' && (
                <button
                  onClick={() => setPrioritizeContext(!prioritizeContext)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    prioritizeContext
                      ? 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                      : 'bg-white border border-slate-300 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {prioritizeContext ? `Level: ${userEducationLevel}` : 'All Levels'}
                </button>
              )}

              {primarySubjectId && (
                <button
                  onClick={() => setStrictStreamOnly(!strictStreamOnly)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    strictStreamOnly
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                      : 'bg-white border border-slate-300 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {strictStreamOnly ? `Strict: ${primarySubjectName}` : `Scope: All Subjects`}
                </button>
              )}
            </div>

            <button
              onClick={handleAddInterest}
              disabled={isAlreadyInInterests}
              className={`px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-1.5 transition-colors ${
                isAlreadyInInterests
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {isAlreadyInInterests ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>In Your Interests</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Follow &ldquo;{query.trim()}&rdquo;</span>
                </>
              )}
            </button>
          </div>
        )}

        {addedInterestNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800 flex items-center justify-between">
            <span>Added <strong>&ldquo;{query.trim()}&rdquo;</strong> to your interests.</span>
            <Link href="/feed" className="underline font-semibold hover:text-emerald-950">
              Go to Feed →
            </Link>
          </div>
        )}

        {q && (
          <div className="flex items-center gap-2 text-sm border-b border-slate-200 pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-1.5 rounded-lg transition-colors shrink-0 ${
                activeFilter === 'all' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              All ({totalResults})
            </button>
            <button
              onClick={() => setActiveFilter('videos')}
              className={`px-4 py-1.5 rounded-lg transition-colors shrink-0 ${
                activeFilter === 'videos' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Videos ({discoveredVideos.length})
            </button>
            <button
              onClick={() => setActiveFilter('topics')}
              className={`px-4 py-1.5 rounded-lg transition-colors shrink-0 ${
                activeFilter === 'topics' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Topics ({matchedTopics.length})
            </button>
            <button
              onClick={() => setActiveFilter('playlists')}
              className={`px-4 py-1.5 rounded-lg transition-colors shrink-0 ${
                activeFilter === 'playlists' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Playlists ({matchedPlaylists.length})
            </button>
          </div>
        )}
      </div>

      {!q ? (
        <div className="py-16 text-center space-y-5">
          <h2 className="text-2xl font-bold text-slate-900">Search Any Educational Topic</h2>
          <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto">
            {[
              'Class 12 Physics Electrostatics',
              'Organic Chemistry Mechanisms',
              'Essence of Calculus',
              'Human cardiovascular system',
              'French Revolution',
              'React useEffect',
              'Macroeconomics'
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setQuery(suggestion)}
                className="px-4 py-2 rounded-full bg-white border border-slate-200 hover:border-indigo-300 text-sm text-slate-700 hover:text-indigo-600 shadow-xs transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      ) : totalResults === 0 && !isLoading ? (
        <div className="py-14 text-center text-sm text-slate-500 border border-dashed border-slate-300 rounded-2xl bg-white">
          No results found for &ldquo;{query}&rdquo;.
        </div>
      ) : (
        <div className="space-y-8">
          {(activeFilter === 'all' || activeFilter === 'videos') && discoveredVideos.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">
                Videos ({discoveredVideos.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {discoveredVideos.map(v => (
                  <VideoCard key={v.id} video={v} />
                ))}
              </div>
              {nextPageToken && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 text-sm font-semibold shadow-xs inline-flex items-center gap-2 transition-colors disabled:opacity-60"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                        <span>Loading more videos...</span>
                      </>
                    ) : (
                      <span>Load More from YouTube</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {(activeFilter === 'all' || activeFilter === 'topics') && matchedTopics.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">
                Topics ({matchedTopics.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matchedTopics.map(t => (
                  <Link
                    key={t.id}
                    href={`/topics/${t.slug}`}
                    className="p-5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all space-y-1.5 block group"
                  >
                    <span className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors block">{t.name}</span>
                    <p className="text-sm text-slate-600 line-clamp-1">{t.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {(activeFilter === 'all' || activeFilter === 'playlists') && matchedPlaylists.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">
                Playlists ({matchedPlaylists.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matchedPlaylists.map(pl => (
                  <Link
                    key={pl.id}
                    href={`/playlists/${pl.id}`}
                    className="p-5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all space-y-1.5 block group"
                  >
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">{pl.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-1">{pl.description}</p>
                    <div className="text-xs text-slate-500 pt-1">
                      {pl.items?.length || 0} lessons · ~{pl.estimatedTotalMinutes}m
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-10 text-sm text-slate-500">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
