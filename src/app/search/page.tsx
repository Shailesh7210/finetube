'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Compass, BookOpen, Video as VideoIcon, ArrowRight } from 'lucide-react';
import { store } from '@/lib/store';
import { VideoCard } from '@/components/VideoCard';

function SearchContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [query, setQuery] = useState(queryParam);

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
    v.topicCoverage.some(c => c.conceptName.toLowerCase().includes(q))
  ) : [];

  const matchedTopics = q ? allTopics.filter(t => 
    t.name.toLowerCase().includes(q) || 
    t.description.toLowerCase().includes(q) ||
    t.aliases.some(a => a.toLowerCase().includes(q))
  ) : [];

  const matchedPlaylists = q ? allPlaylists.filter(p => 
    p.title.toLowerCase().includes(q) || 
    p.description.toLowerCase().includes(q)
  ) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Search Education Catalog</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Find concept explanations, curriculum topics, and verified learning paths.
        </p>
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by concept (e.g. useEffect, BST, async, recursion)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 shadow-lg"
          />
        </div>
      </div>

      {q && (
        <div className="space-y-8">
          {/* Matched Topics */}
          {matchedTopics.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-brand-400" />
                Matching Topics ({matchedTopics.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedTopics.map(t => (
                  <Link
                    key={t.id}
                    href={`/topics/${t.slug}`}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/50 flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-brand-300">
                        {t.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{t.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Matched Playlists */}
          {matchedPlaylists.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-400" />
                Matching Learning Paths ({matchedPlaylists.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedPlaylists.map(p => (
                  <Link
                    key={p.id}
                    href={`/playlists/${p.id}`}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/50 flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <span className="text-[10px] uppercase font-bold text-brand-400">{p.type} Sequence</span>
                      <h3 className="text-sm font-semibold text-white group-hover:text-brand-300">
                        {p.title}
                      </h3>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Matched Videos */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <VideoIcon className="w-4 h-4 text-brand-400" />
              Matching Video Lessons ({matchedVideos.length})
            </h2>
            {matchedVideos.length === 0 ? (
              <p className="text-xs text-slate-500">No videos matching &quot;{query}&quot;.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedVideos.map(v => (
                  <VideoCard key={v.id} video={v} showRankScore={true} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-slate-400">
        Loading search catalog...
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
