'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Clock, 
  Save, 
  Folder, 
  CheckCircle2, 
  Tag, 
  Share2, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';
import { Note } from '@/lib/types';
import { store } from '@/lib/store';
import { formatTimestamp } from '@/lib/utils';

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
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteText, setNewNoteText] = useState('');
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Load existing notes for this video
  const refreshNotes = () => {
    const allNotes = store.getNotes().filter(n => n.source?.videoId === videoId && n.type === 'PERSONAL');
    setNotes([...allNotes]);
  };

  useEffect(() => {
    refreshNotes();
  }, [videoId]);

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    store.createNote({
      folderId: 'f_notes',
      type: 'PERSONAL',
      title: newNoteTitle.trim() || `Note at ${formatTimestamp(currentTime)}`,
      topicIds: [topicId],
      source: {
        type: 'video',
        videoId,
        timestampSeconds: includeTimestamp ? currentTime : undefined
      },
      content: {
        text: newNoteText.trim()
      },
      tags: ['study-note']
    });

    setNewNoteTitle('');
    setNewNoteText('');
    refreshNotes();
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  const handleDelete = (id: string) => {
    store.deleteNote(id);
    refreshNotes();
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            Personal Study Notes
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-500/10 text-brand-400 font-mono">
              {notes.length} saved
            </span>
          </h3>
          <p className="text-[11px] text-slate-400">Timestamped notes saved directly to your study library</p>
        </div>
        {isSavedNotice && (
          <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium animate-pulse">
            <CheckCircle2 className="w-3.5 h-3.5" /> Autosaved
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* New Note Form */}
        <form onSubmit={handleCreateNote} className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <input
              type="text"
              placeholder="Note title (optional)..."
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
            <button
              type="button"
              onClick={() => setIncludeTimestamp(!includeTimestamp)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors border ${
                includeTimestamp 
                  ? 'bg-brand-500/20 text-brand-300 border-brand-500/40' 
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
              title="Tag with current video playback timestamp"
            >
              <Clock className="w-3 h-3" />
              <span>{formatTimestamp(currentTime)}</span>
            </button>
          </div>

          <textarea
            placeholder="Write key concepts, questions, or observations..."
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-none leading-relaxed"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newNoteText.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white rounded text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Note</span>
            </button>
          </div>
        </form>

        {/* Existing Notes List */}
        <div className="space-y-2.5">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No notes for this video yet. Add a timestamped note while watching!
            </div>
          ) : (
            notes.map((note) => (
              <div 
                key={note.id} 
                className="bg-slate-900/40 hover:bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 transition-all flex flex-col gap-2 group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-xs text-slate-200">{note.title}</span>
                  <div className="flex items-center gap-2">
                    {note.source?.timestampSeconds !== undefined && (
                      <button
                        onClick={() => onSeek(note.source!.timestampSeconds!)}
                        className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-brand-950 text-brand-300 border border-brand-800/50 hover:bg-brand-900 transition-colors"
                        title="Seek video to this timestamp"
                      >
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(note.source.timestampSeconds)}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 transition-opacity"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {note.content.text}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
