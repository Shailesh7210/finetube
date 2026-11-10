'use client';

import { useState, useMemo } from 'react';
import { Download, Check } from 'lucide-react';
import { Video } from '@/lib/types';
import { formatTimestamp, downloadMarkdownFile } from '@/lib/utils';
import { store } from '@/lib/store';

interface AiNotesPanelProps {
  video: Video;
  onSeek: (seconds: number) => void;
}

interface SummarySection {
  id: number;
  title: string;
  text: string;
  timestamp: number;
  code?: string;
}

export function AiNotesPanel({ video, onSeek }: AiNotesPanelProps) {
  const [copied, setCopied] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const sections: SummarySection[] = useMemo(() => {
    const concepts = video.topicCoverage?.map(c => c.conceptName).join(', ') || video.title;
    const tId = (video.primaryTopicId || '').toLowerCase();

    if (tId.includes('physics') || tId.includes('math') || tId.includes('chem')) {
      return [
        {
          id: 1,
          title: 'Foundational Principles & Definitions',
          text: `Core focus: ${concepts}. Establishes fundamental laws, conservation invariants, and boundary conditions used throughout the derivation.`,
          timestamp: video.chapters[0]?.start || 0
        },
        {
          id: 2,
          title: 'Mathematical Formulation & Governing Equations',
          text: 'Translates physical observations into quantitative symbolic relationships. Pay attention to dimensional consistency and unit conversions.',
          timestamp: video.chapters[1]?.start || 120,
          code: tId.includes('physics')
            ? `Φ_E = ∮ E⃗ · dA⃗ = Q_enc / ε₀`
            : tId.includes('chem')
            ? `Nucleophile (δ⁻) ──► Electrophile (δ⁺)\nCarbocation Stability: 3° > 2° > 1° > Methyl`
            : `f'(x) = lim(h→0) [f(x+h) - f(x)] / h`
        }
      ];
    }

    if (tId.includes('med') || tId.includes('bio') || tId.includes('anat')) {
      return [
        {
          id: 1,
          title: 'Anatomical & Physiological Mechanisms',
          text: `Key focus: ${concepts}. Details structural organization, cellular signaling pathways, and homeostatic regulatory loops.`,
          timestamp: video.chapters[0]?.start || 0
        },
        {
          id: 2,
          title: 'Clinical Correlations & Diagnostic Pathways',
          text: 'Connects underlying physiological mechanisms to clinical presentation, compensatory reflexes, and pharmacological targets.',
          timestamp: video.chapters[1]?.start || 120
        }
      ];
    }

    if (tId.includes('hist') || tId.includes('econ') || tId.includes('law') || tId.includes('psych')) {
      return [
        {
          id: 1,
          title: 'Historical Context & Primary Forces',
          text: `Key focus: ${concepts}. Examines structural causes, institutional tensions, and primary analytical frameworks.`,
          timestamp: video.chapters[0]?.start || 0
        },
        {
          id: 2,
          title: 'Critical Turning Points & Legacy',
          text: 'Traces cause-and-effect milestones, competing interpretations, and long-term socio-political or legal implications.',
          timestamp: video.chapters[1]?.start || 120
        }
      ];
    }

    return [
      {
        id: 1,
        title: 'Core Architecture & Invariants',
        text: `Key focus: ${concepts}. Explains state synchronization, invariant maintenance, and operational edge cases.`,
        timestamp: video.chapters[0]?.start || 0
      },
      {
        id: 2,
        title: 'Implementation & Resource Lifecycle',
        text: 'Demonstrates structured implementation patterns, complexity trade-offs, and resource cleanup guarantees.',
        timestamp: video.chapters[1]?.start || 120,
        code: tId.includes('react')
          ? `useEffect(() => {\n  const handler = () => console.log("Synced");\n  window.addEventListener("resize", handler);\n  return () => window.removeEventListener("resize", handler);\n}, []);`
          : `function process(node) {\n  if (!node) return null;\n  return node.value;\n}`
      }
    ];
  }, [video]);

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
      tags: ['ai-summary', video.primaryTopicId]
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleExportMarkdown = () => {
    const content = [
      `# AI Structured Notes: ${video.title}`,
      `**Topic**: ${video.primaryTopicId}`,
      `**Generated On**: ${new Date().toLocaleDateString()}`,
      `\n---\n`,
      ...sections.map(s => [
        `### ${s.title} [${formatTimestamp(s.timestamp)}]`,
        `${s.text}`,
        s.code ? `\n\`\`\`\n${s.code}\n\`\`\`\n` : ''
      ].join('\n'))
    ].join('\n');

    downloadMarkdownFile(`finetube-${video.id}-ai-summary.md`, content);
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
        <span className="text-slate-900 font-semibold">AI Summary</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportMarkdown}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            title="Download Markdown"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saved}
            className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs text-white font-medium transition-colors inline-flex items-center gap-1 disabled:opacity-60"
          >
            {saved && <Check className="w-3 h-3" />}
            <span>{saved ? 'Saved' : 'Save to Library'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {sections.map((sec) => (
          <div key={sec.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900">{sec.title}</span>
              <button
                onClick={() => onSeek(sec.timestamp)}
                className="font-mono text-xs text-indigo-600 hover:underline font-medium"
              >
                {formatTimestamp(sec.timestamp)}
              </button>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
              {sec.text}
            </p>

            {sec.code && (
              <div className="relative rounded-lg bg-slate-900 p-3 font-mono text-xs text-slate-100">
                <button
                  onClick={() => handleCopy(sec.code!, sec.id)}
                  className="absolute top-2 right-2 text-xs text-slate-400 hover:text-white"
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
