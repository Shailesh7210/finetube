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
  const [isLoading, setIsLoading] = useState(false);
  const [discoveredVideos, setDiscoveredVideos] = useState<Video[]>([]);
  const [addedInterestNotice, setAddedInterestNotice] = useState(false);

  const allTopics = store.getTopics();
  const allPlaylists = store.getPlaylists();
  const userInterests = user?.customInterests || store.user.customInterests || [];
  const userEducationLevel = user?.educationLevel || store.user.educationLevel;

  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setDiscoveredVideos([]);
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

        const res = await api.searchYouTube(trimmed, searchOptions);
        if (isMounted && res && Array.isArray(res.data)) {
          setDiscoveredVideos(res.data);
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
  }, [query, prioritizeContext, userEducationLevel]);

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
      {/* Large Search Bar */}
      <div className="space-y-4">
        <div className="relative max-w-3xl">
          <Search className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any subject, topic, or chapter..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-12 py-3.5 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
          />
          {isLoading && (
            <Loader2 className="w-5 h-5 text-zinc-400 animate-spin absolute right-4 top-1/2 -translate-y-1/2" />
          )}
        </div>

        {/* Context & Add-to-Interests Row */}
        {q && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {userEducationLevel && userEducationLevel !== 'not_specified' && (
                <button
                  onClick={() => setPrioritizeContext(!prioritizeContext)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    prioritizeContext
                      ? 'bg-blue-950/60 border border-blue-800/60 text-blue-300'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {prioritizeContext ? `Level: ${userEducationLevel}` : 'All Levels'}
                </button>
              )}
            </div>

            <button
              onClick={handleAddInterest}
              disabled={isAlreadyInInterests}
              className={`px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-1.5 transition-colors ${
                isAlreadyInInterests
                  ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-900/60 cursor-default'
                  : 'bg-zinc-100 hover:bg-white text-zinc-950'
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
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-sm text-emerald-300 flex items-center justify-between">
            <span>Added <strong>&ldquo;{query.trim()}&rdquo;</strong> to your interests.</span>
            <Link href="/feed" className="underline font-semibold hover:text-white">
              Go to Feed →
            </Link>
          </div>
        )}

        {/* Filter Tabs */}
        {q && (
          <div className="flex items-center gap-2 text-sm border-b border-zinc-800 pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-1.5 rounded-lg transition-colors shrink-0 ${
                activeFilter === 'all' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All ({totalResults})
            </button>
            <button
              onClick={() => setActiveFilter('videos')}
              className={`px-4 py-1.5 rounded-lg transition-colors shrink-0 ${
                activeFilter === 'videos' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Videos ({discoveredVideos.length})
            </button>
            <button
              onClick={() => setActiveFilter('topics')}
              className={`px-4 py-1.5 rounded-lg transition-colors shrink-0 ${
                activeFilter === 'topics' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Topics ({matchedTopics.length})
            </button>
            <button
              onClick={() => setActiveFilter('playlists')}
              className={`px-4 py-1.5 rounded-lg transition-colors shrink-0 ${
                activeFilter === 'playlists' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Playlists ({matchedPlaylists.length})
            </button>
          </div>
        )}
      </div>

      {!q ? (
        <div className="py-16 text-center space-y-5">
          <h2 className="text-2xl font-bold text-white">Search Any Educational Topic</h2>
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
                className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-sm text-zinc-300 hover:text-white transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      ) : totalResults === 0 && !isLoading ? (
        <div className="py-14 text-center text-sm text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
          No results found for &ldquo;{query}&rdquo;.
        </div>
      ) : (
        <div className="space-y-8">
          {(activeFilter === 'all' || activeFilter === 'videos') && discoveredVideos.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">
                Videos ({discoveredVideos.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {discoveredVideos.map(v => (
                  <VideoCard key={v.id} video={v} />
                ))}
              </div>
            </div>
          )}

          {(activeFilter === 'all' || activeFilter === 'topics') && matchedTopics.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">
                Topics ({matchedTopics.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matchedTopics.map(t => (
                  <Link
                    key={t.id}
                    href={`/topics/${t.slug}`}
                    className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-1.5 block group"
                  >
                    <span className="font-bold text-base text-white group-hover:text-blue-400 transition-colors block">{t.name}</span>
                    <p className="text-sm text-zinc-400 line-clamp-1">{t.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {(activeFilter === 'all' || activeFilter === 'playlists') && matchedPlaylists.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">
                Playlists ({matchedPlaylists.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matchedPlaylists.map(pl => (
                  <Link
                    key={pl.id}
                    href={`/playlists/${pl.id}`}
                    className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-1.5 block group"
                  >
                    <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors">{pl.title}</h3>
                    <p className="text-sm text-zinc-400 line-clamp-1">{pl.description}</p>
                    <div className="text-xs text-zinc-500 pt-1">
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
    <Suspense fallback={<div className="p-10 text-sm text-zinc-500">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
