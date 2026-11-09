'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, BookOpen } from 'lucide-react';
import { store } from '@/lib/store';

export default function TopicsPage() {
  const [, setRerender] = useState({});
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const subjects = store.getSubjects();
  const allTopics = store.getTopics();
  const followedSet = new Set(store.user.followedTopicIds);

  const filteredTopics = useMemo(() => {
    return allTopics.filter(topic => {
      if (selectedSubjectId !== 'all' && topic.subjectId !== selectedSubjectId) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = topic.name.toLowerCase().includes(q);
        const matchesDesc = topic.description.toLowerCase().includes(q);
        const matchesAlias = topic.aliases?.some(a => a.toLowerCase().includes(q));
        const matchesConcept = topic.conceptChecklist?.some(c => c.toLowerCase().includes(q));
        return matchesName || matchesDesc || matchesAlias || matchesConcept;
      }
      return true;
    });
  }, [allTopics, selectedSubjectId, searchQuery]);

  const handleToggle = (id: string) => {
    store.toggleFollowTopic(id);
    setRerender({});
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-xl font-semibold text-white">Universal Curriculum & Topics</h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Follow topics across <strong>sciences, mathematics, medicine, humanities, and technology</strong> to strictly customize your <strong>focused feed</strong>.
        </p>
      </div>

      {/* Search & Subject Filters */}
      <div className="space-y-3">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics, aliases, or concepts (e.g. Coulomb, Organic, Calculus, Anatomy)..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
          />
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
            All Subjects (<strong>{allTopics.length}</strong>)
          </button>

          {subjects.map(subject => {
            const count = allTopics.filter(t => t.subjectId === subject.id).length;
            if (count === 0) return null;
            return (
              <button
                key={subject.id}
                onClick={() => setSelectedSubjectId(subject.id)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
                  selectedSubjectId === subject.id
                    ? 'bg-zinc-100 text-zinc-950 font-semibold'
                    : 'text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800'
                }`}
              >
                {subject.name} (<strong>{count}</strong>)
              </button>
            );
          })}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTopics.map(topic => {
          const isFollowed = followedSet.has(topic.id);
          const count = store.getVideos(topic.id).length;
          const subject = subjects.find(s => s.id === topic.subjectId);

          return (
            <div
              key={topic.id}
              className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link href={`/topics/${topic.slug}`}>
                        <h2 className="text-sm font-semibold text-zinc-100 hover:text-blue-400 transition-colors">
                          {topic.name}
                        </h2>
                      </Link>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {subject && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300 font-mono">
                          {subject.name}
                        </span>
                      )}
                      {topic.educationLevel && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-950/60 border border-blue-800/50 text-blue-300 font-mono">
                          {topic.educationLevel}
                        </span>
                      )}
                      {topic.stream && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 font-mono">
                          {topic.stream}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggle(topic.id)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors shrink-0 ${
                      isFollowed
                        ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                        : 'bg-zinc-100 text-zinc-950 hover:bg-white'
                    }`}
                  >
                    {isFollowed ? 'Following' : 'Follow'}
                  </button>
                </div>

                <p className="text-xs text-zinc-400 mt-2.5 leading-relaxed">
                  {topic.description}
                </p>

                {topic.conceptChecklist && topic.conceptChecklist.length > 0 && (
                  <div className="mt-3 flex items-center gap-1 flex-wrap">
                    {topic.conceptChecklist.slice(0, 3).map((concept, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                        {concept}
                      </span>
                    ))}
                    {topic.conceptChecklist.length > 3 && (
                      <span className="text-[10px] text-zinc-500">
                        +{topic.conceptChecklist.length - 3} concepts
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-800/60">
                <span><strong>{count}</strong> verified lectures</span>
                <Link href={`/topics/${topic.slug}`} className="text-zinc-400 hover:text-white transition-colors">
                  View topic curriculum →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTopics.length === 0 && (
        <div className="p-8 text-center border border-zinc-800 rounded-lg bg-zinc-900/20 text-zinc-500 text-xs">
          No topics matched your search. You can dynamically search YouTube or register a custom interest.
        </div>
      )}
    </div>
  );
}
