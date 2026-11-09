'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, VolumeX, Check, Shield, Plus, X, Sparkles } from 'lucide-react';
import { store } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';

export default function InterestsPage() {
  const { user, updateProfile } = useAuth();
  const [, setRerender] = useState({});
  const [resetNotice, setResetNotice] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [customTagInput, setCustomTagInput] = useState<string>('');

  const subjects = store.getSubjects();
  const topics = store.getTopics();
  const followedIds = user?.followedTopicIds || store.user.followedTopicIds || [];
  const mutedIds = user?.mutedTopicIds || store.user.mutedTopicIds || [];
  const customInterests = user?.customInterests || store.user.customInterests || [];

  const filteredTopics = useMemo(() => {
    if (selectedSubjectId === 'all') return topics;
    return topics.filter(t => t.subjectId === selectedSubjectId);
  }, [topics, selectedSubjectId]);

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

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = customTagInput.trim();
    if (tag && !customInterests.some(t => t.toLowerCase() === tag.toLowerCase())) {
      const nextTags = [...customInterests, tag];
      store.user.customInterests = nextTags;
      updateProfile({ customInterests: nextTags });
      setCustomTagInput('');
      setRerender({});
    }
  };

  const handleRemoveCustomTag = (tag: string) => {
    const nextTags = customInterests.filter(t => t !== tag);
    store.user.customInterests = nextTags;
    updateProfile({ customInterests: nextTags });
    setRerender({});
  };

  const handleApplyArchetype = (type: 'class12' | 'medical' | 'developer' | 'general') => {
    let presetFollowed: string[] = [];
    let presetLevel: string = 'General';
    let presetStream: string = 'General';
    let label = '';

    if (type === 'class12') {
      presetFollowed = ['physics_electrostatics', 'chem_organic_reactions', 'math_calculus'];
      presetLevel = 'Class 12';
      presetStream = 'Science';
      label = 'Class 12 Science Student';
    } else if (type === 'medical') {
      presetFollowed = ['med_human_anatomy', 'med_cardiovascular_physiology'];
      presetLevel = 'Medical Studies';
      presetStream = 'Medical';
      label = 'Medical Student';
    } else if (type === 'developer') {
      presetFollowed = ['react_hooks', 'binary_search_trees', 'system_design'];
      presetLevel = 'Professional';
      presetStream = 'Computer Science';
      label = 'Software Developer';
    } else {
      presetFollowed = ['hist_french_revolution', 'physics_electrostatics', 'math_calculus'];
      presetLevel = 'General Knowledge';
      presetStream = 'Humanities';
      label = 'General Knowledge Learner';
    }

    store.user.followedTopicIds = presetFollowed;
    store.user.mutedTopicIds = [];
    updateProfile({
      followedTopicIds: presetFollowed,
      mutedTopicIds: [],
      educationLevel: presetLevel,
      stream: presetStream
    });

    setResetNotice(`Applied profile template for ${label}`);
    setTimeout(() => setResetNotice(null), 2500);
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
        <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">FineTube Feed Controls</span>
        <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">Feed & Interest Settings</h1>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
          Manage your <strong>explicitly followed topics</strong>, <strong>muted subjects</strong>, and <strong>recommendation strictness</strong> across any educational discipline.
        </p>
      </div>

      {resetNotice && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-900/60 text-xs text-emerald-300">
          {resetNotice}
        </div>
      )}

      {/* Archetype Quick-Switch Templates */}
      <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            Quick Baseline Templates
          </h3>
        </div>
        <p className="text-[11px] text-zinc-400">
          Reset or switch your profile baseline to match your current academic goal with one click:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => handleApplyArchetype('class12')}
            className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-850 hover:border-zinc-700 text-xs text-left transition-colors"
          >
            <span className="font-semibold block text-white">Class 12 Science</span>
            <span className="text-[10px] text-zinc-500">Physics, Chem, Math</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyArchetype('medical')}
            className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-850 hover:border-zinc-700 text-xs text-left transition-colors"
          >
            <span className="font-semibold block text-white">Medical Student</span>
            <span className="text-[10px] text-zinc-500">Anatomy, Physiology</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyArchetype('developer')}
            className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-850 hover:border-zinc-700 text-xs text-left transition-colors"
          >
            <span className="font-semibold block text-white">Software Dev</span>
            <span className="text-[10px] text-zinc-500">React, DSA, Systems</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyArchetype('general')}
            className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-850 hover:border-zinc-700 text-xs text-left transition-colors"
          >
            <span className="font-semibold block text-white">General Learner</span>
            <span className="text-[10px] text-zinc-500">History, Science, Econ</span>
          </button>
        </div>
      </div>

      {/* Strict Focus Mode Toggle */}
      <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Strict Focus Mode</h3>
          </div>
          <p className="text-xs text-zinc-400">
            When enabled, your feed serves <strong>only explicitly followed topics</strong>. Unrelated recommendations are strictly suppressed.
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

      {/* Custom Freeform Tags */}
      <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-3">
        <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
          Custom Educational Interests
        </h3>
        <p className="text-[11px] text-zinc-400">
          Add specific topics or keywords you want discovered:
        </p>
        <form onSubmit={handleAddCustomTag} className="flex items-center gap-2">
          <input
            type="text"
            value={customTagInput}
            onChange={(e) => setCustomTagInput(e.target.value)}
            placeholder="e.g. Organic Chemistry, French Revolution, Calculus..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium transition-colors flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Add Tag
          </button>
        </form>

        {customInterests.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {customInterests.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-zinc-800 text-zinc-200 border border-zinc-700"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveCustomTag(tag)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Topics Control List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-200">Curriculum Topic Subscriptions</h2>
          <span className="text-xs text-zinc-500">
            <strong>{followedIds.length}</strong> followed · <strong>{mutedIds.length}</strong> muted
          </span>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <button
            onClick={() => setSelectedSubjectId('all')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
              selectedSubjectId === 'all'
                ? 'bg-zinc-100 text-zinc-950 font-semibold'
                : 'text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800'
            }`}
          >
            All Subjects
          </button>
          {subjects.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedSubjectId(s.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
                selectedSubjectId === s.id
                  ? 'bg-zinc-100 text-zinc-950 font-semibold'
                  : 'text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="space-y-2.5">
          {filteredTopics.map(topic => {
            const isFollowed = followedIds.includes(topic.id);
            const isMuted = mutedIds.includes(topic.id);

            return (
              <div
                key={topic.id}
                className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-white">{topic.name}</h3>
                    {topic.educationLevel && (
                      <span className="text-[10px] px-1 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                        {topic.educationLevel}
                      </span>
                    )}
                    {isMuted && (
                      <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-500/20">
                        Muted
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400">{topic.description}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => handleToggleMute(topic.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      isMuted
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'text-zinc-500 hover:text-zinc-300 bg-zinc-900 border border-zinc-800'
                    }`}
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                    {isMuted ? 'Muted' : 'Mute'}
                  </button>

                  <button
                    onClick={() => handleToggleFollow(topic.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      isFollowed
                        ? 'bg-zinc-100 text-zinc-950 hover:bg-white'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    {isFollowed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    {isFollowed ? 'Following' : 'Follow'}
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
