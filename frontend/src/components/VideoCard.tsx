import Link from 'next/link';
import { Star } from 'lucide-react';
import { Video, Topic } from '@/lib/types';
import { formatDuration } from '@/lib/utils';
import { calculateBayesianRating } from '@/lib/ranking';

interface VideoCardProps {
  video: Video;
  topic?: Topic;
}

export function VideoCard({ video, topic }: VideoCardProps) {
  const rating = calculateBayesianRating(video.ratingAverage, video.ratingCount);

  return (
    <div className="group flex flex-col space-y-2.5">
      {/* Thumbnail */}
      <Link href={`/watch/${video.id}`} className="relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800/60 block">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
          loading="lazy"
        />
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-zinc-300">
          {formatDuration(video.durationSeconds)}
        </div>
      </Link>

      {/* Meta */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>{video.channelTitle}</span>
          {topic && (
            <span className="text-zinc-400 text-[11px]">{topic.name}</span>
          )}
        </div>

        <Link href={`/watch/${video.id}`}>
          <h3 className="font-medium text-sm text-zinc-100 group-hover:text-blue-400 line-clamp-2 transition-colors leading-snug">
            {video.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5 text-xs text-zinc-400 pt-0.5">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="font-medium text-zinc-200">{rating}</span>
          <span className="text-zinc-600">({video.ratingCount})</span>
        </div>
      </div>
    </div>
  );
}
