'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { store } from '@/lib/store';
import { VideoCard } from '@/components/VideoCard';
import { useAuth } from '@/lib/auth-context';
import { analytics } from '@/lib/analytics';
import { Sparkles, SlidersHorizontal, BookOpen, Layers, GraduationCap, ArrowRight } from 'lucide-react';

export default function FeedPage() {
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  const subjects = store.getSubjects();
  const topics = store.getTopics();
  const allFeedItems = store.getFocusedFeed();
  const playlists = store.getPlaylists();

  const followedTopicIds = user?.followedTopicIds || store.user.followedTopicIds || [];
  const followedSubjectIds = user?.followedSubjectIds || store.user.followedSubjectIds || [];
  const customInterests = user?.customInterests || store.user.customInterests || [];
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
    // Check if filter is a subject ID
    const matchingSubject = subjects.find(s => s.id === selectedFilter);
    if (matchingSubject) {
      const topicIdsInSubject = topics.filter(t => t.subjectId === matchingSubject.id).map(t => t.id);
      return allFeedItems.filter(item => topicIdsInSubject.includes(item.video.primaryTopicId));
    }
    // Check if filter is a topic ID
    return allFeedItems.filter(item => item.video.primaryTopicId === selectedFilter);
  }, [allFeedItems, selectedFilter, subjects, topics]);

  // Recommended playlists matching learner profile
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      {/* Learner Profile Context Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-zinc-950 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
              <GraduationCap className="w-3 h-3" />
              {educationLevel && educationLevel !== 'not_specified' ? educationLevel : 'Universal Learner'}
              {stream && stream !== 'none' ? ` · ${stream}` : ''}
            </span>

            {user?.strictFocusMode !== false && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Strict Focus Active
              </span>
            )}
          </div>

          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Personalized Educational Feed
          </h1>

          <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
            Curated exclusively for your selected <strong>subjects</strong>, <strong>curriculum topics</strong>, and <strong>custom learning goals</strong>. Unrelated entertainment and distractions are filtered out.
          </p>

          {/* Quick Active Tags */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {followedSubjects.map(sub => (
              <span key={sub.id} className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-medium border border-zinc-700/60">
                {sub.name}
              </span>
            ))}
            {customInterests.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-purple-950/40 text-purple-300 font-medium border border-purple-800/40">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/profile"
            className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors border border-zinc-700"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Customize Profile</span>
          </Link>
          <Link
            href="/settings/interests"
            className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium inline-flex items-center gap-1.5 transition-colors border border-zinc-800"
          >
            <span>Interest Settings</span>
          </Link>
        </div>
      </div>

      {/* Feed Filters */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
              selectedFilter === 'all'
                ? 'bg-zinc-100 text-zinc-950 font-semibold'
                : 'text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800'
            }`}
          >
            All Followed (<strong>{allFeedItems.length}</strong>)
          </button>

          {/* Subject Pills */}
          {followedSubjects.map(sub => (
            <button
              key={sub.id}
              onClick={() => setSelectedFilter(sub.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
                selectedFilter === sub.id
                  ? 'bg-zinc-100 text-zinc-950 font-semibold'
                  : 'text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800'
              }`}
            >
              {sub.name}
            </button>
          ))}

          {/* Individual Topic Pills */}
          {followedTopics.map(topic => (
            <button
              key={topic.id}
              onClick={() => setSelectedFilter(topic.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
                selectedFilter === topic.id
                  ? 'bg-zinc-100 text-zinc-950 font-semibold'
                  : 'text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800'
              }`}
            >
              {topic.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/topics"
            className="text-xs text-zinc-500 hover:text-zinc-300 shrink-0 hidden sm:inline"
          >
            Curriculum <strong>taxonomy</strong> →
          </Link>
        </div>
      </div>

      {/* Recommended Playlists Bar (if matching user profile) */}
      {relevantPlaylists.length > 0 && selectedFilter === 'all' && (
        <div className="space-y-3 p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Curated Learning Paths for Your Subjects
              </h2>
            </div>
            <Link href="/playlists" className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {relevantPlaylists.map(pl => (
              <Link
                key={pl.id}
                href={`/playlists/${pl.id}`}
                className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 transition-colors space-y-1 block"
              >
                <div className="flex items-center justify-between text-[11px] text-zinc-500">
                  <span className="font-mono text-amber-400">{pl.items.length} lectures</span>
                  <span>~{pl.estimatedTotalMinutes} mins</span>
                </div>
                <h3 className="text-xs font-semibold text-white truncate">{pl.title}</h3>
                <p className="text-[11px] text-zinc-400 line-clamp-1">{pl.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

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

      {filteredFeed.length === 0 && (
        <div className="p-12 text-center border border-zinc-800 rounded-xl bg-zinc-900/20 space-y-3">
          <Sparkles className="w-6 h-6 text-zinc-500 mx-auto" />
          <h3 className="text-sm font-semibold text-white">No videos matching this filter</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            You can search YouTube directly for any subject or topic, or explore new curricula in your profile.
          </p>
          <Link
            href="/search"
            className="inline-block px-4 py-2 rounded-lg bg-zinc-100 text-zinc-950 text-xs font-bold hover:bg-white transition-colors"
          >
            Discover Videos on YouTube
          </Link>
        </div>
      )}
    </div>
  );
}
