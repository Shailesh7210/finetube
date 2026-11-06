'use client';

import { useState } from 'react';
import Link from 'next/link';
import { store } from '@/lib/store';
import { VideoCard } from '@/components/VideoCard';

export default function HomePage() {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const allFeedItems = store.getFocusedFeed();
  const topics = store.getTopics();
  const followedTopics = topics.filter(t => store.user.followedTopicIds.includes(t.id));

  const filteredFeed = selectedTopicId === 'all'
    ? allFeedItems
    : allFeedItems.filter(item => item.video.primaryTopicId === selectedTopicId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      {/* Feed Filters */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setSelectedTopicId('all')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
              selectedTopicId === 'all'
                ? 'bg-zinc-100 text-zinc-950 font-semibold'
                : 'text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800'
            }`}
          >
            All Followed
          </button>

          {followedTopics.map(topic => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopicId(topic.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
                selectedTopicId === topic.id
                  ? 'bg-zinc-100 text-zinc-950 font-semibold'
                  : 'text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800'
              }`}
            >
              {topic.name}
            </button>
          ))}
        </div>

        <Link
          href="/topics"
          className="text-xs text-zinc-500 hover:text-zinc-300 shrink-0 hidden sm:inline"
        >
          Manage topics
        </Link>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
        {filteredFeed.map(({ video, topic }) => (
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
