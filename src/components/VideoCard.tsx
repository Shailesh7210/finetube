import Link from 'next/link';
import { Play, Award, CheckCircle, Clock, Star, Sparkles, BookOpen } from 'lucide-react';
import { Video, Topic } from '@/lib/types';
import { formatDuration, formatTimestamp } from '@/lib/utils';
import { calculateBayesianRating, calculateTopicScore } from '@/lib/ranking';

interface VideoCardProps {
  video: Video;
  topic?: Topic;
  showRankScore?: boolean;
}

export function VideoCard({ video, topic, showRankScore = true }: VideoCardProps) {
  const ranking = calculateTopicScore(video, topic);
  const bayesianRating = calculateBayesianRating(video.ratingAverage, video.ratingCount);

  return (
    <div className="group flex flex-col bg-slate-900/60 rounded-xl border border-slate-800/80 hover:border-brand-500/50 hover:bg-slate-900 transition-all duration-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-brand-950/20">
      {/* Thumbnail with overlay badges */}
      <Link href={`/watch/${video.id}`} className="relative aspect-video w-full overflow-hidden bg-slate-950 block">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Play hover overlay */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[11px] font-mono text-slate-200 flex items-center gap-1 backdrop-blur-sm">
          <Clock className="w-3 h-3 text-slate-400" />
          {formatDuration(video.durationSeconds)}
        </div>

        {/* Topic Score Badge */}
        {showRankScore && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-slate-950/85 border border-brand-500/40 backdrop-blur-md flex items-center gap-1.5 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-xs font-semibold text-brand-300 font-mono">
              {ranking.score}
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Score</span>
          </div>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Primary Topic & Channel */}
          <div className="flex items-center justify-between gap-2 mb-1.5 text-xs">
            <span className="text-slate-400 font-medium truncate">
              {video.channelTitle}
            </span>
            {topic && (
              <span className="px-2 py-0.5 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 text-[11px] font-medium shrink-0">
                {topic.name}
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/watch/${video.id}`}>
            <h3 className="font-semibold text-slate-100 group-hover:text-brand-300 text-sm sm:text-base leading-snug line-clamp-2 transition-colors">
              {video.title}
            </h3>
          </Link>

          {/* Description snippet */}
          <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {video.description}
          </p>
        </div>

        {/* Explainability Reason Codes (Blueprint Section 5.6) */}
        {ranking.reasonCodes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {ranking.reasonCodes.slice(0, 2).map((reason, idx) => (
              <span 
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50"
              >
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                {reason}
              </span>
            ))}
          </div>
        )}

        {/* Bottom meta: Bayesian Rating & Concept count */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium text-slate-200">{bayesianRating}</span>
            <span className="text-[11px] text-slate-500 font-mono">({video.ratingCount} reviews)</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <BookOpen className="w-3 h-3 text-brand-400" />
            <span>{video.topicCoverage.length} concepts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
