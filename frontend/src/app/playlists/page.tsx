'use client';

import Link from 'next/link';
import { store } from '@/lib/store';

export default function PlaylistsPage() {
  const playlists = store.getPlaylists();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-xl font-semibold text-white">Learning Paths</h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Curated topic sequences organized by concept progression.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {playlists.map(playlist => {
          const topic = store.getTopics().find(t => t.id === playlist.topicId);

          return (
            <div
              key={playlist.id}
              className="p-5 rounded-lg bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                  <span>{topic ? topic.name : 'Computer Science'}</span>
                  <span>{playlist.items.length} lessons • ~{playlist.estimatedTotalMinutes}m</span>
                </div>

                <Link href={`/playlists/${playlist.id}`}>
                  <h2 className="text-base font-semibold text-zinc-100 hover:text-blue-400 transition-colors">
                    {playlist.title}
                  </h2>
                </Link>

                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed line-clamp-2">
                  {playlist.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60 text-xs">
                <span className="text-zinc-500">Rating: {playlist.ratingAverage}</span>
                <Link
                  href={`/playlists/${playlist.id}`}
                  className="text-zinc-300 hover:text-white font-medium"
                >
                  Open Path →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
