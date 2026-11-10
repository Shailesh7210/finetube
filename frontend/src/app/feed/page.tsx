'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { store } from '@/lib/store';
import { VideoCard } from '@/components/VideoCard';
import { useAuth } from '@/lib/auth-context';
import { analytics } from '@/lib/analytics';

export default function FeedPage() {
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const subjects = store.getSubjects();
  const topics = store.getTopics();
  const allFeedItems = store.getFocusedFeed();
  const playlists = store.getPlaylists();

  const followedTopicIds = user?.followedTopicIds || store.user.followedTopicIds || [];
  const followedSubjectIds = user?.followedSubjectIds || store.user.followedSubjectIds || [];
  const educationLevel = user?.educationLevel || store.user.educationLevel;
  const stream = user?.stream || store.user.stream;

  const followedTopics = useMemo(() => {
    return topics.filter(t => followedTopicIds.includes(t.id));
  }, [topics, followedTopicIds]);

  const followedSubjects = useMemo(() => {
    return subjects.filter(s => followedSubjectIds.includes(s.id));
  }, [subjects, followedSubjectIds]);

  useEffect(() => {
    analytics.track('feed_impression', {
      totalItems: allFeedItems.length,
      selectedFilter,
      followedTopicsCount: followedTopics.length
    });
  }, [selectedFilter, allFeedItems.length, followedTopics.length]);

  const filteredFeed = useMemo(() => {
    if (selectedFilter === 'all') return allFeedItems;
    const matchingSubject = subjects.find(s => s.id === selectedFilter);
    if (matchingSubject) {
      const topicIdsInSubject = topics.filter(t => t.subjectId === matchingSubject.id).map(t => t.id);
      return allFeedItems.filter(item => topicIdsInSubject.includes(item.video.primaryTopicId));
    }
    return allFeedItems.filter(item => item.video.primaryTopicId === selectedFilter);
  }, [allFeedItems, selectedFilter, subjects, topics]);

  const relevantPlaylists = useMemo(() => {
    return playlists.filter(p =>
      followedTopicIds.includes(p.topicId) ||
      followedSubjects.some(s => {
        const top = topics.find(t => t.id === p.topicId);
        return top && top.subjectId === s.id;
      })
    ).slice(0, 3);
  }, [playlists, followedTopicIds, followedSubjects, topics]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full space-y-7">
      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Your Feed</h1>
          <p className="text-sm text-zinc-400">
            {educationLevel && educationLevel !== 'not_specified' ? educationLevel : 'Universal Learner'}
            {stream && stream !== 'none' ? ` · ${stream}` : ''}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/profile"
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium transition-colors"
          >
            Edit Profile
          </Link>
          <Link
            href="/settings/interests"
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-sm font-medium transition-colors border border-zinc-800"
          >
            Interests
          </Link>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none pb-1">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors shrink-0 ${
            selectedFilter === 'all'
              ? 'bg-zinc-100 text-zinc-950 font-semibold'
              : 'text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800'
          }`}
        >
          All ({allFeedItems.length})
        </button>

        {followedSubjects.map(sub => (
          <button
            key={sub.id}
            onClick={() => setSelectedFilter(sub.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors shrink-0 ${
              selectedFilter === sub.id
                ? 'bg-zinc-100 text-zinc-950 font-semibold'
                : 'text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800'
            }`}
          >
            {sub.name}
          </button>
        ))}

        {followedTopics.map(topic => (
          <button
            key={topic.id}
            onClick={() => setSelectedFilter(topic.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors shrink-0 ${
              selectedFilter === topic.id
                ? 'bg-zinc-100 text-zinc-950 font-semibold'
                : 'text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800'
            }`}
          >
            {topic.name}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeed.map(({ video, topic }) => (
          <VideoCard
            key={video.id}
            video={video}
            topic={topic}
          />
        ))}
      </div>

      {filteredFeed.length === 0 && (
        <div className="p-14 text-center border border-zinc-800 rounded-2xl bg-zinc-900/20 space-y-4">
          <h3 className="text-lg font-semibold text-white">No videos match this filter</h3>
          <Link
            href="/search"
            className="inline-block px-5 py-2.5 rounded-xl bg-zinc-100 text-zinc-950 text-sm font-semibold hover:bg-white transition-colors"
          >
            Discover on YouTube
          </Link>
        </div>
      )}

      {/* Compact Curated Learning Paths */}
      {relevantPlaylists.length > 0 && selectedFilter === 'all' && (
        <div className="pt-6 border-t border-zinc-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Recommended Learning Paths</h2>
            <Link href="/playlists" className="text-sm text-zinc-400 hover:text-white transition-colors">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relevantPlaylists.map(pl => (
              <Link
                key={pl.id}
                href={`/playlists/${pl.id}`}
                className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-colors space-y-1.5 block"
              >
                <div className="text-xs text-zinc-500">
                  {pl.items.length} lessons · ~{pl.estimatedTotalMinutes}m
                </div>
                <h3 className="text-base font-semibold text-white truncate">{pl.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
