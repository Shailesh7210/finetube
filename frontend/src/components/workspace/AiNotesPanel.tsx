'use client';

import { useState } from 'react';
import { Video } from '@/lib/types';
import { formatTimestamp } from '@/lib/utils';
import { store } from '@/lib/store';

interface AiNotesPanelProps {
  video: Video;
  onSeek: (seconds: number) => void;
}

export function AiNotesPanel({ video, onSeek }: AiNotesPanelProps) {
  const [copied, setCopied] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const sections = [
    {
      id: 1,
      title: 'Core Concept',
      text: `Key focus: ${video.topicCoverage.map(c => c.conceptName).join(', ')}. Explains state synchronization and lifecycle timing without unneeded re-renders.`,
      timestamp: video.chapters[0]?.start || 0
    },
    {
      id: 2,
      title: 'Implementation & Cleanup',
      text: 'Effects run after render. If setting up subscriptions or timers, return a cleanup function to prevent memory leaks and duplicate listeners.',
      timestamp: video.chapters[1]?.start || 120,
      code: `useEffect(() => {\n  const handler = () => console.log("Event");\n  window.addEventListener("resize", handler);\n  return () => window.removeEventListener("resize", handler);\n}, []);`
    }
  ];

  const handleCopy = (code: string, id: number) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleSave = () => {
    store.createNote({
      folderId: 'f_ai',
      type: 'AI_GENERATED',
      title: `AI Summary: ${video.title}`,
      topicIds: [video.primaryTopicId],
      source: { type: 'video', videoId: video.id },
      content: {
        sections: sections.map(s => ({
          heading: s.title,
          body: s.text,
          codeSnippet: s.code,
          timestampSeconds: s.timestamp
        }))
      },
      tags: ['ai-summary']
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">Structured Summary</span>
        <button
          onClick={handleSave}
          disabled={saved}
          className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-colors"
        >
          {saved ? 'Saved to Library' : 'Save Summary'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {sections.map((sec) => (
          <div key={sec.id} className="p-3 bg-zinc-900/60 rounded-md border border-zinc-800/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-zinc-200">{sec.title}</span>
              <button
                onClick={() => onSeek(sec.timestamp)}
                className="font-mono text-[11px] text-blue-400 hover:underline"
              >
                {formatTimestamp(sec.timestamp)}
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              {sec.text}
            </p>

            {sec.code && (
              <div className="relative rounded bg-black/60 p-2.5 border border-zinc-800 font-mono text-xs text-zinc-300">
                <button
                  onClick={() => handleCopy(sec.code!, sec.id)}
                  className="absolute top-2 right-2 text-[10px] text-zinc-500 hover:text-zinc-300"
                >
                  {copied === sec.id ? 'Copied' : 'Copy'}
                </button>
                <pre className="overflow-x-auto whitespace-pre">{sec.code}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
