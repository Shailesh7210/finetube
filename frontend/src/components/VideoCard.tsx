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
      <div className="p-5 rounded-xl bg-white border border-slate-200 text-sm text-slate-500 flex items-center justify-between">
        <span>
          {feedbackState === 'not_relevant' ? 'Marked not relevant.' : 'Marked already learned.'}
        </span>
        <button
          onClick={() => setFeedbackState(null)}
          className="text-indigo-600 hover:underline text-xs font-medium"
        >
          Undo
        </button>
      </div>
    );
  }

  return (
    <div className="group flex flex-col space-y-3 relative">
      {/* Thumbnail */}
      <Link
        href={`/watch/${video.id}`}
        className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-200 border border-slate-200 block shadow-xs"
      >
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
          loading="lazy"
        />
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-900/85 text-xs font-mono font-semibold text-white">
          {formatDuration(video.durationSeconds)}
        </div>
      </Link>

      {/* Meta & Title */}
      <div className="space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/watch/${video.id}`} className="flex-1">
            <h3 className="font-semibold text-base text-slate-900 group-hover:text-indigo-600 line-clamp-2 transition-colors leading-snug">
              {video.title}
            </h3>
          </Link>

          <div className="relative shrink-0">
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowMenu(!showMenu);
              }}
              className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
              aria-label="Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-7 z-30 w-44 rounded-xl bg-white border border-slate-200 p-1.5 shadow-lg text-xs space-y-1">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowWhyReason(true);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700"
                >
                  Why recommended?
                </button>
                <button
                  onClick={() => handleFeedback('more_like_this')}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700"
                >
                  More like this
                </button>
                <button
                  onClick={() => handleFeedback('already_know')}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700"
                >
                  Already know this
                </button>
                <button
                  onClick={() => handleFeedback('not_relevant')}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-rose-50 text-slate-600 hover:text-rose-600"
                >
                  Not relevant
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
          <div className="flex items-center gap-2 truncate">
            <span className="truncate font-medium text-slate-600">{video.channelTitle}</span>
            {topic && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-indigo-600 font-medium truncate">{topic.name}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-slate-800">{rating}</span>
          </div>
        </div>
      </div>

      {showWhyReason && (
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-xs space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-900 font-semibold">
            <span>Why recommended</span>
            <button
              onClick={() => setShowWhyReason(false)}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <ul className="list-disc list-inside text-slate-600 space-y-0.5">
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
