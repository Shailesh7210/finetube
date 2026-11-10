'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Sparkles, Plus, Check, X, Layers } from 'lucide-react';
import { api } from '@/lib/api';
import { Playlist, Topic, Subject, Video } from '@/lib/types';
import { store } from '@/lib/store';

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);

  const [activeTab, setActiveTab] = useState<'all' | 'ai' | 'custom'>('all');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  // Synthesize AI modal
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedGenerateTopic, setSelectedGenerateTopic] = useState('physics_electrostatics');

  // Create custom playlist modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTopicId, setNewTopicId] = useState('physics_electrostatics');
  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      const [pls, tops, subs, vids] = await Promise.all([
        api.getPlaylists(),
        api.getTopics(),
        api.getSubjects(),
        api.getFeed()
      ]);
      setPlaylists(pls);
      setTopics(tops);
      setSubjects(subs);
      setVideos(vids.length > 0 ? vids : store.getVideos());

      if (tops.length > 0) {
        setSelectedGenerateTopic(tops[0].id);
        setNewTopicId(tops[0].id);
      }
    }
    loadData();
  }, []);

  const handleGenerateAiPlaylist = async () => {
    setIsGenerating(true);
    try {
      const created = await api.generateAiPlaylist(selectedGenerateTopic);
      if (created) {
        setPlaylists(prev => [created, ...prev]);
        setShowGenerateModal(false);
      }
    } catch {
      // safe fallback
    }
    setIsGenerating(false);
  };

  const handleCreateCustomPlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsCreating(true);
    try {
      const created = await api.createPlaylist({
        title: newTitle.trim(),
        description: newDesc.trim() || `Custom curated learning path`,
        topicId: newTopicId,
        videoIds: selectedVideoIds
      });
      if (created) {
        setPlaylists(prev => [created, ...prev]);
        setShowCreateModal(false);
        setNewTitle('');
        setNewDesc('');
        setSelectedVideoIds([]);
      }
    } catch {
      // ignore
    }
    setIsCreating(false);
  };

  const toggleVideoSelection = (vidId: string) => {
    setSelectedVideoIds(prev =>
      prev.includes(vidId) ? prev.filter(id => id !== vidId) : [...prev, vidId]
    );
  };

  const filteredPlaylists = useMemo(() => {
    return playlists.filter(p => {
      if (activeTab === 'ai' && p.type !== 'AI') return false;
      if (activeTab === 'custom' && p.type === 'AI') return false;

      if (selectedSubjectFilter !== 'all') {
        const topic = topics.find(t => t.id === p.topicId);
        if (!topic || topic.subjectId !== selectedSubjectFilter) {
          return false;
        }
      }
      return true;
    });
  }, [playlists, activeTab, selectedSubjectFilter, topics]);

  // Extract subjects that actually have topics
  const availableSubjects = useMemo(() => {
    return subjects.filter(s => topics.some(t => t.subjectId === s.id));
  }, [subjects, topics]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      {/* Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Universal Learning Paths & Playlists</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Structured across <strong>all educational disciplines</strong> — sequenced by concept dependencies with minimal redundancy.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Custom Path
          </button>

          <button
            onClick={() => setShowGenerateModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/10 border border-blue-500/30 text-blue-400 hover:bg-blue-600/20 text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Synthesize AI Path
          </button>
        </div>
      </div>

      {/* Filter Bar: Type Tabs + Subject Discipline Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'all'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Paths ({playlists.length})
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'ai'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            AI Synthesized ({playlists.filter(p => p.type === 'AI').length})
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'custom'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Custom & Forked ({playlists.filter(p => p.type !== 'AI').length})
          </button>
        </div>

        {/* Discipline Filter */}
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-zinc-500" />
          <select
            value={selectedSubjectFilter}
            onChange={e => setSelectedSubjectFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-md px-2.5 py-1 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600"
          >
            <option value="all">All Disciplines ({subjects.length})</option>
            {availableSubjects.map(sub => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Playlists Grid */}
      {filteredPlaylists.length === 0 ? (
        <div className="p-10 text-center bg-zinc-900/20 border border-zinc-800/60 rounded-xl space-y-2">
          <p className="text-sm text-zinc-400">No learning paths found for this discipline yet.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-xs text-blue-400 hover:underline font-medium"
          >
            + Create the first path for this subject
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPlaylists.map(playlist => {
            const topic = topics.find(t => t.id === playlist.topicId);
            const subject = topic ? subjects.find(s => s.id === topic.subjectId) : undefined;

            return (
              <div
                key={playlist.id}
                className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                      {subject && (
                        <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px]">
                          {subject.name}
                        </span>
                      )}
                      <span>{topic?.name || 'Universal Topic'}</span>
                    </span>
                    <span>
                      <strong>{playlist.items.length}</strong> lessons • <strong>~{playlist.estimatedTotalMinutes}m</strong>
                    </span>
                  </div>

                  <Link href={`/playlists/${playlist.id}`}>
                    <h2 className="text-base font-bold text-white hover:text-blue-400 transition-colors">
                      {playlist.title}
                    </h2>
                  </Link>

                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                    {playlist.description}
                  </p>

                  {playlist.coveredConcepts && playlist.coveredConcepts.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {playlist.coveredConcepts.slice(0, 3).map((concept, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] bg-zinc-800/80 text-zinc-300 border border-zinc-700/50"
                        >
                          <strong>{concept}</strong>
                        </span>
                      ))}
                      {playlist.coveredConcepts.length > 3 && (
                        <span className="text-[10px] text-zinc-500 py-0.5">
                          +{playlist.coveredConcepts.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60 text-xs">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span>Score: <strong className="text-white">{playlist.ratingAverage}</strong> ★</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                      {playlist.type}
                    </span>
                  </div>

                  <Link
                    href={`/playlists/${playlist.id}`}
                    className="font-semibold text-zinc-300 hover:text-white transition-colors"
                  >
                    View Sequence →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create Custom Multi-Subject Learning Path */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-zinc-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white">Create Custom Learning Path</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomPlaylist} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Playlist / Path Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Class 12 Organic Chemistry Mechanisms, Cardiovascular Physiology Review..."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Subject & Curriculum Topic</label>
                <select
                  value={newTopicId}
                  onChange={e => setNewTopicId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-500"
                >
                  {subjects.map(sub => {
                    const subTopics = topics.filter(t => t.subjectId === sub.id);
                    if (subTopics.length === 0) return null;
                    return (
                      <optgroup key={sub.id} label={sub.name}>
                        {subTopics.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Learning Goal / Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe the objective and progression of this sequence..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Include Existing Videos (Optional)</label>
                <div className="max-h-36 overflow-y-auto space-y-1 p-2 bg-zinc-950 border border-zinc-800 rounded-lg">
                  {videos.map(v => {
                    const checked = selectedVideoIds.includes(v.id);
                    return (
                      <label
                        key={v.id}
                        className="flex items-center gap-2 p-1.5 rounded hover:bg-zinc-900 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleVideoSelection(v.id)}
                          className="rounded border-zinc-700 bg-zinc-900 text-blue-500"
                        />
                        <span className="text-zinc-300 truncate flex-1">{v.title}</span>
                        <span className="text-[10px] text-zinc-500 font-mono shrink-0">{v.primaryTopicId}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-1.5 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newTitle.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold disabled:opacity-50 transition-colors"
                >
                  {isCreating ? 'Creating...' : 'Create Learning Path'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: AI Playlist Synthesis */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-zinc-100 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Synthesize AI Learning Path</h3>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              FineTube analyzes the <strong>concept hierarchy</strong> of any selected subject & topic and generates an ordered progression: <strong>foundational principles first</strong>, followed by applied insights.
            </p>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-zinc-300">Target Universal Curriculum Topic</label>
              <select
                value={selectedGenerateTopic}
                onChange={e => setSelectedGenerateTopic(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-500"
              >
                {subjects.map(sub => {
                  const subTopics = topics.filter(t => t.subjectId === sub.id);
                  if (subTopics.length === 0) return null;
                  return (
                    <optgroup key={sub.id} label={sub.name}>
                      {subTopics.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-5">
              <button
                type="button"
                onClick={() => setShowGenerateModal(false)}
                className="px-3.5 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateAiPlaylist}
                disabled={isGenerating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-500 disabled:opacity-50 transition-colors"
              >
                {isGenerating ? 'Synthesizing Path...' : 'Generate Sequence'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
