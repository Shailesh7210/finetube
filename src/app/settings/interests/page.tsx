'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  SlidersHorizontal, 
  ShieldCheck, 
  Check, 
  VolumeX, 
  RotateCcw, 
  Sparkles, 
  Compass, 
  ArrowLeft 
} from 'lucide-react';
import { store } from '../../../lib/store';

export default function InterestsPage() {
  const [, setRerender] = useState({});
  const topics = store.getTopics();
  const user = store.user;

  const handleToggleFollow = (topicId: string) => {
    store.toggleFollowTopic(topicId);
    setRerender({});
  };

  const handleToggleMute = (topicId: string) => {
    store.toggleMuteTopic(topicId);
    setRerender({});
  };

  const handleReset = () => {
    store.user.followedTopicIds = ['react_hooks', 'binary_search_trees'];
    store.user.mutedTopicIds = [];
    setRerender({});
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full space-y-8">
      {/* Breadcrumb */}
      <div>
        <Link href="/" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Feed
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 text-xs text-brand-400 font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          Anti-Distraction Recommendation Controls
        </div>
        <h1 className="text-2xl font-bold text-white">Manage Topics & Feed Filtering</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          In FineTube, you control what you see. We do not automatically hijack your feed based on casual clicks or background video playback.
        </p>
      </div>

      {/* Action to reset */}
      <div className="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-white">Reset Interests to Pilot Baseline</h3>
          <p className="text-xs text-slate-400">Restore default focus (React Hooks & Binary Search Trees)</p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Feed</span>
        </button>
      </div>

      {/* Topics List with explicit controls */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Compass className="w-4 h-4 text-brand-400" />
          Curriculum Topic Controls
        </h2>

        <div className="space-y-3">
          {topics.map(topic => {
            const isFollowed = user.followedTopicIds.includes(topic.id);
            const isMuted = user.mutedTopicIds.includes(topic.id);

            return (
              <div
                key={topic.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{topic.name}</h3>
                    {isFollowed && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                        In Feed
                      </span>
                    )}
                    {isMuted && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
                        Muted
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{topic.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleFollow(topic.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isFollowed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-brand-600 hover:bg-brand-500 text-white'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isFollowed ? 'Followed' : 'Follow'}</span>
                  </button>

                  <button
                    onClick={() => handleToggleMute(topic.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      isMuted
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                    title="Mute topic completely from feed and recommendations"
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>{isMuted ? 'Muted' : 'Mute'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
