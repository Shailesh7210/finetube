'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Sparkles, 
  Clock, 
  Layers, 
  Plus, 
  Star, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert 
} from 'lucide-react';
import { store } from '@/lib/store';
import { Playlist } from '@/lib/types';

export default function PlaylistsPage() {
  const [filterType, setFilterType] = useState<'all' | 'AI' | 'USER'>('all');
  const playlists = store.getPlaylists();

  const filteredPlaylists = playlists.filter(p => 
    filterType === 'all' || p.type === filterType
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-brand-400" />
            Curated Learning Paths & Playlists
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Structured sequences optimized for conceptual progression with low redundancy.
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'all' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Sequences
          </button>
          <button
            onClick={() => setFilterType('AI')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'AI' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            AI-Curated Paths
          </button>
          <button
            onClick={() => setFilterType('USER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'USER' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Custom Learner Paths
          </button>
        </div>
      </div>

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPlaylists.map(playlist => {
          const topic = store.getTopics().find(t => t.id === playlist.topicId);

          return (
            <div
              key={playlist.id}
              className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 hover:border-brand-500/40 transition-all flex flex-col justify-between gap-5"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {playlist.type} Sequence
                    </span>
                    {topic && (
                      <span className="text-xs text-slate-400 font-medium">
                        {topic.name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold font-mono">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{playlist.ratingAverage}</span>
                    <span className="text-slate-500 font-normal">({playlist.ratingCount})</span>
                  </div>
                </div>

                <Link href={`/playlists/${playlist.id}`}>
                  <h2 className="text-lg font-bold text-white hover:text-brand-300 transition-colors">
                    {playlist.title}
                  </h2>
                </Link>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {playlist.description}
                </p>

                {/* Covered vs Missing concepts */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-medium">Covers:</span>
                    <span className="text-slate-300 truncate">{playlist.coveredConcepts.join(', ')}</span>
                  </div>

                  {playlist.missingConcepts.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-400/80">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-medium">Identified Gaps:</span>
                      <span className="text-slate-400 truncate">{playlist.missingConcepts.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom stats and action */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-brand-400" />
                    {playlist.items.length} Lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    ~{playlist.estimatedTotalMinutes} mins
                  </span>
                </div>

                <Link
                  href={`/playlists/${playlist.id}`}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-sm transition-all"
                >
                  <span>Start Learning Path</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
