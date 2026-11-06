'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search } from 'lucide-react';
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      <div className="relative max-w-lg">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search lessons or topics..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
        />
      </div>

      {q && (
        <div className="space-y-6">
          {matchedTopics.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Topics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedTopics.map(t => (
                  <Link
                    key={t.id}
                    href={`/topics/${t.slug}`}
                    className="p-3 rounded-md bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-200 transition-colors"
                  >
                    <span className="font-medium text-white block">{t.name}</span>
                    <span className="text-zinc-500 line-clamp-1">{t.description}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Videos</h2>
            {matchedVideos.length === 0 ? (
              <p className="text-xs text-zinc-500">No videos found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {matchedVideos.map(v => (
                  <VideoCard key={v.id} video={v} />
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
    <Suspense fallback={<div className="p-8 text-xs text-zinc-500">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
