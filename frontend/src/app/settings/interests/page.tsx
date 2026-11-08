'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, VolumeX, Check, Shield } from 'lucide-react';
import { store } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';

export default function InterestsPage() {
  const { user, updateProfile } = useAuth();
  const [, setRerender] = useState({});
  const [resetNotice, setResetNotice] = useState(false);

  const topics = store.getTopics();
  const followedIds = user?.followedTopicIds || store.user.followedTopicIds;
  const mutedIds = user?.mutedTopicIds || store.user.mutedTopicIds || [];

  const handleToggleFollow = (id: string) => {
    store.toggleFollowTopic(id);
    const newFollowed = followedIds.includes(id)
      ? followedIds.filter(f => f !== id)
      : [...followedIds, id];
    updateProfile({ followedTopicIds: newFollowed });
    setRerender({});
  };

  const handleToggleMute = (id: string) => {
    const newMuted = mutedIds.includes(id)
      ? mutedIds.filter(m => m !== id)
      : [...mutedIds, id];
    // If muting, remove from followed
    const newFollowed = newMuted.includes(id)
      ? followedIds.filter(f => f !== id)
      : followedIds;

    store.user.mutedTopicIds = newMuted;
    store.user.followedTopicIds = newFollowed;
    updateProfile({ mutedTopicIds: newMuted, followedTopicIds: newFollowed });
    setRerender({});
  };

  const handleToggleStrictFocus = () => {
    const current = user?.strictFocusMode ?? true;
    updateProfile({ strictFocusMode: !current });
    setRerender({});
  };

  const handleResetRecommendations = () => {
    const defaultTopics = ['react_hooks', 'binary_search_trees'];
    store.user.followedTopicIds = defaultTopics;
    store.user.mutedTopicIds = [];
    updateProfile({ followedTopicIds: defaultTopics, mutedTopicIds: [] });
    setResetNotice(true);
    setTimeout(() => setResetNotice(false), 2000);
    setRerender({});
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      {/* Back button */}
      <Link
        href="/profile"
        className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Profile
      </Link>

      {/* Header */}
      <div className="border-b border-zinc-800 pb-5">
        <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Blueprint §2.3</span>
        <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">Feed & Interest Controls</h1>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
          Manage your <strong>explicitly followed topics</strong>, <strong>muted subjects</strong>, and <strong>recommendation strictness</strong>. FineTube never uses passive watch duration alone to alter your feed.
        </p>
      </div>

      {/* Strict Focus Mode Toggle */}
      <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Strict Focus Mode</h3>
          </div>
          <p className="text-xs text-zinc-400">
            When enabled, your feed serves <strong>only explicitly followed topics</strong>. Related topic exploration is kept separate.
          </p>
        </div>

        <button
          onClick={handleToggleStrictFocus}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
            user?.strictFocusMode !== false
              ? 'bg-indigo-600 text-white'
              : 'bg-zinc-800 text-zinc-400'
          }`}
        >
          {user?.strictFocusMode !== false ? 'Enabled' : 'Disabled'}
        </button>
      </div>

      {/* Topics Control List */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-zinc-200">Curriculum Topic Subscriptions</h2>

        <div className="space-y-2.5">
          {topics.map(topic => {
            const isFollowed = followedIds.includes(topic.id);
            const isMuted = mutedIds.includes(topic.id);

            return (
              <div
                key={topic.id}
                className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{topic.name}</h3>
                    {isMuted && (
                      <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-500/20">
                        Muted
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-md">{topic.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleMute(topic.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      isMuted
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                    }`}
                    title={isMuted ? 'Unmute topic' : 'Mute topic'}
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleToggleFollow(topic.id)}
                    disabled={isMuted}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-30 ${
                      isFollowed
                        ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                        : 'bg-white text-zinc-950 hover:bg-zinc-200'
                    }`}
                  >
                    {isFollowed ? 'Following' : 'Follow Topic'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Recommendations (Blueprint Section 2.3) */}
      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-zinc-200">Reset Recommendation Signals</h4>
          <p className="text-[11px] text-zinc-500">
            Clears negative signals, un-mutes topics, and resets to default foundational computer science topics.
          </p>
        </div>

        <button
          onClick={handleResetRecommendations}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-colors"
        >
          {resetNotice ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <RotateCcw className="w-3.5 h-3.5" />}
          <span>{resetNotice ? 'Reset Complete' : 'Reset Signals'}</span>
        </button>
      </div>
    </div>
  );
}
