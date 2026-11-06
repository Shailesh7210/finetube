'use client';

import { useState } from 'react';
import Link from 'next/link';
import { store } from '@/lib/store';

export default function TopicsPage() {
  const [, setRerender] = useState({});
  const topics = store.getTopics();
  const followedSet = new Set(store.user.followedTopicIds);

  const handleToggle = (id: string) => {
    store.toggleFollowTopic(id);
    setRerender({});
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-xl font-semibold text-white">Topics</h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Follow topics to customize what appears in your feed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map(topic => {
          const isFollowed = followedSet.has(topic.id);
          const count = store.getVideos(topic.id).length;

          return (
            <div
              key={topic.id}
              className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <Link href={`/topics/${topic.slug}`}>
                    <h2 className="text-sm font-semibold text-zinc-100 hover:text-blue-400 transition-colors">
                      {topic.name}
                    </h2>
                  </Link>

                  <button
                    onClick={() => handleToggle(topic.id)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      isFollowed
                        ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                        : 'bg-zinc-100 text-zinc-950 hover:bg-white'
                    }`}
                  >
                    {isFollowed ? 'Following' : 'Follow'}
                  </button>
                </div>

                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  {topic.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-800/60">
                <span>{count} videos</span>
                <Link href={`/topics/${topic.slug}`} className="text-zinc-400 hover:text-white">
                  View topic →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
