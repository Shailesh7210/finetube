'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Copy, Check, Terminal, FileText, Sparkles, Folder, ArrowRight } from 'lucide-react';
import { store } from '@/lib/store';
import { formatDate, formatTimestamp } from '@/lib/utils';
import { Note, Playlist } from '@/lib/types';

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

  // Filter notes
  const filteredNotes = notes.filter(n => {
    const matchesFolder = selectedFolder === 'all' || n.folderId === selectedFolder;
    const matchesSearch = !searchQuery.trim() || 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.content.text && n.content.text.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFolder && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Personal Study Library</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Your centralized knowledge base of <strong>timestamped personal notes</strong>, <strong>AI study summaries</strong>, <strong>code snippets</strong>, and <strong>saved learning paths</strong>.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search saved items..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Folders Navigation Sidebar */}
        <div className="md:col-span-3 space-y-1">
          <button
            onClick={() => setSelectedFolder('all')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
              selectedFolder === 'all'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <span>All Notes & Snippets</span>
            <span className="font-mono text-[11px] text-zinc-500">{notes.length}</span>
          </button>

          {folders.map(f => {
            const count = f.id === 'f_playlists'
              ? playlists.length
              : notes.filter(n => n.folderId === f.id).length;

            return (
              <button
                key={f.id}
                onClick={() => setSelectedFolder(f.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                  selectedFolder === f.id
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <span>{f.name}</span>
                <span className="font-mono text-[11px] text-zinc-500">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="md:col-span-9 space-y-4">
          {selectedFolder === 'f_playlists' ? (
            /* Saved Learning Paths View */
            <div className="space-y-3">
              {playlists.map(pl => (
                <div
                  key={pl.id}
                  className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{pl.type} Path</span>
                    <h3 className="text-sm font-bold text-white">{pl.title}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-1">{pl.description}</p>
                    <div className="text-[11px] text-zinc-500 pt-1">
                      <strong>{pl.items.length}</strong> lessons • <strong>~{pl.estimatedTotalMinutes}m</strong>
                    </div>
                  </div>

                  <Link
                    href={`/playlists/${pl.id}`}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors"
                  >
                    Open Path →
                  </Link>
                </div>
              ))}
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl space-y-2">
              <p>No saved items found in this section.</p>
              <p className="text-zinc-600">Take notes or save code snippets in any video workspace.</p>
            </div>
          ) : (
            filteredNotes.map(note => {
              const video = note.source?.videoId ? store.getVideoById(note.source.videoId) : undefined;
              const isCodeSnippet = note.folderId === 'f_code' || note.tags?.includes('code-practice');
              const isAiNote = note.type === 'AI_GENERATED' || note.folderId === 'f_ai';

              return (
                <div
                  key={note.id}
                  className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700/80 transition-colors space-y-3 group"
                >
                  {/* Note Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          isCodeSnippet
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : isAiNote
                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {isCodeSnippet ? 'Code Snippet' : isAiNote ? 'AI Summary' : 'Personal Note'}
                        </span>

                        {note.source?.timestampSeconds !== undefined && (
                          <span className="text-[11px] font-mono font-semibold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded">
                            {formatTimestamp(note.source.timestampSeconds)}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-white pt-1">{note.title}</h3>
                    </div>

                    <div className="flex items-center gap-1">
                      {isCodeSnippet && note.content.text && (
                        <button
                          onClick={() => handleCopy(note.id, note.content.text || '')}
                          className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                          title="Copy snippet"
                        >
                          {copiedId === note.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(note.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-500 hover:text-rose-400 transition-all"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  {isCodeSnippet && note.content.text ? (
                    <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-lg font-mono text-xs text-zinc-300 overflow-x-auto">
                      <pre><code>{note.content.text}</code></pre>
                    </div>
                  ) : note.content.sections && note.content.sections.length > 0 ? (
                    <div className="space-y-2 text-xs text-zinc-400">
                      {note.content.sections.map((sec, i) => (
                        <div key={i} className="p-2.5 bg-zinc-950/60 rounded border border-zinc-800/60 space-y-1">
                          <h4 className="font-semibold text-zinc-200">{sec.heading}</h4>
                          <p className="leading-relaxed">{sec.body}</p>
                          {sec.codeSnippet && (
                            <pre className="p-2 bg-zinc-900 rounded font-mono text-[11px] text-emerald-400 mt-1">
                              <code>{sec.codeSnippet}</code>
                            </pre>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    note.content.text && (
                      <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {note.content.text}
                      </p>
                    )
                  )}

                  {/* Footer Links & Metadata */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs text-zinc-500">
                    {video ? (
                      <Link
                        href={`/watch/${video.id}`}
                        className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium"
                      >
                        <span>Open Video Workspace ({video.title.slice(0, 32)}...)</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    ) : (
                      <span className="text-[11px] text-zinc-500">Standalone study note</span>
                    )}

                    <span className="font-mono text-[11px]">{formatDate(note.createdAt)}</span>
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
