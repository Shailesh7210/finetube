'use client';

import { useState, useEffect } from 'react';
import { Trash2, Download } from 'lucide-react';
import { Note } from '@/lib/types';
import { store } from '@/lib/store';
import { formatTimestamp, downloadMarkdownFile } from '@/lib/utils';

interface PersonalNotesPanelProps {
  videoId: string;
  topicId: string;
  currentTime: number;
  onSeek: (seconds: number) => void;
}

export function PersonalNotesPanel({
  videoId,
  topicId,
  currentTime,
  onSeek
}: PersonalNotesPanelProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');

  const refresh = () => {
    setNotes(store.getNotes().filter(n => n.source?.videoId === videoId && n.type === 'PERSONAL'));
  };

  useEffect(() => {
    refresh();
  }, [videoId]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    store.createNote({
      folderId: 'f_notes',
      type: 'PERSONAL',
      title: title.trim() || `Note at ${formatTimestamp(currentTime)}`,
      topicIds: [topicId],
      source: {
        type: 'video',
        videoId,
        timestampSeconds: currentTime
      },
      content: { text: text.trim() },
      tags: ['study']
    });

    setTitle('');
    setText('');
    refresh();
  };

  const handleDelete = (id: string) => {
    store.deleteNote(id);
    refresh();
  };

  const handleExportMarkdown = () => {
    if (notes.length === 0) return;
    const content = [
      `# Study Notes: ${notes[0]?.title || 'FineTube Lecture'}`,
      `**Topic ID**: ${topicId}`,
      `**Exported Date**: ${new Date().toLocaleDateString()}`,
      `\n---\n`,
      ...notes.map((n, i) => [
        `### ${i + 1}. ${n.title} ${n.source?.timestampSeconds !== undefined ? `[${formatTimestamp(n.source.timestampSeconds)}]` : ''}`,
        `${n.content.text || ''}\n`
      ].join('\n'))
    ].join('\n');

    downloadMarkdownFile(`finetube-${videoId}-notes.md`, content);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header Actions */}
      {notes.length > 0 && (
        <div className="flex items-center justify-between text-xs pb-1 border-b border-zinc-800/80">
          <span className="text-zinc-500 font-mono text-[11px]">{notes.length} saved notes</span>
          <button
            onClick={handleExportMarkdown}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors"
            title="Download Notes as Markdown (.md)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export (.md)</span>
          </button>
        </div>
      )}
      {/* Input */}
      <form onSubmit={handleAdd} className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Title (optional)..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
          />
          <button
            type="button"
            className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-[11px] font-mono text-zinc-400"
          >
            {formatTimestamp(currentTime)}
          </button>
        </div>

        <textarea
          placeholder="Take a note..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full bg-zinc-900 border border-zinc-800 rounded p-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 resize-none"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!text.trim()}
            className="px-3 py-1 bg-zinc-100 hover:bg-white text-zinc-950 font-medium rounded text-xs transition-colors disabled:opacity-40"
          >
            Save Note
          </button>
        </div>
      </form>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {notes.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-6">No notes yet.</p>
        ) : (
          notes.map(n => (
            <div key={n.id} className="p-3 bg-zinc-900/60 rounded-md border border-zinc-800/60 space-y-1.5 group">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-200">{n.title}</span>
                <div className="flex items-center gap-2">
                  {n.source?.timestampSeconds !== undefined && (
                    <button
                      onClick={() => onSeek(n.source!.timestampSeconds!)}
                      className="font-mono text-[11px] text-blue-400 hover:underline"
                    >
                      {formatTimestamp(n.source.timestampSeconds)}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-zinc-300 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap">
                {n.content.text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
