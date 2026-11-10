'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
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
        return matchesName || matchesDesc || matchesAlias;
      }
      return true;
    });
  }, [allTopics, selectedSubjectId, searchQuery]);

  const handleToggle = (id: string) => {
    store.toggleFollowTopic(id);
    setRerender({});
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      <div className="border-b border-zinc-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Subjects & Topics</h1>
      </div>

      {/* Search & Subject Filters */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter topics..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <button
            onClick={() => setSelectedSubjectId('all')}
            className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors shrink-0 ${
              selectedSubjectId === 'all'
                ? 'bg-zinc-100 text-zinc-950 font-semibold'
                : 'text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800'
            }`}
          >
            All ({allTopics.length})
          </button>

          {subjects.map(subject => {
            const count = allTopics.filter(t => t.subjectId === subject.id).length;
            if (count === 0) return null;
            return (
              <button
                key={subject.id}
                onClick={() => setSelectedSubjectId(subject.id)}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors shrink-0 ${
                  selectedSubjectId === subject.id
                    ? 'bg-zinc-100 text-zinc-950 font-semibold'
                    : 'text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800'
                }`}
              >
                {subject.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTopics.map(topic => {
          const isFollowed = followedSet.has(topic.id);
          const count = store.getVideos(topic.id).length;
          const subject = subjects.find(s => s.id === topic.subjectId);

          return (
            <div
              key={topic.id}
              className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {subject && (
                      <span className="text-xs font-medium text-zinc-500 block mb-0.5">
                        {subject.name}
                      </span>
                    )}
                    <Link href={`/topics/${topic.slug}`}>
                      <h2 className="text-lg font-bold text-zinc-100 hover:text-blue-400 transition-colors">
                        {topic.name}
                      </h2>
                    </Link>
                  </div>

                  <button
                    onClick={() => handleToggle(topic.id)}
                    className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors shrink-0 ${
                      isFollowed
                        ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                        : 'bg-zinc-100 text-zinc-950 hover:bg-white'
                    }`}
                  >
                    {isFollowed ? 'Following' : 'Follow'}
                  </button>
                </div>

                <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">
                  {topic.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-500 pt-3 border-t border-zinc-800/60">
                <span>{count} videos</span>
                <Link href={`/topics/${topic.slug}`} className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                  Explore →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTopics.length === 0 && (
        <div className="p-10 text-center border border-zinc-800 rounded-2xl bg-zinc-900/20 text-zinc-500 text-sm">
          No topics found.
        </div>
      )}
    </div>
  );
}
