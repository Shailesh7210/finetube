'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { store } from '@/lib/store';
import { formatDate } from '@/lib/utils';

export default function LibraryPage() {
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [, setRerender] = useState({});

  const folders = store.folders;
  const notes = store.getNotes();

  const filtered = selectedFolder === 'all'
    ? notes
    : notes.filter(n => n.folderId === selectedFolder);

  const handleDelete = (id: string) => {
    store.deleteNote(id);
    setRerender({});
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-xl font-semibold text-white">Study Library</h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Your <strong>personal notes</strong>, <strong>AI study summaries</strong>, and <strong>saved bookmarks</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Folders */}
        <div className="md:col-span-3 space-y-1">
          <button
            onClick={() => setSelectedFolder('all')}
            className={`w-full text-left px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              selectedFolder === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Items ({notes.length})
          </button>
          {folders.map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFolder(f.id)}
              className={`w-full text-left px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                selectedFolder === f.id ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>

        {/* Notes */}
        <div className="md:col-span-9 space-y-3">
          {filtered.length === 0 ? (
            <p className="text-xs text-zinc-500 py-8 text-center">No items in this folder.</p>
          ) : (
            filtered.map(note => {
              const video = note.source?.videoId ? store.getVideoById(note.source.videoId) : undefined;

              return (
                <div
                  key={note.id}
                  className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800 space-y-2 group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-200">{note.title}</span>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-zinc-300 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {note.content.text && (
                    <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap">
                      {note.content.text}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs text-zinc-500">
                    {video ? (
                      <Link href={`/watch/${video.id}`} className="text-blue-400 hover:underline">
                        Open video
                      </Link>
                    ) : <span />}
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
