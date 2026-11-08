'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Sparkles, BookOpen, Layers, Play } from 'lucide-react';
import { store } from '@/lib/store';
import { VideoCard } from '@/components/VideoCard';
import { formatDuration } from '@/lib/utils';

function SearchContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [query, setQuery] = useState(queryParam);
  const [activeFilter, setActiveFilter] = useState<'all' | 'videos' | 'topics' | 'playlists'>('all');

  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  const allVideos = store.getVideos();
  const allTopics = store.getTopics();
  const allPlaylists = store.getPlaylists();
  const q = query.trim().toLowerCase();

  const matchedVideos = q ? allVideos.filter(v => 
    v.title.toLowerCase().includes(q) || 
    v.description.toLowerCase().includes(q) ||
    v.topicCoverage?.some(c => c.conceptName.toLowerCase().includes(q) || c.conceptId.toLowerCase().includes(q))
  ) : [];

  const matchedTopics = q ? allTopics.filter(t => 
    t.name.toLowerCase().includes(q) || 
    t.description.toLowerCase().includes(q) ||
    t.aliases?.some(a => a.toLowerCase().includes(q))
  ) : [];

  const matchedPlaylists = q ? allPlaylists.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.coveredConcepts?.some(c => c.toLowerCase().includes(q))
  ) : [];

  const totalResults = matchedVideos.length + matchedTopics.length + matchedPlaylists.length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      {/* Search Input Bar */}
      <div className="space-y-3">
        <div className="relative max-w-xl">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search concepts, topics, or learning paths..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>

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
              Videos (<strong>{matchedVideos.length}</strong>)
            </button>
            <button
              onClick={() => setActiveFilter('topics')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeFilter === 'topics' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Topics (<strong>{matchedTopics.length}</strong>)
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
          <p className="text-xs text-zinc-400">Search for specific concepts or topics to find verified educational lectures:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['useEffect', 'Binary Search Trees', 'System Design', 'Cleanup functions', 'LRU Cache'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setQuery(suggestion)}
                className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      ) : totalResults === 0 ? (
        <div className="py-12 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl space-y-2">
          <p>No educational content found matching &ldquo;{query}&rdquo;.</p>
          <p className="text-zinc-600">Try searching for broader curriculum topics like <strong>React</strong>, <strong>Trees</strong>, or <strong>Caching</strong>.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Matched Topics */}
          {(activeFilter === 'all' || activeFilter === 'topics') && matchedTopics.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Topics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedTopics.map(t => (
                  <Link
                    key={t.id}
                    href={`/topics/${t.slug}`}
                    className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-1 block group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors">{t.name}</span>
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
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Learning Paths</h2>
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

          {/* Matched Videos */}
          {(activeFilter === 'all' || activeFilter === 'videos') && matchedVideos.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Lectures & Videos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {matchedVideos.map(v => (
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
    <Suspense fallback={<div className="p-8 text-xs text-zinc-500">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
