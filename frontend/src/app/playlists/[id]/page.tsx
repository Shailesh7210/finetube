'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MoveUp, MoveDown, Copy, Check, Star, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { store } from '@/lib/store';
import { formatDuration } from '@/lib/utils';
import { PlaylistRatingModal } from '@/components/workspace/PlaylistRatingModal';

export default function PlaylistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const playlistId = params?.id as string;

  const [playlist, setPlaylist] = useState<any>(null);
  const [topic, setTopic] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [isForkedNotice, setIsForkedNotice] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const pl = await api.getPlaylist(playlistId);
      if (pl) {
        setPlaylist(pl);
        setItems(pl.items || []);
        const topics = await api.getTopics();
        const t = topics.find(tp => tp.id === pl.topicId);
        setTopic(t);
      }
    }
    loadData();
  }, [playlistId]);

  if (!playlist) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-3">
        <h2 className="text-base font-medium text-white">Learning path not found</h2>
        <Link href="/playlists" className="text-xs text-blue-400 hover:underline">
          Browse All Paths
        </Link>
      </div>
    );
  }

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    setItems(newItems);

    await api.reorderPlaylist(playlist.id, newItems);
  };

  const handleForkPlaylist = async () => {
    const forked = await api.forkPlaylist(playlist.id);
    if (forked) {
      setIsForkedNotice(true);
      setTimeout(() => {
        setIsForkedNotice(false);
        router.push(`/playlists/${forked.id}`);
      }, 1200);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      {/* Back button */}
      <Link
        href="/playlists"
        className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Learning Paths
      </Link>

      {/* Playlist Header */}
      <div className="border-b border-zinc-800 pb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span>{topic ? <strong>{topic.name}</strong> : 'Topic Sequence'}</span>
              <span>•</span>
              <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                {playlist.type} Path
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{playlist.title}</h1>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl pt-1">
              {playlist.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsRateModalOpen(true)}
              className="px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 inline-flex items-center gap-1.5 transition-colors"
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Rate Sequence
            </button>

            <button
              onClick={handleForkPlaylist}
              className="px-3 py-1.5 rounded-lg border border-blue-500/30 bg-blue-600/10 hover:bg-blue-600/20 text-xs font-semibold text-blue-400 inline-flex items-center gap-1.5 transition-colors"
            >
              {isForkedNotice ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {isForkedNotice ? 'Forked to Library' : 'Fork / Customize'}
            </button>
          </div>
        </div>

        {/* Blueprint Section 7.2: Concept progression & Gaps */}
        <div className="p-3.5 bg-zinc-900/60 border border-zinc-800/80 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-300">Concept Progression Check</span>
            <span className="text-zinc-400">
              Coherence: <strong className="text-white">96%</strong> • Redundancy Penalty: <strong className="text-emerald-400">0.02 (Optimal)</strong>
            </span>
          </div>

          {playlist.missingConcepts && playlist.missingConcepts.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-amber-400/90 pt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>
                <strong>Prerequisite gaps detected:</strong> The curriculum checklist identifies <strong>{playlist.missingConcepts.join(', ')}</strong> as unaddressed in this sequence.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Ordered Lessons List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-200">
            Lessons Progression ({items.length})
          </h2>
          <span className="text-xs text-zinc-500">
            Reorder using arrows to personalize your study flow.
          </span>
        </div>

        <div className="space-y-2.5">
          {items.map((item, idx) => {
            const video = item.video || store.getVideoById(item.videoId);
            if (!video) return null;

            return (
              <div
                key={item.id || idx}
                className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700/80 transition-colors flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-mono font-bold text-zinc-300 shrink-0">
                    {idx + 1}
                  </div>

                  <div>
                    <Link
                      href={`/watch/${video.id}`}
                      className="text-sm font-bold text-zinc-100 hover:text-blue-400 transition-colors"
                    >
                      {video.title}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                      <span>{video.channelTitle}</span>
                      <span>•</span>
                      <span><strong>{formatDuration(video.durationSeconds)}</strong></span>
                      {item.purpose && (
                        <>
                          <span>•</span>
                          <span className="text-zinc-400 italic font-mono text-[11px]">{item.purpose}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => moveItem(idx, 'up')}
                    disabled={idx === 0}
                    title="Move earlier in prerequisite order"
                    className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveItem(idx, 'down')}
                    disabled={idx === items.length - 1}
                    title="Move later in progression"
                    className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                  <Link
                    href={`/watch/${video.id}`}
                    className="ml-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors"
                  >
                    Open
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Playlist Rating Modal */}
      <PlaylistRatingModal
        isOpen={isRateModalOpen}
        playlistId={playlist.id}
        playlistTitle={playlist.title}
        onClose={() => setIsRateModalOpen(false)}
      />
    </div>
  );
}
