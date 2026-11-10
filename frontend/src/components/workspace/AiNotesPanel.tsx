'use client';

import { useState, useMemo } from 'react';
import { Download, Check, Sparkles } from 'lucide-react';
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
            ? `Φ_E = ∮ E⃗ · dA⃗ = Q_enc / ε₀\n// Symmetry cases: Spherical (4πr²), Cylindrical (2πrL)`
            : tId.includes('chem')
            ? `Nucleophile (δ⁻) ──► Electrophile (δ⁺)\n// Carbocation Stability: 3° > 2° > 1° > Methyl`
            : `f'(x) = lim(h→0) [f(x+h) - f(x)] / h\n// Fundamental Theorem of Calculus: ∫ₐᵇ f(t) dt = F(b) - F(a)`
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

    // CS / Programming default
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
          : `// Core algorithmic invariant step\nfunction process(node) {\n  if (!node) return null;\n  return node.value;\n}`
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
      `**Curriculum Topic**: ${video.primaryTopicId}`,
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
      <div className="flex items-center justify-between text-xs pb-1.5 border-b border-zinc-800/80">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-zinc-300 font-semibold">AI Structured Summary</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportMarkdown}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors"
            title="Download Summary as Markdown (.md)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export (.md)</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saved}
            className="px-2.5 py-1 rounded bg-blue-600/20 border border-blue-500/40 text-xs text-blue-400 hover:bg-blue-600/30 font-medium transition-colors inline-flex items-center gap-1 disabled:opacity-60"
          >
            {saved && <Check className="w-3 h-3 text-emerald-400" />}
            <span>{saved ? 'Saved to Library' : 'Save to Library'}</span>
          </button>
        </div>
      </div>

      <p className="text-[11px] text-zinc-500 bg-zinc-900/40 px-2.5 py-1.5 rounded border border-zinc-800/60">
        Draft notes are scoped to this session. Click <strong>Save to Library</strong> above if you want to permanently store them.
      </p>

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
