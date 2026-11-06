'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FolderHeart, 
  Folder, 
  FileText, 
  Terminal, 
  Sparkles, 
  BookOpen, 
  Search, 
  Trash2, 
  Clock, 
  ExternalLink,
  Plus
} from 'lucide-react';
import { store } from '@/lib/store';
import { Note, Folder as FolderType } from '@/lib/types';
import { formatTimestamp, formatDate } from '@/lib/utils';

export default function LibraryPage() {
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [, setRerender] = useState({});

  const folders = store.folders;
  const notes = store.getNotes();

  const filteredNotes = notes.filter(n => {
    const matchesFolder = selectedFolderId === 'all' || n.folderId === selectedFolderId;
    const matchesSearch = 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.content.text && n.content.text.toLowerCase().includes(searchQuery.toLowerCase())) ||
      n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFolder && matchesSearch;
  });

  const handleDelete = (id: string) => {
    store.deleteNote(id);
    setRerender({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <FolderHeart className="w-6 h-6 text-brand-400" />
            Personal Study Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            All your timestamped notes, AI study snapshots, practice code snippets, and saved paths.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search notes, tags, concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: Folders Sidebar (4 cols) */}
        <div className="md:col-span-4 bg-slate-900/60 rounded-2xl p-4 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 block mb-2">
            Library Folders
          </span>

          <button
            onClick={() => setSelectedFolderId('all')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              selectedFolderId === 'all'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4" />
              <span>All Study Items</span>
            </div>
            <span className="text-[11px] font-mono opacity-80">{notes.length}</span>
          </button>

          {folders.map(folder => {
            const count = notes.filter(n => n.folderId === folder.id).length;
            const isSelected = selectedFolderId === folder.id;

            return (
              <button
                key={folder.id}
                onClick={() => setSelectedFolderId(folder.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-brand-400" />
                  <span>{folder.name}</span>
                </div>
                <span className="text-[11px] font-mono opacity-80">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Notes Grid / List (8 cols) */}
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Showing {filteredNotes.length} saved records</span>
          </div>

          {filteredNotes.length === 0 ? (
            <div className="bg-slate-900/40 rounded-2xl p-12 text-center border border-slate-800/80 space-y-2">
              <p className="text-slate-300 text-sm font-medium">No study materials in this folder.</p>
              <p className="text-xs text-slate-500">
                Take timestamped notes or save AI snapshots while watching videos in the workspace.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotes.map(note => {
                const video = note.source?.videoId ? store.getVideoById(note.source.videoId) : undefined;

                return (
                  <div
                    key={note.id}
                    className="bg-slate-900/60 rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition-all space-y-3 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold uppercase ${
                            note.type === 'AI_GENERATED'
                              ? 'bg-purple-950/80 text-purple-300 border border-purple-800/50'
                              : 'bg-brand-950/80 text-brand-300 border border-brand-800/50'
                          }`}>
                            {note.type === 'AI_GENERATED' ? 'AI Evidenced' : 'Personal Note'}
                          </span>

                          {note.source?.timestampSeconds !== undefined && (
                            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-brand-400" />
                              {formatTimestamp(note.source.timestampSeconds)}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-white">
                          {note.title}
                        </h3>
                      </div>

                      <button
                        onClick={() => handleDelete(note.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1.5 transition-opacity"
                        title="Delete note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content text */}
                    {note.content.text && (
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {note.content.text}
                      </p>
                    )}

                    {/* AI Sections if present */}
                    {note.content.sections && (
                      <div className="space-y-2 pt-2 border-t border-slate-800/80">
                        {note.content.sections.map((sec, idx) => (
                          <div key={idx} className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                            <span className="font-semibold text-slate-200 block">{sec.heading}</span>
                            <p className="text-slate-400">{sec.body}</p>
                            {sec.codeSnippet && (
                              <pre className="mt-1.5 p-2 bg-black rounded text-[11px] font-mono text-emerald-400 overflow-x-auto">
                                {sec.codeSnippet}
                              </pre>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Footer with video link */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        {video && (
                          <Link
                            href={`/watch/${video.id}`}
                            className="text-brand-400 hover:underline flex items-center gap-1 font-medium"
                          >
                            <span>Open in Workspace</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>

                      <span className="text-[11px] text-slate-500 font-mono">
                        {formatDate(note.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
