'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  BookOpen, 
  Play, 
  Clock, 
  Layers, 
  Star, 
  CheckCircle2, 
  ShieldAlert, 
  MoveUp, 
  MoveDown, 
  Copy, 
  Share2, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';
import { store } from '../../../lib/store';
import { formatDuration } from '../../../lib/utils';

export default function PlaylistDetailPage() {
  const params = useParams();
  const playlistId = params?.id as string;
  const [copiedLink, setCopiedLink] = useState(false);
  const [forkedNotice, setForkedNotice] = useState(false);

  const playlist = store.getPlaylistById(playlistId);

  if (!playlist) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Playlist Not Found</h2>
        <Link href="/playlists" className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 rounded text-xs text-white">
          <ArrowLeft className="w-4 h-4" /> Back to Playlists
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

    // re-assign positions
    newItems.forEach((it, idx) => { it.position = idx; });
    setItems(newItems);
  };

  const handleForkPlaylist = () => {
    store.createPlaylist({
      type: 'CUSTOMISED',
      topicId: playlist.topicId,
      title: `Copy of ${playlist.title}`,
      description: `Customized fork of ${playlist.title}`,
      visibility: 'private',
      items: [...items],
      coveredConcepts: [...playlist.coveredConcepts],
      missingConcepts: [...playlist.missingConcepts],
      estimatedTotalMinutes: playlist.estimatedTotalMinutes
    });
    setForkedNotice(true);
    setTimeout(() => setForkedNotice(false), 2500);
  };

  const handleCopyShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Breadcrumb */}
      <div>
        <Link href="/playlists" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Playlists
        </Link>
      </div>

      {/* Playlist Hero Banner */}
      <div className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {playlist.type} Sequence
              </span>
              {topic && (
                <Link href={`/topics/${topic.slug}`} className="text-xs text-slate-400 hover:text-brand-300">
                  {topic.name}
                </Link>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {playlist.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {playlist.description}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={handleForkPlaylist}
              disabled={forkedNotice}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{forkedNotice ? 'Forked to Library!' : 'Fork & Customize'}</span>
            </button>

            <button
              onClick={handleCopyShare}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Copied Link!' : 'Share Path'}</span>
            </button>
          </div>
        </div>

        {/* Coverage & Identified Gaps (Section 7.2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              Evidenced Concept Progression
            </div>
            <p className="text-xs text-slate-300">
              {playlist.coveredConcepts.join(' ➔ ')}
            </p>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
              <ShieldAlert className="w-4 h-4" />
              Honest Gap Disclosure (Blueprint Principle)
            </div>
            <p className="text-xs text-slate-400">
              {playlist.missingConcepts.length > 0 
                ? `Not yet covered in this sequence: ${playlist.missingConcepts.join(', ')}`
                : 'Full core concept coverage achieved.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Ordered Video Sequence */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-brand-400" />
          Ordered Lesson Sequence ({items.length} Lessons)
        </h2>

        <div className="space-y-3">
          {items.map((item, idx) => {
            const video = store.getVideoById(item.videoId);
            if (!video) return null;

            return (
              <div
                key={item.id}
                className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-4">
                  {/* Step index */}
                  <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-xs text-brand-400 font-mono shrink-0">
                    {idx + 1}
                  </div>

                  {/* Thumbnail snippet */}
                  <Link href={`/watch/${video.id}`} className="relative w-28 aspect-video rounded-lg overflow-hidden bg-slate-950 shrink-0 block">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-4 h-4 fill-white text-white" />
                    </div>
                  </Link>

                  {/* Video & Purpose Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-400">
                        {formatDuration(video.durationSeconds)}
                      </span>
                      <span className="text-[11px] text-slate-500">•</span>
                      <span className="text-[11px] text-slate-400">{video.channelTitle}</span>
                    </div>

                    <Link href={`/watch/${video.id}`}>
                      <h3 className="text-sm font-semibold text-slate-100 hover:text-brand-300 transition-colors">
                        {video.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-brand-300/90 font-medium">
                      🎯 Purpose: {item.purpose}
                    </p>
                  </div>
                </div>

                {/* Reorder and Watch CTA */}
                <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveItem(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800 transition-colors"
                      title="Move lesson up in progression"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveItem(idx, 'down')}
                      disabled={idx === items.length - 1}
                      className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800 transition-colors"
                      title="Move lesson down in progression"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <Link
                    href={`/watch/${video.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Watch Lesson</span>
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
