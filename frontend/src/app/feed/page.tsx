'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Loader2, Youtube } from 'lucide-react';
import { store } from '@/lib/store';
import { api, FeedItem } from '@/lib/api';
import { VideoCard } from '@/components/VideoCard';
import { useAuth } from '@/lib/auth-context';
import { analytics } from '@/lib/analytics';

export default function FeedPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [feedSource, setFeedSource] = useState<string>('catalog');

  const subjects = store.getSubjects();
  const topics = store.getTopics();
  const playlists = store.getPlaylists();

  const followedTopicIds = user?.followedTopicIds || store.user.followedTopicIds || [];
  const followedSubjectIds = user?.followedSubjectIds || store.user.followedSubjectIds || [];
  const customInterests = user?.customInterests || store.user.customInterests || [];
  const educationLevel = user?.educationLevel || store.user.educationLevel;
  const stream = user?.stream || store.user.stream;

  const topicsKey = followedTopicIds.join(',');
  const subjectsKey = followedSubjectIds.join(',');
  const interestsKey = customInterests.join(',');

  const followedTopics = useMemo(() => {
    return topics.filter(t => followedTopicIds.includes(t.id));
  }, [topics, topicsKey]);

  const followedSubjects = useMemo(() => {
    return subjects.filter(s => followedSubjectIds.includes(s.id));
  }, [subjects, subjectsKey]);

  const buildActiveQueryParams = useCallback(() => {
    if (selectedFilter === 'all') {
      return {
        topics: followedTopicIds,
        subjects: followedSubjectIds,
        stream,
        educationLevel,
        interests: customInterests
      };
    }

    const isSubject = subjects.some(s => s.id === selectedFilter);
    if (isSubject) {
      return {
        subjects: [selectedFilter],
        stream,
        educationLevel
      };
    }

    return {
      topics: [selectedFilter],
      stream,
      educationLevel
    };
  }, [selectedFilter, topicsKey, subjectsKey, interestsKey, stream, educationLevel, subjects]);

  useEffect(() => {
    if (isAuthLoading) return;
    let isMounted = true;
    setIsLoadingFeed(true);

    const params = buildActiveQueryParams();
    api
      .getFeedPaginated(params)
      .then(res => {
        if (!isMounted) return;
        setFeedItems(res.data || []);
        setNextPageToken(res.nextPageToken);
        setFeedSource(res.meta?.source || (res.meta?.hydrated ? 'youtube_api' : 'catalog'));
      })
      .finally(() => {
        if (isMounted) setIsLoadingFeed(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthLoading, buildActiveQueryParams]);

  useEffect(() => {
    analytics.track('feed_impression', {
      totalItems: feedItems.length,
      selectedFilter,
      followedTopicsCount: followedTopics.length
    });
  }, [selectedFilter, feedItems.length, followedTopics.length]);

  const handleLoadMore = async () => {
    if (!nextPageToken || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const params = buildActiveQueryParams();
      const res = await api.getFeedPaginated({ ...params, pageToken: nextPageToken });
      setNextPageToken(res.nextPageToken);
      if (Array.isArray(res.data) && res.data.length > 0) {
        setFeedItems(prev => {
          const seen = new Set(prev.map(item => item.video.id));
          const fresh = res.data.filter(item => !seen.has(item.video.id));
          return [...prev, ...fresh];
        });
      }
    } finally {
      setIsLoadingMore(false);
    }
  };

  const relevantPlaylists = useMemo(() => {
    return playlists.filter(p =>
      followedTopicIds.includes(p.topicId) ||
      followedSubjects.some(s => {
        const top = topics.find(t => t.id === p.topicId);
        return top && top.subjectId === s.id;
      })
    ).slice(0, 3);
  }, [playlists, topicsKey, followedSubjects, topics]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Your Feed</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Youtube className="w-3.5 h-3.5" />
              {feedSource === 'youtube_api' ? 'Live YouTube Stream' : 'Stream-Focused YouTube Feed'}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            {educationLevel && educationLevel !== 'not_specified' ? educationLevel : 'Universal Learner'}
            {stream && stream !== 'none' ? ` · ${stream}` : ''}
            {followedSubjects.length > 0 ? ` · Strictly filtered to ${followedSubjects.map(s => s.name).join(', ')}` : ''}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/profile"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium transition-colors"
          >
            Edit Stream
          </Link>
          <Link
            href="/settings/interests"
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-sm font-medium transition-colors border border-slate-300"
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
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100'
          }`}
        >
          All in My Stream {selectedFilter === 'all' ? `(${feedItems.length})` : ''}
        </button>

        {followedSubjects.map(sub => (
          <button
            key={sub.id}
            onClick={() => setSelectedFilter(sub.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors shrink-0 ${
              selectedFilter === sub.id
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100'
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
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {topic.name}
          </button>
        ))}
      </div>

      {/* Video Grid / Loading Skeleton */}
      {isLoadingFeed ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 animate-pulse">
              <div className="aspect-video rounded-xl bg-slate-200" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : feedItems.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedItems.map(({ video, topic }) => (
              <VideoCard
                key={video.id}
                video={video}
                topic={topic}
              />
            ))}
          </div>

          {nextPageToken && (
            <div className="flex justify-center pt-2">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 text-sm font-semibold shadow-xs inline-flex items-center gap-2 transition-colors disabled:opacity-60"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    <span>Loading more YouTube lessons...</span>
                  </>
                ) : (
                  <span>Load More Lessons from YouTube</span>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-14 text-center border border-slate-200 rounded-2xl bg-white space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">No videos match this stream filter yet</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Update your stream or subjects in Profile, or search YouTube directly for any topic.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/profile"
              className="inline-block px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Adjust Stream
            </Link>
            <Link
              href="/search"
              className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
            >
              Search on YouTube
            </Link>
          </div>
        </div>
      )}

      {/* Compact Curated Learning Paths */}
      {relevantPlaylists.length > 0 && selectedFilter === 'all' && (
        <div className="pt-6 border-t border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recommended Learning Paths</h2>
            <Link href="/playlists" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relevantPlaylists.map(pl => (
              <Link
                key={pl.id}
                href={`/playlists/${pl.id}`}
                className="p-5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm transition-all space-y-1.5 block"
              >
                <div className="text-xs text-slate-500">
                  {pl.items.length} lessons · ~{pl.estimatedTotalMinutes}m
                </div>
                <h3 className="text-base font-semibold text-slate-900 truncate">{pl.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
