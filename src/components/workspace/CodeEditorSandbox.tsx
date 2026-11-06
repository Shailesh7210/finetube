'use client';

import { useState } from 'react';
import { Play, RotateCcw, Save, CheckCircle2, Terminal, AlertTriangle } from 'lucide-react';
import { store } from '@/lib/store';

interface CodeEditorSandboxProps {
  videoId?: string;
  topicId?: string;
  initialCode?: string;
}

const DEFAULT_STARTER_CODE = `// FineTube Code Practice Sandbox
// Task: Implement a clean custom hook or test algorithm

function useCounter(initialValue = 0) {
  let count = initialValue;
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

// Test runner:
const counter = useCounter(5);
console.log("Initial count:", counter.getCount());
console.log("Incremented:", counter.increment());
console.log("Incremented again:", counter.increment());
console.log("Decremented:", counter.decrement());
`;

export function CodeEditorSandbox({ videoId, topicId, initialCode }: CodeEditorSandboxProps) {
  const [code, setCode] = useState(initialCode || DEFAULT_STARTER_CODE);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [execStatus, setExecStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const runCode = () => {
    setIsRunning(true);
    setExecStatus('idle');
    const logs: string[] = [];

    const customConsole = {
      log: (...args: any[]) => {
        logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
      },
      error: (...args: any[]) => {
        logs.push(`[ERROR]: ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')}`);
      },
      warn: (...args: any[]) => {
        logs.push(`[WARN]: ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')}`);
      }
    };

    try {
      const startTime = performance.now();
      // Bounded client evaluation with isolated console
      const runFn = new Function('console', code);
      runFn(customConsole);
      const duration = (performance.now() - startTime).toFixed(1);
      
      logs.push(`\n--- Execution completed in ${duration}ms ---`);
      setOutput(logs.length ? logs : ['Execution finished with no output.']);
      setExecStatus('success');
    } catch (err: any) {
      logs.push(`Runtime Error: ${err.message || String(err)}`);
      setOutput(logs);
      setExecStatus('error');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveSnippet = () => {
    store.createNote({
      folderId: 'f_code',
      type: 'PERSONAL',
      title: 'Practice Code Snippet',
      topicIds: topicId ? [topicId] : [],
      source: {
        type: 'video',
        videoId
      },
      content: {
        text: 'Saved from active code practice sandbox',
        sections: [
          {
            heading: 'JavaScript Code',
            body: code,
            codeSnippet: code
          }
        ]
      },
      tags: ['code', 'practice', 'sandbox']
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
      {/* Sandbox Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-200">Interactive JavaScript Sandbox</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
            Isolated
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCode(DEFAULT_STARTER_CODE)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors"
            title="Reset to starter template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleSaveSnippet}
            disabled={isSaved}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white rounded bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            {isSaved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Saved to Library' : 'Save Snippet'}</span>
          </button>

          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white rounded bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Console Split */}
      <div className="flex-1 flex flex-col md:flex-row min-h-[380px]">
        {/* Code Input */}
        <div className="flex-1 border-r border-slate-800/80 relative">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="w-full h-full bg-slate-950 p-4 font-mono text-xs sm:text-sm text-slate-200 resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500/40 leading-relaxed"
            placeholder="Type your practice code here..."
          />
        </div>

        {/* Console Output */}
        <div className="w-full md:w-5/12 bg-slate-900/40 p-4 flex flex-col">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/60 text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Console Output</span>
            {execStatus === 'success' && <span className="text-emerald-400 text-[11px]">Success</span>}
            {execStatus === 'error' && <span className="text-rose-400 text-[11px] flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Error</span>}
          </div>

          <pre className="flex-1 font-mono text-xs text-slate-300 overflow-y-auto whitespace-pre-wrap leading-relaxed select-text">
            {output.length > 0 ? output.join('\n') : (
              <span className="text-slate-500 italic">Click &quot;Run Code&quot; to execute your script in the isolated client sandbox.</span>
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
