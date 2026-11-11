'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { store } from '@/lib/store';
import { api } from '@/lib/api';
import { Video, Topic } from '@/lib/types';
import { VideoCard } from '@/components/VideoCard';

export default function TopicDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [, setRerender] = useState({});

  const [topic, setTopic] = useState<Topic | undefined>(() => store.getTopicBySlug(slug));
  const [videos, setVideos] = useState<Video[]>(() => {
    const t = store.getTopicBySlug(slug);
    return t ? store.getVideos(t.id) : [];
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;
    setIsLoading(true);

    api
      .getTopicBySlug(slug)
      .then(res => {
        if (!isMounted || !res) return;
        setTopic(res.topic);
        setVideos(res.videos || []);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (!topic && isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center space-y-3">
        <Loader2 className="w-7 h-7 text-indigo-600 animate-spin mx-auto" />
        <p className="text-sm text-slate-600">Loading topic lessons...</p>
      </div>
    );
  }

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

      {isLoading && videos.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 animate-pulse">
              <div className="aspect-video rounded-xl bg-slate-200" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              topic={topic}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center border border-slate-200 rounded-2xl bg-white space-y-3">
          <p className="text-sm text-slate-600">No lectures discovered for this topic yet.</p>
          <Link
            href={`/search?q=${encodeURIComponent(topic.name)}`}
            className="inline-block px-5 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            Search YouTube for {topic.name}
          </Link>
        </div>
      )}
    </div>
  );
}
