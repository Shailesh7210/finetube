'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MoveUp, MoveDown, Star, Plus } from 'lucide-react';
import { api } from '@/lib/api';
import { store } from '@/lib/store';
import { formatDuration } from '@/lib/utils';
import { PlaylistRatingModal } from '@/components/workspace/PlaylistRatingModal';
import { Video } from '@/lib/types';

export default function PlaylistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const playlistId = params?.id as string;

  const [playlist, setPlaylist] = useState<any>(null);
  const [topic, setTopic] = useState<any>(null);
  const [subject, setSubject] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [availableVideos, setAvailableVideos] = useState<Video[]>([]);
  const [selectedAddVideoId, setSelectedAddVideoId] = useState('');
  const [isForkedNotice, setIsForkedNotice] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const pl = await api.getPlaylist(playlistId);
      if (pl) {
        setPlaylist(pl);
        setItems(pl.items || []);
        const [topics, subjects, feedVideos] = await Promise.all([
          api.getTopics(),
          api.getSubjects(),
          api.getFeed()
        ]);
        const t = topics.find(tp => tp.id === pl.topicId);
        setTopic(t);
        if (t) {
          setSubject(subjects.find(s => s.id === t.subjectId));
        }
        const vids = feedVideos.length > 0 ? feedVideos : store.getVideos();
        setAvailableVideos(vids);
        if (vids.length > 0) setSelectedAddVideoId(vids[0].id);
      }
    }
    loadData();
  }, [playlistId]);

  const handleAddVideo = async () => {
    if (!selectedAddVideoId || !playlist) return;
    const video = availableVideos.find(v => v.id === selectedAddVideoId) || store.getVideoById(selectedAddVideoId);
    if (!video) return;

    await api.addVideoToPlaylist(playlist.id, video.id);
    if (!items.some(i => i.videoId === video.id)) {
      const newItem = {
        id: `item_${Date.now()}`,
        videoId: video.id,
        video,
        position: items.length,
        purpose: `Lesson ${items.length + 1}`,
        coveredConcepts: video.topicCoverage?.map(c => c.conceptName) || []
      };
      setItems(prev => [...prev, newItem]);
    }
  };

  if (!playlist) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-3">
        <h2 className="text-lg font-medium text-white">Playlist not found</h2>
        <Link href="/playlists" className="text-sm text-blue-400 hover:underline">
          Back to Learning Paths
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      <Link
        href="/playlists"
        className="text-sm text-zinc-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Learning Paths
      </Link>

      {/* Playlist Header */}
      <div className="border-b border-zinc-800 pb-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="text-sm text-zinc-400 font-medium">
              {subject ? `${subject.name} · ` : ''}{topic ? topic.name : 'Learning Path'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{playlist.title}</h1>
            {playlist.description && (
              <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl pt-1">
                {playlist.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsRateModalOpen(true)}
              className="px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold text-zinc-200 inline-flex items-center gap-1.5 transition-colors"
            >
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Rate</span>
            </button>

            <button
              onClick={handleForkPlaylist}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition-colors"
            >
              {isForkedNotice ? 'Saved Copy' : 'Save Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-white">
            Lessons ({items.length})
          </h2>
          {availableVideos.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                value={selectedAddVideoId}
                onChange={e => setSelectedAddVideoId(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-200 max-w-[240px] focus:outline-none focus:border-zinc-600"
              >
                {availableVideos.map(v => (
                  <option key={v.id} value={v.id}>{v.title}</option>
                ))}
              </select>
              <button
                onClick={handleAddVideo}
                className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold text-white inline-flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => {
            const video = item.video || store.getVideoById(item.videoId);
            if (!video) return null;

            return (
              <div
                key={item.id || idx}
                className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700/80 transition-colors flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-mono font-bold text-zinc-200 shrink-0">
                    {idx + 1}
                  </div>

                  <div>
                    <Link
                      href={`/watch/${video.id}`}
                      className="text-base font-bold text-zinc-100 hover:text-blue-400 transition-colors"
                    >
                      {video.title}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                      <span>{video.channelTitle}</span>
                      <span>•</span>
                      <span>{formatDuration(video.durationSeconds)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => moveItem(idx, 'up')}
                    disabled={idx === 0}
                    title="Move up"
                    className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <MoveUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveItem(idx, 'down')}
                    disabled={idx === items.length - 1}
                    title="Move down"
                    className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <MoveDown className="w-4 h-4" />
                  </button>
                  <Link
                    href={`/watch/${video.id}`}
                    className="ml-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold text-white transition-colors"
                  >
                    Watch
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <PlaylistRatingModal
        isOpen={isRateModalOpen}
        playlistId={playlist.id}
        playlistTitle={playlist.title}
        onClose={() => setIsRateModalOpen(false)}
      />
    </div>
  );
}
