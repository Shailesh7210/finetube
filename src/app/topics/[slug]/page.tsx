'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Check, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  Layers, 
  GraduationCap 
} from 'lucide-react';
import { store } from '../../../lib/store';
import { VideoCard } from '../../../components/VideoCard';

export default function TopicDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [, setRerender] = useState({});

  const topic = store.getTopicBySlug(slug);

  if (!topic) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Topic Not Found</h2>
        <Link href="/topics" className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 rounded text-xs text-white">
          <ArrowLeft className="w-4 h-4" /> Back to Taxonomy
        </Link>
      </div>
    );
  }

  const isFollowed = store.user.followedTopicIds.includes(topic.id);
  const videos = store.getVideos(topic.id);
  const topicPlaylists = store.getPlaylists().filter(p => p.topicId === topic.id);

  const handleToggle = () => {
    store.toggleFollowTopic(topic.id);
    setRerender({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Breadcrumb */}
      <div>
        <Link href="/topics" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to All Topics
        </Link>
      </div>

      {/* Topic Header Hero */}
      <div className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs text-brand-400 font-semibold mb-1 uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              Educational Domain
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {topic.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              {topic.description}
            </p>
          </div>

          <button
            onClick={handleToggle}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-all self-start sm:self-auto ${
              isFollowed
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-brand-600 hover:bg-brand-500 text-white'
            }`}
          >
            {isFollowed ? (
              <>
                <Check className="w-4 h-4" />
                <span>Following in Feed</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Follow This Topic</span>
              </>
            )}
          </button>
        </div>

        {/* Concept Checklist Banner */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Core Concept Checklist ({topic.conceptChecklist.length} Concepts Tracked)
          </span>
          <div className="flex flex-wrap gap-2">
            {topic.conceptChecklist.map((c, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 font-mono"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Structured Playlists for this Topic */}
      {topicPlaylists.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-400" />
              AI Learning Paths for {topic.name}
            </h2>
            <Link href="/playlists" className="text-xs text-brand-400 hover:underline">
              View all paths →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topicPlaylists.map(pl => (
              <Link
                key={pl.id}
                href={`/playlists/${pl.id}`}
                className="bg-slate-900/60 hover:bg-slate-900 rounded-xl p-5 border border-slate-800 hover:border-brand-500/50 transition-all flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 font-semibold text-[10px] uppercase">
                      {pl.type} Sequence
                    </span>
                    <span>{pl.items.length} Lessons • {pl.estimatedTotalMinutes} mins</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                    {pl.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {pl.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                  <span>Covers: {pl.coveredConcepts.slice(0, 3).join(', ')}...</span>
                  <span className="text-brand-400 font-medium">Open Path →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Topic Ranked Videos */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-400" />
            Top Ranked Explanations
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranked by Bayesian learner consensus and verified concept coverage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              topic={topic}
              showRankScore={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
