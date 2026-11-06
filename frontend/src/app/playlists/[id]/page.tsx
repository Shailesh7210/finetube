'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Play, MoveUp, MoveDown } from 'lucide-react';
import { store } from '@/lib/store';
import { formatDuration } from '@/lib/utils';

export default function PlaylistDetailPage() {
  const params = useParams();
  const playlistId = params?.id as string;
  const playlist = store.getPlaylistById(playlistId);

  if (!playlist) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-3">
        <h2 className="text-base font-medium text-white">Playlist not found</h2>
        <Link href="/playlists" className="text-xs text-blue-400 hover:underline">
          All Playlists
        </Link>
      </div>
    );
  }

  const topic = store.getTopics().find(t => t.id === playlist.topicId);
  const [items, setItems] = useState(playlist.items);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    setItems(newItems);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      <Link href="/playlists" className="text-xs text-zinc-500 hover:text-zinc-300 inline-flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Playlists
      </Link>

      <div className="border-b border-zinc-800 pb-6 space-y-2">
        <span className="text-xs text-zinc-500">{topic?.name || 'Topic Sequence'}</span>
        <h1 className="text-2xl font-bold text-white">{playlist.title}</h1>
        <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">{playlist.description}</p>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-300">Lessons ({items.length})</h2>

        <div className="space-y-2">
          {items.map((item, idx) => {
            const video = store.getVideoById(item.videoId);
            if (!video) return null;

            return (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center text-xs font-mono text-zinc-500">{idx + 1}</span>
                  <div>
                    <Link href={`/watch/${video.id}`} className="text-sm font-medium text-zinc-200 hover:text-blue-400">
                      {video.title}
                    </Link>
                    <div className="text-xs text-zinc-500 mt-0.5">
                      <span>{video.channelTitle}</span> • <span>{formatDuration(video.durationSeconds)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveItem(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-zinc-500 hover:text-zinc-300 disabled:opacity-20"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveItem(idx, 'down')}
                    disabled={idx === items.length - 1}
                    className="p-1 text-zinc-500 hover:text-zinc-300 disabled:opacity-20"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                  <Link
                    href={`/watch/${video.id}`}
                    className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs text-white"
                  >
                    Watch
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
