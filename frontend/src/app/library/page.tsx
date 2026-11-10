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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Study Library</h1>

        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search library..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 text-sm bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-3 space-y-1.5">
          <button
            onClick={() => setSelectedFolder('all')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
              selectedFolder === 'all'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <span>All Notes</span>
            <span className="font-mono text-xs text-zinc-500">{notes.length}</span>
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
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <span>{f.name}</span>
                <span className="font-mono text-xs text-zinc-500">{count}</span>
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
                  className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">{pl.title}</h3>
                    <p className="text-sm text-zinc-400 line-clamp-1">{pl.description}</p>
                    <div className="text-xs text-zinc-500 pt-1">
                      {pl.items.length} lessons · ~{pl.estimatedTotalMinutes}m
                    </div>
                  </div>

                  <Link
                    href={`/playlists/${pl.id}`}
                    className="shrink-0 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold text-white transition-colors"
                  >
                    Open →
                  </Link>
                </div>
              ))}
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="py-14 text-center text-sm text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
              No saved items yet.
            </div>
          ) : (
            filteredNotes.map(note => {
              const video = note.source?.videoId ? store.getVideoById(note.source.videoId) : undefined;
              const isCodeSnippet = note.folderId === 'f_code' || note.tags?.includes('code-practice');

              return (
                <div
                  key={note.id}
                  className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700/80 transition-colors space-y-3 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span>{isCodeSnippet ? 'Code Snippet' : note.type === 'AI_GENERATED' ? 'AI Note' : 'Note'}</span>
                        {note.source?.timestampSeconds !== undefined && (
                          <span>· {formatTimestamp(note.source.timestampSeconds)}</span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white">{note.title}</h3>
                    </div>

                    <div className="flex items-center gap-1">
                      {isCodeSnippet && note.content.text && (
                        <button
                          onClick={() => handleCopy(note.id, note.content.text || '')}
                          className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                          title="Copy"
                        >
                          {copiedId === note.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(note.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-500 hover:text-rose-400 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {isCodeSnippet && note.content.text ? (
                    <div className="p-3.5 bg-zinc-950 border border-zinc-800/80 rounded-xl font-mono text-xs text-zinc-300 overflow-x-auto">
                      <pre><code>{note.content.text}</code></pre>
                    </div>
                  ) : note.content.sections && note.content.sections.length > 0 ? (
                    <div className="space-y-2.5 text-sm text-zinc-400">
                      {note.content.sections.map((sec, i) => (
                        <div key={i} className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/60 space-y-1">
                          <h4 className="font-semibold text-zinc-200">{sec.heading}</h4>
                          <p className="leading-relaxed">{sec.body}</p>
                          {sec.codeSnippet && (
                            <pre className="p-2.5 bg-zinc-900 rounded-lg font-mono text-xs text-emerald-400 mt-1 overflow-x-auto">
                              <code>{sec.codeSnippet}</code>
                            </pre>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    note.content.text && (
                      <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {note.content.text}
                      </p>
                    )
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs text-zinc-500">
                    {video ? (
                      <Link
                        href={`/watch/${video.id}`}
                        className="text-blue-400 hover:text-blue-300 font-medium"
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
