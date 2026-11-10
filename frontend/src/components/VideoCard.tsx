'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, MoreVertical, X } from 'lucide-react';
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

  const handleFeedback = async (action: 'not_relevant' | 'already_know' | 'more_like_this' | 'mute_topic') => {
    setShowMenu(false);
    setFeedbackState(action);
    await api.sendFeedFeedback(video.id, action, video.primaryTopicId);
  };

  if (feedbackState === 'not_relevant' || feedbackState === 'already_know') {
    return (
      <div className="p-5 rounded-xl bg-zinc-900/30 border border-zinc-800/60 text-sm text-zinc-500 flex items-center justify-between">
        <span>
          {feedbackState === 'not_relevant' ? 'Marked not relevant.' : 'Marked already learned.'}
        </span>
        <button
          onClick={() => setFeedbackState(null)}
          className="text-zinc-400 hover:text-white underline text-xs"
        >
          Undo
        </button>
      </div>
    );
  }

  return (
    <div className="group flex flex-col space-y-3 relative">
      {/* Clean Thumbnail */}
      <Link
        href={`/watch/${video.id}`}
        className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800/80 block"
      >
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
          loading="lazy"
        />
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/85 text-xs font-mono font-semibold text-zinc-200">
          {formatDuration(video.durationSeconds)}
        </div>
      </Link>

      {/* Clean Meta & Title */}
      <div className="space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/watch/${video.id}`} className="flex-1">
            <h3 className="font-semibold text-base text-zinc-100 group-hover:text-blue-400 line-clamp-2 transition-colors leading-snug">
              {video.title}
            </h3>
          </Link>

          <div className="relative shrink-0">
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowMenu(!showMenu);
              }}
              className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors"
              aria-label="Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-7 z-30 w-44 rounded-xl bg-zinc-900 border border-zinc-800 p-1.5 shadow-xl text-xs space-y-1">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowWhyReason(true);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300"
                >
                  Why recommended?
                </button>
                <button
                  onClick={() => handleFeedback('more_like_this')}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300"
                >
                  More like this
                </button>
                <button
                  onClick={() => handleFeedback('already_know')}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300"
                >
                  Already know this
                </button>
                <button
                  onClick={() => handleFeedback('not_relevant')}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-rose-400"
                >
                  Not relevant
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-400 pt-0.5">
          <div className="flex items-center gap-2 truncate">
            <span className="truncate">{video.channelTitle}</span>
            {topic && (
              <>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-300 font-medium truncate">{topic.name}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-zinc-200">{rating}</span>
          </div>
        </div>
      </div>

      {showWhyReason && (
        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs space-y-1.5">
          <div className="flex items-center justify-between text-zinc-200 font-semibold">
            <span>Why recommended</span>
            <button
              onClick={() => setShowWhyReason(false)}
              className="text-zinc-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <ul className="list-disc list-inside text-zinc-400 space-y-0.5">
            {video.reasonCodes?.map((code, idx) => (
              <li key={idx}>{code}</li>
            ))}
            <li>Topic: <strong>{topic?.name || 'Your curriculum'}</strong></li>
          </ul>
        </div>
      )}
    </div>
  );
}
