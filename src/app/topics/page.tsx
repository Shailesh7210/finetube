'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Check, 
  Plus, 
  Search, 
  ArrowRight, 
  BookOpen, 
  Layers, 
  Terminal, 
  Cpu, 
  Binary, 
  Atom 
} from 'lucide-react';
import { store } from '@/lib/store';
import { Topic, Subject } from '@/lib/types';

export default function TopicsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [, setRerender] = useState({});

  const subjects = store.subjects;
  const topics = store.getTopics();
  const followedSet = new Set(store.user.followedTopicIds);

  const filteredTopics = topics.filter(t => {
    const matchesSubject = selectedSubject === 'all' || t.subjectId === selectedSubject;
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.aliases.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesSearch;
  });

  const handleToggleFollow = (topicId: string) => {
    store.toggleFollowTopic(topicId);
    setRerender({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-brand-400" />
            Subject Taxonomy & Topic Browser
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Choose what you actually want to learn. Only followed topics populate your default feed.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter topics or aliases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedSubject('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedSubject === 'all'
              ? 'bg-brand-600 text-white'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All Subjects ({topics.length})
        </button>

        {subjects.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedSubject(s.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedSubject === s.id
                ? 'bg-brand-600 text-white'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>{s.name}</span>
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredTopics.map((topic) => {
          const isFollowed = followedSet.has(topic.id);
          const videoCount = store.getVideos(topic.id).length;

          return (
            <div
              key={topic.id}
              className="bg-slate-900/60 rounded-xl p-5 border border-slate-800/80 hover:border-brand-500/40 transition-all flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <Link href={`/topics/${topic.slug}`}>
                      <h2 className="text-base font-bold text-slate-100 hover:text-brand-300 transition-colors">
                        {topic.name}
                      </h2>
                    </Link>
                    <span className="text-[11px] text-slate-500 font-mono">
                      ID: {topic.id}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleFollow(topic.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                      isFollowed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-brand-600 hover:bg-brand-500 text-white'
                    }`}
                  >
                    {isFollowed ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Follow Topic</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {topic.description}
                </p>

                {/* Concept Checklist Preview */}
                <div className="mt-3 pt-3 border-t border-slate-800/80">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Assessed Concept Checklist:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {topic.conceptChecklist.map((c, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 font-mono"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom links */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-brand-400" />
                  {videoCount} Curated Videos
                </span>

                <Link
                  href={`/topics/${topic.slug}`}
                  className="text-brand-400 hover:text-brand-300 font-medium inline-flex items-center gap-1 group"
                >
                  <span>Explore Topic Page</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
