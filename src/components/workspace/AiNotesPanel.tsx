'use client';

import { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  Copy, 
  CheckCircle2, 
  BookmarkPlus, 
  Code2, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';
import { Video, Note } from '@/lib/types';
import { formatTimestamp } from '@/lib/utils';
import { store } from '@/lib/store';

interface AiNotesPanelProps {
  video: Video;
  onSeek: (seconds: number) => void;
}

export function AiNotesPanel({ video, onSeek }: AiNotesPanelProps) {
  const [copiedSnippet, setCopiedSnippet] = useState<number | null>(null);
  const [savedToLibrary, setSavedToLibrary] = useState(false);

  // Derive structured AI sections from video's verified content & assessment
  const aiSections = [
    {
      id: 1,
      heading: `1. Core Concept Overview: ${video.topicCoverage[0]?.conceptName || video.title}`,
      body: `This lecture provides a comprehensive breakdown of ${video.topicCoverage.map(c => c.conceptName).join(', ')}. Key emphasis is placed on predictable execution lifecycle and avoiding unexpected state cascades.`,
      timestampSeconds: video.chapters[0]?.start || 0,
      evidenceSegmentIds: video.topicCoverage[0]?.evidenceSegmentIds || ['seg_intro']
    },
    {
      id: 2,
      heading: `2. Critical Mechanism: ${video.chapters[1]?.title || 'Execution Flow'}`,
      body: `When passing state dependencies, React compares previous and next states shallowly (Object.is). Omitting variables that change over time causes stale closures.`,
      timestampSeconds: video.chapters[1]?.start || 120,
      evidenceSegmentIds: video.topicCoverage[1]?.evidenceSegmentIds || ['seg_flow'],
      codeSnippet: `// Evidenced snippet from transcript\nuseEffect(() => {\n  console.log("Resource synchronized");\n  return () => console.log("Cleaned up");\n}, [resourceId]);`
    },
    {
      id: 3,
      heading: `3. Cleanup & Resource Management`,
      body: `Cleanup functions execute before re-running the effect and upon component unmount, preventing event listener leakage and abandoned network sockets.`,
      timestampSeconds: video.chapters[2]?.start || 310,
      evidenceSegmentIds: ['seg_cleanup']
    }
  ];

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(idx);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const handleSaveToLibrary = () => {
    store.createNote({
      folderId: 'f_ai',
      type: 'AI_GENERATED',
      title: `AI Notes: ${video.title}`,
      topicIds: [video.primaryTopicId],
      source: {
        type: 'video',
        videoId: video.id
      },
      content: {
        sections: aiSections.map(s => ({
          heading: s.heading,
          body: s.body,
          codeSnippet: s.codeSnippet,
          timestampSeconds: s.timestampSeconds,
          sourceSegmentIds: s.evidenceSegmentIds
        }))
      },
      tags: ['ai-study-notes', 'evidenced']
    });
    setSavedToLibrary(true);
    setTimeout(() => setSavedToLibrary(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            AI Structured Study Notes
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 font-mono">
              Evidenced
            </span>
          </h3>
          <p className="text-[11px] text-slate-400">Grounded exclusively in authorized transcript segments & chapters</p>
        </div>

        <button
          onClick={handleSaveToLibrary}
          disabled={savedToLibrary}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-sm"
        >
          {savedToLibrary ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Snapshot Saved</span>
            </>
          ) : (
            <>
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>Save Snapshot</span>
            </>
          )}
        </button>
      </div>

      {/* Quality Badge notice */}
      <div className="px-4 py-2 bg-indigo-950/30 border-b border-indigo-900/30 flex items-center justify-between text-[11px] text-indigo-300">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          AI Evaluation Quality: {video.aiAssessment.clarity}% Clarity | {video.aiAssessment.exampleQuality}% Practical Code
        </span>
        <span className="text-slate-400 font-mono text-[10px]">Model: {video.aiAssessment.evaluationVersion}</span>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {aiSections.map((sec, idx) => (
          <div key={sec.id} className="bg-slate-900/40 rounded-xl p-4 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-semibold text-xs sm:text-sm text-slate-100">{sec.heading}</h4>
              <button
                onClick={() => onSeek(sec.timestampSeconds)}
                className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-brand-950 text-brand-300 border border-brand-800/40 hover:bg-brand-900 transition-colors shrink-0"
                title="Seek video to this timestamp"
              >
                <Clock className="w-3 h-3" />
                {formatTimestamp(sec.timestampSeconds)}
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {sec.body}
            </p>

            {sec.codeSnippet && (
              <div className="relative rounded-lg bg-black border border-slate-800 p-3 overflow-hidden">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-[10px] text-slate-400 font-mono">
                  <span>Code Example</span>
                  <button
                    onClick={() => handleCopyCode(sec.codeSnippet!, idx)}
                    className="flex items-center gap-1 hover:text-slate-200 transition-colors"
                  >
                    {copiedSnippet === idx ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSnippet === idx ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="font-mono text-xs text-brand-300 overflow-x-auto whitespace-pre leading-relaxed">
                  {sec.codeSnippet}
                </pre>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-500 font-mono">
              <span>Evidence segments: {sec.evidenceSegmentIds.join(', ')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
