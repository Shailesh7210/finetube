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
      {notes.length > 0 && (
        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
          <span className="text-slate-500 font-mono">{notes.length} notes</span>
          <button
            onClick={handleExportMarkdown}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            title="Download Notes as Markdown (.md)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      )}

      <form onSubmit={handleAdd} className="space-y-2.5">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Title (optional)..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500"
          />
          <span className="px-2.5 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono text-slate-600">
            {formatTimestamp(currentTime)}
          </span>
        </div>

        <textarea
          placeholder="Take a timestamped note..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 resize-none"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!text.trim()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-colors disabled:opacity-40"
          >
            Save Note
          </button>
        </div>
      </form>

      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {notes.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No notes yet.</p>
        ) : (
          notes.map(n => (
            <div key={n.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 group">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900">{n.title}</span>
                <div className="flex items-center gap-2">
                  {n.source?.timestampSeconds !== undefined && (
                    <button
                      onClick={() => onSeek(n.source!.timestampSeconds!)}
                      className="font-mono text-xs text-indigo-600 hover:underline font-medium"
                    >
                      {formatTimestamp(n.source.timestampSeconds)}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {n.content.text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
