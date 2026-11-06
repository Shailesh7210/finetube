'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { store } from '@/lib/store';
import { VideoCard } from '@/components/VideoCard';

export default function TopicDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [, setRerender] = useState({});

  const topic = store.getTopicBySlug(slug);

  if (!topic) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-3">
        <h2 className="text-base font-medium text-white">Topic not found</h2>
        <Link href="/topics" className="text-xs text-blue-400 hover:underline">
          All topics
        </Link>
      </div>
    );
  }

  const isFollowed = store.user.followedTopicIds.includes(topic.id);
  const videos = store.getVideos(topic.id);

  const handleToggle = () => {
    store.toggleFollowTopic(topic.id);
    setRerender({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      <Link href="/topics" className="text-xs text-zinc-500 hover:text-zinc-300 inline-flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Topics
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{topic.name}</h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">{topic.description}</p>
        </div>

        <button
          onClick={handleToggle}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors self-start sm:self-auto ${
            isFollowed
              ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              : 'bg-zinc-100 text-zinc-950 hover:bg-white'
          }`}
        >
          {isFollowed ? 'Following' : 'Follow Topic'}
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
          {videos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              topic={topic}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
