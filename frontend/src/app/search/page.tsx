'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Sparkles, BookOpen, Layers, Play, Plus, Check, Globe, GraduationCap, ArrowRight, Loader2 } from 'lucide-react';
import { store } from '@/lib/store';
import { api } from '@/lib/api';
import { VideoCard } from '@/components/VideoCard';
import { Video, Topic, Playlist } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';

function SearchContent() {
  const router = useRouter();
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

  // Execute Dynamic YouTube Discovery
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
      t.aliases?.some(a => a.toLowerCase().includes(q)) ||
      t.conceptChecklist?.some(c => c.toLowerCase().includes(q))
    );
  }, [allTopics, q]);

  const matchedPlaylists = useMemo(() => {
    if (!q) return [];
    return allPlaylists.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.coveredConcepts?.some(c => c.toLowerCase().includes(q))
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      {/* Search Input Bar */}
      <div className="space-y-3">
        <div className="relative max-w-2xl">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any subject, topic, or chapter (e.g. Class 12 Physics, French Revolution, Organic Chemistry, React)..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
          />
          {isLoading && (
            <Loader2 className="w-4 h-4 text-zinc-400 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
          )}
        </div>

        {/* Context Control & Add-to-Interests Action */}
        {q && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-zinc-400">
                Searching for <strong>&ldquo;{query.trim()}&rdquo;</strong>
              </span>

              {userEducationLevel && userEducationLevel !== 'not_specified' && (
                <button
                  onClick={() => setPrioritizeContext(!prioritizeContext)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                    prioritizeContext
                      ? 'bg-blue-950/60 border border-blue-800/60 text-blue-300'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-3 h-3" />
                  {prioritizeContext ? `Prioritizing ${userEducationLevel}` : 'All Education Levels'}
                </button>
              )}
            </div>

            <button
              onClick={handleAddInterest}
              disabled={isAlreadyInInterests}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0 ${
                isAlreadyInInterests
                  ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-900/60 cursor-default'
                  : 'bg-zinc-100 hover:bg-white text-zinc-950 shadow-sm'
              }`}
            >
              {isAlreadyInInterests ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Added to My Interests</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add &ldquo;{query.trim()}&rdquo; to My Interests</span>
                </>
              )}
            </button>
          </div>
        )}

        {addedInterestNotice && (
          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-900/60 text-xs text-emerald-300 flex items-center justify-between">
            <span><strong>&ldquo;{query.trim()}&rdquo;</strong> added to your profile! Your feed will now prioritize this topic.</span>
            <Link href="/feed" className="underline font-semibold hover:text-white inline-flex items-center gap-1">
              View Feed <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* Filter Tabs */}
        {q && (
          <div className="flex items-center gap-2 text-xs border-b border-zinc-800 pb-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeFilter === 'all' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All Results (<strong>{totalResults}</strong>)
            </button>
            <button
              onClick={() => setActiveFilter('videos')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeFilter === 'videos' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Discovered Videos (<strong>{discoveredVideos.length}</strong>)
            </button>
            <button
              onClick={() => setActiveFilter('topics')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeFilter === 'topics' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Curriculum Topics (<strong>{matchedTopics.length}</strong>)
            </button>
            <button
              onClick={() => setActiveFilter('playlists')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeFilter === 'playlists' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Learning Paths (<strong>{matchedPlaylists.length}</strong>)
            </button>
          </div>
        )}
      </div>

      {!q ? (
        <div className="py-12 text-center space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-white">Dynamic Universal Educational Search</h2>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Search for any academic subject, chapter, or professional topic. FineTube dynamically discovers public educational videos from YouTube.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto pt-2">
            {[
              'Class 12 Physics Electrostatics',
              'Organic Chemistry Reaction Mechanism',
              'Essence of Calculus',
              'Human cardiovascular system',
              'French Revolution',
              'React useEffect',
              'Binary Search Tree',
              'Macroeconomics GDP'
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setQuery(suggestion)}
                className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 hover:text-white transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      ) : totalResults === 0 && !isLoading ? (
        <div className="py-12 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl space-y-2">
          <p>No educational content found matching &ldquo;{query}&rdquo;.</p>
          <p className="text-zinc-600">Try searching for broader curriculum topics like <strong>Physics</strong>, <strong>Anatomy</strong>, or <strong>History</strong>.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Matched Topics */}
          {(activeFilter === 'all' || activeFilter === 'topics') && matchedTopics.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Matching Curriculum Topics ({matchedTopics.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedTopics.map(t => (
                  <Link
                    key={t.id}
                    href={`/topics/${t.slug}`}
                    className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-1 block group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">{t.name}</span>
                      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                        {t.conceptChecklist?.length || 0} Concepts
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-1">{t.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Matched Playlists */}
          {(activeFilter === 'all' || activeFilter === 'playlists') && matchedPlaylists.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Matching Learning Paths ({matchedPlaylists.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedPlaylists.map(pl => (
                  <Link
                    key={pl.id}
                    href={`/playlists/${pl.id}`}
                    className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-1 block group"
                  >
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{pl.type} Path</span>
                    <h3 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">{pl.title}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-1">{pl.description}</p>
                    <div className="text-[11px] text-zinc-500 pt-1">
                      <strong>{pl.items?.length || 0}</strong> lessons • <strong>~{pl.estimatedTotalMinutes}m</strong>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Dynamically Discovered YouTube Videos */}
          {(activeFilter === 'all' || activeFilter === 'videos') && discoveredVideos.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>Dynamically Discovered YouTube Lectures ({discoveredVideos.length})</span>
                </h2>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Official YouTube API · Embeddable
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {discoveredVideos.map(v => (
                  <VideoCard key={v.id} video={v} />
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
    <Suspense fallback={<div className="p-8 text-xs text-zinc-500">Loading universal search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
