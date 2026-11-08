'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, MoreVertical, Sparkles, ThumbsUp, EyeOff, Check, X } from 'lucide-react';
import { Video, Topic } from '@/lib/types';
import { formatDuration } from '@/lib/utils';
import { calculateBayesianRating } from '@/lib/ranking';
import { api } from '@/lib/api';

interface VideoCardProps {
  video: Video;
  topic?: Topic;
}

export function VideoCard({ video, topic }: VideoCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showWhyReason, setShowWhyReason] = useState(false);
  const [feedbackState, setFeedbackState] = useState<string | null>(null);

  const rating = calculateBayesianRating(video.ratingAverage, video.ratingCount);
  const primaryReason = video.reasonCodes?.[0] || 'High curriculum relevance';

  const handleFeedback = async (action: 'not_relevant' | 'already_know' | 'more_like_this' | 'mute_topic') => {
    setShowMenu(false);
    setFeedbackState(action);
    await api.sendFeedFeedback(video.id, action, video.primaryTopicId);
  };

  if (feedbackState === 'not_relevant' || feedbackState === 'already_know') {
    return (
      <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/60 text-xs text-zinc-500 flex items-center justify-between transition-all">
        <span>
          {feedbackState === 'not_relevant' ? 'Marked as not relevant.' : 'Marked as already learned.'}
        </span>
        <button
          onClick={() => setFeedbackState(null)}
          className="text-zinc-400 hover:text-white underline text-[11px]"
        >
          Undo
        </button>
      </div>
    );
  }

  return (
    <div className="group flex flex-col space-y-2.5 relative">
      {/* Thumbnail */}
      <Link
        href={`/watch/${video.id}`}
        className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800/80 block"
      >
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
          loading="lazy"
        />
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/85 text-[10px] font-mono text-zinc-300 backdrop-blur-xs">
          <strong>{formatDuration(video.durationSeconds)}</strong>
        </div>

        {/* Reason Code Pill (Blueprint Section 5.6) */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-zinc-950/85 border border-zinc-800/80 text-[10px] text-zinc-300 font-medium backdrop-blur-xs">
          {primaryReason}
        </div>
      </Link>

      {/* Meta Information */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span className="font-medium text-zinc-400">{video.channelTitle}</span>

          <div className="flex items-center gap-2">
            {topic && (
              <span className="text-[11px] px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                <strong>{topic.name}</strong>
              </span>
            )}

            {/* Overflow Feedback Menu */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowMenu(!showMenu);
                }}
                className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
                title="Recommendation controls"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-6 z-30 w-44 rounded-lg bg-zinc-900 border border-zinc-800 p-1.5 shadow-xl text-[11px] space-y-1">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowWhyReason(true);
                    }}
                    className="w-full text-left px-2 py-1 rounded hover:bg-zinc-800 text-zinc-300 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    <span>Why recommended?</span>
                  </button>
                  <button
                    onClick={() => handleFeedback('more_like_this')}
                    className="w-full text-left px-2 py-1 rounded hover:bg-zinc-800 text-zinc-300 flex items-center gap-1.5"
                  >
                    <ThumbsUp className="w-3 h-3 text-blue-400" />
                    <span>More like this</span>
                  </button>
                  <button
                    onClick={() => handleFeedback('already_know')}
                    className="w-full text-left px-2 py-1 rounded hover:bg-zinc-800 text-zinc-300 flex items-center gap-1.5"
                  >
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Already know this</span>
                  </button>
                  <button
                    onClick={() => handleFeedback('not_relevant')}
                    className="w-full text-left px-2 py-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 flex items-center gap-1.5"
                  >
                    <EyeOff className="w-3 h-3" />
                    <span>Not relevant</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <Link href={`/watch/${video.id}`}>
          <h3 className="font-bold text-sm text-zinc-100 group-hover:text-blue-400 line-clamp-2 transition-colors leading-snug">
            {video.title}
          </h3>
        </Link>

        {/* Rating Signals */}
        <div className="flex items-center justify-between text-xs text-zinc-400 pt-0.5">
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-white">{rating}</span>
            <span className="text-zinc-500 font-mono text-[11px]">({video.ratingCount} reviews)</span>
          </div>

          <span className="text-[11px] text-zinc-500 font-mono">
            Trust: <strong>{Math.round(video.creatorTrust * 100)}%</strong>
          </span>
        </div>
      </div>

      {/* Why Recommended Explanation Popover (Blueprint Section 5.6) */}
      {showWhyReason && (
        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs space-y-1.5 animate-in fade-in">
          <div className="flex items-center justify-between text-zinc-300">
            <span className="font-bold text-white flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" /> Why this is recommended:
            </span>
            <button
              onClick={() => setShowWhyReason(false)}
              className="text-zinc-500 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <ul className="list-disc list-inside text-zinc-400 text-[11px] space-y-0.5">
            {video.reasonCodes?.map((code, idx) => (
              <li key={idx}><strong>{code}</strong></li>
            ))}
            <li>High topic coverage in <strong>{topic?.name || 'followed curriculum'}</strong></li>
          </ul>
        </div>
      )}
    </div>
  );
}
