'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Plus, X } from 'lucide-react';
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
      label = 'Class 12 Science';
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
      label = 'General Learner';
    }

    store.user.followedTopicIds = presetFollowed;
    store.user.mutedTopicIds = [];
    updateProfile({
      followedTopicIds: presetFollowed,
      mutedTopicIds: [],
      educationLevel: presetLevel,
      stream: presetStream
    });

    setResetNotice(`Applied preset: ${label}`);
    setTimeout(() => setResetNotice(null), 2500);
    setRerender({});
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      <Link
        href="/profile"
        className="text-sm text-slate-500 hover:text-slate-900 inline-flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Profile
      </Link>

      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Interests & Feed Filters</h1>
      </div>

      {resetNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
          {resetNotice}
        </div>
      )}

      {/* Quick Presets */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-base font-bold text-slate-900">Quick Presets</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => handleApplyArchetype('class12')}
            className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:border-indigo-300 text-left transition-colors"
          >
            <span className="font-semibold text-sm block text-slate-900">Class 12 Science</span>
            <span className="text-xs text-slate-500">Physics, Chem, Math</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyArchetype('medical')}
            className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:border-indigo-300 text-left transition-colors"
          >
            <span className="font-semibold text-sm block text-slate-900">Medical Student</span>
            <span className="text-xs text-slate-500">Anatomy, Physiology</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyArchetype('developer')}
            className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:border-indigo-300 text-left transition-colors"
          >
            <span className="font-semibold text-sm block text-slate-900">Software Dev</span>
            <span className="text-xs text-slate-500">React, DSA, Systems</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyArchetype('general')}
            className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:border-indigo-300 text-left transition-colors"
          >
            <span className="font-semibold text-sm block text-slate-900">General Learner</span>
            <span className="text-xs text-slate-500">History, Science</span>
          </button>
        </div>
      </div>

      {/* Strict Focus Mode */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Strict Focus Mode</h3>
          <p className="text-sm text-slate-600">
            Show only followed topics in your feed.
          </p>
        </div>

        <button
          onClick={handleToggleStrictFocus}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors shrink-0 ${
            user?.strictFocusMode !== false
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-200 text-slate-700'
          }`}
        >
          {user?.strictFocusMode !== false ? 'On' : 'Off'}
        </button>
      </div>

      {/* Custom Tags */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-base font-bold text-slate-900">Custom Tags</h3>
        <form onSubmit={handleAddCustomTag} className="flex items-center gap-2.5">
          <input
            type="text"
            value={customTagInput}
            onChange={(e) => setCustomTagInput(e.target.value)}
            placeholder="Add interest..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium transition-colors inline-flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>

        {customInterests.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {customInterests.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-800 border border-slate-200"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveCustomTag(tag)}
                  className="text-slate-400 hover:text-slate-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Topic List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Topics</h2>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <button
            onClick={() => setSelectedSubjectId('all')}
            className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors shrink-0 ${
              selectedSubjectId === 'all'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All
          </button>
          {subjects.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedSubjectId(s.id)}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors shrink-0 ${
                selectedSubjectId === s.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredTopics.map(topic => {
            const isFollowed = followedIds.includes(topic.id);
            const isMuted = mutedIds.includes(topic.id);

            return (
              <div
                key={topic.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">{topic.name}</h3>
                  <p className="text-sm text-slate-600">{topic.description}</p>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => handleToggleMute(topic.id)}
                    className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isMuted
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {isMuted ? 'Muted' : 'Mute'}
                  </button>

                  <button
                    onClick={() => handleToggleFollow(topic.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors inline-flex items-center gap-1.5 ${
                      isFollowed
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {isFollowed && <Check className="w-4 h-4 stroke-[2.5]" />}
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
