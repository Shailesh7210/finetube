'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import { store } from '@/lib/store';

interface CodeEditorSandboxProps {
  videoId?: string;
  topicId?: string;
}

const DEFAULT_CODE = `// Code Sandbox
function solution() {
  console.log("Testing logic...");
}
solution();`;

export function CodeEditorSandbox({ videoId, topicId }: CodeEditorSandboxProps) {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runCode = () => {
    setIsRunning(true);
    const logs: string[] = [];

    const customConsole = {
      log: (...args: any[]) => {
        logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
      },
      error: (...args: any[]) => {
        logs.push(`Error: ${args.join(' ')}`);
      }
    };

    try {
      const runFn = new Function('console', code);
      runFn(customConsole);
      setOutput(logs.length ? logs : ['Done. No output.']);
    } catch (err: any) {
      setOutput([`Error: ${err.message}`]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Bar */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">JavaScript</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCode(DEFAULT_CODE)}
            className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1"
          >
            Reset
          </button>
          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 hover:bg-white text-zinc-950 font-medium rounded text-xs transition-colors"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Run</span>
          </button>
        </div>
      </div>

      {/* Editor & Console */}
      <div className="flex-1 flex flex-col gap-2 min-h-0">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded p-3 font-mono text-xs text-zinc-200 resize-none focus:outline-none focus:border-zinc-700 leading-relaxed"
        />

        <div className="h-32 bg-zinc-900/60 border border-zinc-800 rounded p-2.5 overflow-y-auto font-mono text-xs text-zinc-400">
          <span className="text-[10px] text-zinc-600 block mb-1 uppercase tracking-wider">Console</span>
          {output.length > 0 ? (
            output.map((line, i) => <div key={i}>{line}</div>)
          ) : (
            <span className="text-zinc-600 italic">Click Run to evaluate.</span>
          )}
        </div>
      </div>
    </div>
  );
}
