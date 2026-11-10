'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Copy, Check } from 'lucide-react';
import { store } from '@/lib/store';
import { formatDate, formatTimestamp } from '@/lib/utils';

export default function LibraryPage() {
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [, setRerender] = useState({});

  const folders = store.folders;
  const notes = store.getNotes();
  const playlists = store.getPlaylists();

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    store.deleteNote(id);
    setRerender({});
  };

  const filteredNotes = notes.filter(n => {
    const matchesFolder = selectedFolder === 'all' || n.folderId === selectedFolder;
    const matchesSearch = !searchQuery.trim() ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.content.text && n.content.text.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFolder && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Study Library</h1>

        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search library..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-3 space-y-1.5">
          <button
            onClick={() => setSelectedFolder('all')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
              selectedFolder === 'all'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>All Notes</span>
            <span className="font-mono text-xs opacity-70">{notes.length}</span>
          </button>

          {folders.map(f => {
            const count = f.id === 'f_playlists'
              ? playlists.length
              : notes.filter(n => n.folderId === f.id).length;

            return (
              <button
                key={f.id}
                onClick={() => setSelectedFolder(f.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                  selectedFolder === f.id
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span>{f.name}</span>
                <span className="font-mono text-xs opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="md:col-span-9 space-y-4">
          {selectedFolder === 'f_playlists' ? (
            <div className="space-y-3">
              {playlists.map(pl => (
                <div
                  key={pl.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">{pl.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-1">{pl.description}</p>
                    <div className="text-xs text-slate-500 pt-1">
                      {pl.items.length} lessons · ~{pl.estimatedTotalMinutes}m
                    </div>
                  </div>

                  <Link
                    href={`/playlists/${pl.id}`}
                    className="shrink-0 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-sm font-semibold text-white transition-colors"
                  >
                    Open →
                  </Link>
                </div>
              ))}
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="py-14 text-center text-sm text-slate-500 border border-dashed border-slate-300 rounded-2xl bg-white">
              No saved items yet.
            </div>
          ) : (
            filteredNotes.map(note => {
              const video = note.source?.videoId ? store.getVideoById(note.source.videoId) : undefined;
              const isCodeSnippet = note.folderId === 'f_code' || note.tags?.includes('code-practice');

              return (
                <div
                  key={note.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs transition-colors space-y-3 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-medium text-indigo-600">
                          {isCodeSnippet ? 'Code Snippet' : note.type === 'AI_GENERATED' ? 'AI Note' : 'Note'}
                        </span>
                        {note.source?.timestampSeconds !== undefined && (
                          <span>· {formatTimestamp(note.source.timestampSeconds)}</span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{note.title}</h3>
                    </div>

                    <div className="flex items-center gap-1">
                      {isCodeSnippet && note.content.text && (
                        <button
                          onClick={() => handleCopy(note.id, note.content.text || '')}
                          className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors"
                          title="Copy"
                        >
                          {copiedId === note.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(note.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {isCodeSnippet && note.content.text ? (
                    <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 overflow-x-auto">
                      <pre><code>{note.content.text}</code></pre>
                    </div>
                  ) : note.content.sections && note.content.sections.length > 0 ? (
                    <div className="space-y-2.5 text-sm text-slate-600">
                      {note.content.sections.map((sec, i) => (
                        <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                          <h4 className="font-semibold text-slate-900">{sec.heading}</h4>
                          <p className="leading-relaxed">{sec.body}</p>
                          {sec.codeSnippet && (
                            <pre className="p-2.5 bg-slate-900 rounded-lg font-mono text-xs text-emerald-300 mt-1.5 overflow-x-auto">
                              <code>{sec.codeSnippet}</code>
                            </pre>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    note.content.text && (
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {note.content.text}
                      </p>
                    )
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                    {video ? (
                      <Link
                        href={`/watch/${video.id}`}
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        Open Video ({video.title.slice(0, 36)}...) →
                      </Link>
                    ) : (
                      <span>Personal note</span>
                    )}
                    <span className="font-mono">{formatDate(note.createdAt)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
