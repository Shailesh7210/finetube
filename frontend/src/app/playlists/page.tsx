'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Plus, Check } from 'lucide-react';
import { api } from '@/lib/api';
import { Playlist, Topic } from '@/lib/types';
import { store } from '@/lib/store';

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'ai' | 'custom'>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedGenerateTopic, setSelectedGenerateTopic] = useState('react_hooks');
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [pls, tops] = await Promise.all([
        api.getPlaylists(),
        api.getTopics()
      ]);
      setPlaylists(pls);
      setTopics(tops);
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

  const filteredPlaylists = playlists.filter(p => {
    if (activeTab === 'ai') return p.type === 'AI';
    if (activeTab === 'custom') return p.type === 'USER' || p.type === 'CUSTOMISED';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      {/* Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Structured Learning Paths</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Sequenced by <strong>concept dependencies</strong> (foundational before dependent) with <strong>minimal redundancy</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGenerateModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/10 border border-blue-500/30 text-blue-400 hover:bg-blue-600/20 text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Synthesize AI Path
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-2 text-xs">
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

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPlaylists.map(playlist => {
          const topic = topics.find(t => t.id === playlist.topicId);

          return (
            <div
              key={playlist.id}
              className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-zinc-500">
                  <span className="font-semibold text-zinc-400">{topic?.name || 'Topic Path'}</span>
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

      {/* Modal for AI Playlist Synthesis */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-zinc-100 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Synthesize AI Learning Path</h3>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              FineTube analyzes the <strong>concept hierarchy</strong> of your selected topic and generates an ordered progression: <strong>foundational principles first</strong>, followed by practical implementations.
            </p>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-zinc-300">Target Curriculum Topic</label>
              <select
                value={selectedGenerateTopic}
                onChange={e => setSelectedGenerateTopic(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-500"
              >
                {topics.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
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
