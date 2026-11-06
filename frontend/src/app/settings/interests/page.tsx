'use client';

import { useState } from 'react';
import Link from 'next/link';
import { store } from '@/lib/store';

export default function InterestsPage() {
  const [, setRerender] = useState({});
  const topics = store.getTopics();
  const user = store.user;

  const handleToggle = (id: string) => {
    store.toggleFollowTopic(id);
    setRerender({});
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-xl font-semibold text-white">Feed Preferences</h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Select topics to include in your feed. FineTube only recommends videos from followed topics.
        </p>
      </div>

      <div className="space-y-3">
        {topics.map(topic => {
          const isFollowed = user.followedTopicIds.includes(topic.id);

          return (
            <div
              key={topic.id}
              className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800 flex items-center justify-between gap-4"
            >
              <div>
                <h3 className="text-sm font-medium text-white">{topic.name}</h3>
                <p className="text-xs text-zinc-400 mt-0.5">{topic.description}</p>
              </div>

              <button
                onClick={() => handleToggle(topic.id)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors shrink-0 ${
                  isFollowed
                    ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    : 'bg-zinc-100 text-zinc-950 hover:bg-white'
                }`}
              >
                {isFollowed ? 'Following' : 'Follow'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
