'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Plus, X } from 'lucide-react';
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

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedGenerateTopic, setSelectedGenerateTopic] = useState('physics_electrostatics');

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
        description: newDesc.trim() || `Custom learning path`,
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

  const availableSubjects = useMemo(() => {
    return subjects.filter(s => topics.some(t => t.subjectId === s.id));
  }, [subjects, topics]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Learning Paths</h1>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Playlist</span>
          </button>

          <button
            onClick={() => setShowGenerateModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
          >
            Generate AI Path
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All ({playlists.length})
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              activeTab === 'ai'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            AI Paths ({playlists.filter(p => p.type === 'AI').length})
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              activeTab === 'custom'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Custom ({playlists.filter(p => p.type !== 'AI').length})
          </button>
        </div>

        <select
          value={selectedSubjectFilter}
          onChange={e => setSelectedSubjectFilter(e.target.value)}
          className="bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Subjects</option>
          {availableSubjects.map(sub => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      {/* Playlists Grid */}
      {filteredPlaylists.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl space-y-3">
          <p className="text-base text-slate-600">No playlists found for this subject.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-sm text-indigo-600 hover:underline font-medium"
          >
            + Create Playlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPlaylists.map(playlist => {
            const topic = topics.find(t => t.id === playlist.topicId);
            const subject = topic ? subjects.find(s => s.id === topic.subjectId) : undefined;

            return (
              <div
                key={playlist.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium text-indigo-600">
                      {subject ? `${subject.name} · ` : ''}{topic?.name || 'Playlist'}
                    </span>
                    <span>
                      {playlist.items.length} lessons · ~{playlist.estimatedTotalMinutes}m
                    </span>
                  </div>

                  <Link href={`/playlists/${playlist.id}`}>
                    <h2 className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                      {playlist.title}
                    </h2>
                  </Link>

                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {playlist.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-sm">
                  <span className="text-slate-600">
                    <strong className="text-slate-900">{playlist.ratingAverage}</strong> ★
                  </span>

                  <Link
                    href={`/playlists/${playlist.id}`}
                    className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Open →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create Custom Playlist */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 text-slate-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Create Playlist</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomPlaylist} className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1.5">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Class 12 Organic Chemistry..."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1.5">Subject & Topic</label>
                <select
                  value={newTopicId}
                  onChange={e => setNewTopicId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500"
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
                <label className="block font-medium text-slate-700 mb-1.5">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1.5">Videos (Optional)</label>
                <div className="max-h-36 overflow-y-auto space-y-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  {videos.map(v => {
                    const checked = selectedVideoIds.includes(v.id);
                    return (
                      <label
                        key={v.id}
                        className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-white cursor-pointer text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleVideoSelection(v.id)}
                          className="rounded border-slate-300 text-indigo-600"
                        />
                        <span className="text-slate-700 truncate flex-1">{v.title}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newTitle.trim()}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold disabled:opacity-50 transition-colors"
                >
                  {isCreating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: AI Playlist Synthesis */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 text-slate-900 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Generate AI Learning Path</h3>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Select Topic</label>
              <select
                value={selectedGenerateTopic}
                onChange={e => setSelectedGenerateTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500"
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

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateAiPlaylist}
                disabled={isGenerating}
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
