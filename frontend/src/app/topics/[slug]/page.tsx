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
        <h2 className="text-lg font-medium text-slate-900">Topic not found</h2>
        <Link href="/topics" className="text-sm text-indigo-600 hover:underline">
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
      <Link href="/topics" className="text-sm text-slate-500 hover:text-slate-900 inline-flex items-center gap-1.5">
        <ArrowLeft className="w-4 h-4" /> Topics
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{topic.name}</h1>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">{topic.description}</p>
        </div>

        <button
          onClick={handleToggle}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors self-start sm:self-auto ${
            isFollowed
              ? 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          {isFollowed ? 'Following' : 'Follow Topic'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(video => (
          <VideoCard
            key={video.id}
            video={video}
            topic={topic}
          />
        ))}
      </div>
    </div>
  );
}
