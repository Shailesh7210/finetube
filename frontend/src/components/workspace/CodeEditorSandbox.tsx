'use client';

import { useState, useEffect } from 'react';
import { Play, BookmarkPlus, Check, RotateCcw, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { CodeLanguage } from '@/lib/types';

interface CodeEditorSandboxProps {
  videoId?: string;
  topicId?: string;
}

const LANGUAGE_OPTIONS: { id: CodeLanguage; label: string }[] = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'cpp', label: 'C++' },
  { id: 'c', label: 'C' },
  { id: 'java', label: 'Java' },
  { id: 'go', label: 'Go' },
  { id: 'rust', label: 'Rust' },
  { id: 'sql', label: 'SQL' },
  { id: 'bash', label: 'Bash / Shell' }
];

const DEFAULT_TEMPLATES: Record<CodeLanguage, string> = {
  javascript: `// JavaScript Playground\nfunction greet(topic) {\n  console.log("Studying:", topic);\n}\ngreet("Algorithms & Architecture");`,
  typescript: `// TypeScript Playground\ninterface Lesson {\n  title: string;\n  completed: boolean;\n}\nconst lesson: Lesson = { title: "Type Safety", completed: true };\nconsole.log("Verified:", lesson.title);`,
  python: `# Python 3 Playground\ndef solve(nums):\n    return sum(nums)\n\nprint("Result: 15")`,
  cpp: `// C++20 Playground\n#include <iostream>\nint main() {\n    std::cout << "Hello from C++20!" << std::endl;\n    return 0;\n}`,
  c: `// C17 Playground\n#include <stdio.h>\nint main() {\n    printf("Hello from C Sandbox!");\n    return 0;\n}`,
  java: `// Java 21 Playground\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}`,
  go: `// Go 1.22 Playground\npackage main\nimport "fmt"\nfunc main() {\n    fmt.Println("Hello from Go Sandbox!")\n}`,
  rust: `// Rust Playground\nfn main() {\n    println!("Hello from Rust Sandbox!");\n}`,
  sql: `-- SQL Query Sandbox\nSELECT topic_name, rating_average\nFROM educational_videos\nWHERE rating_average >= 4.5\nORDER BY rating_average DESC;`,
  bash: `# Bash / Shell Playground\necho "Initializing FineTube study environment..."\necho "Workspace ready."`
};

const TOPIC_TEMPLATES: Record<string, Partial<Record<CodeLanguage, string>>> = {
  react_hooks: {
    javascript: `// React Hook Lifecycle Simulation\nfunction simulateEffect(deps) {\n  console.log("Effect executed with deps:", JSON.stringify(deps));\n  return () => console.log("Cleaned up previous effect");\n}\nconst cleanup = simulateEffect([1, "active"]);\ncleanup();`,
    typescript: `// TypeScript Typed Hook State\ninterface State<T> {\n  data: T;\n  isLoading: boolean;\n}\nconst hookState: State<string> = { data: "Synced Profile", isLoading: false };\nconsole.log("Typed State:", hookState.data);`,
    python: `# Python State Simulator\nstate = ["initialized"]\nprint("State updated to: active")`
  },
  binary_search_trees: {
    javascript: `// Binary Search Tree Insertion\nclass BSTNode {\n  constructor(val) { this.val = val; this.left = null; this.right = null; }\n}\nfunction insert(root, val) {\n  if (!root) return new BSTNode(val);\n  if (val < root.val) root.left = insert(root.left, val);\n  else root.right = insert(root.right, val);\n  return root;\n}\nlet root = insert(null, 20);\ninsert(root, 10);\ninsert(root, 30);\nconsole.log("Root:", root.val, "| Left:", root.left.val, "| Right:", root.right.val);`,
    cpp: `// C++ Binary Search Tree Node\n#include <iostream>\nstruct Node { int val; Node *left, *right; };\nint main() {\n    std::cout << "BST Node invariant verified: left < root < right";\n    return 0;\n}`,
    java: `// Java BST Traversal\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("In-order traversal yields sorted sequence");\n    }\n}`,
    python: `# Python BST Check\nprint("BST invariant: left < root < right")`
  },
  system_design: {
    javascript: `// Distributed Cache with LRU Eviction\nclass LRUCache {\n  constructor(cap) { this.cap = cap; this.cache = new Map(); }\n  put(k, v) {\n    if (this.cache.has(k)) this.cache.delete(k);\n    else if (this.cache.size >= this.cap) {\n      const oldest = this.cache.keys().next().value;\n      this.cache.delete(oldest);\n      console.log("Evicted:", oldest);\n    }\n    this.cache.set(k, v);\n  }\n}\nconst c = new LRUCache(2);\nc.put("s1", 1); c.put("s2", 2); c.put("s3", 3);`,
    go: `// Go Load Balancer Round-Robin\npackage main\nimport "fmt"\nfunc main() {\n    fmt.Println("Routed request to backend node 10.0.0.1")\n}`,
    sql: `-- Cache Hit Rate Analytics\nSELECT service_name, cache_hit_ratio\nFROM system_metrics\nORDER BY cache_hit_ratio DESC;`
  }
};

function getTemplate(topicId: string, lang: CodeLanguage): string {
  return TOPIC_TEMPLATES[topicId]?.[lang] || DEFAULT_TEMPLATES[lang];
}

export function CodeEditorSandbox({ videoId, topicId = 'react_hooks' }: CodeEditorSandboxProps) {
  const [language, setLanguage] = useState<CodeLanguage>('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [quotaRemaining, setQuotaRemaining] = useState<number>(48);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setCode(getTemplate(topicId, language));
    setOutput([]);
    setExecutionTime(null);
  }, [topicId, language]);

  useEffect(() => {
    async function loadQuota() {
      const q = await api.getCodeQuota();
      if (q) setQuotaRemaining(q.remaining);
    }
    loadQuota();
  }, []);

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const result = await api.executeCode(code, language, videoId, topicId);
      setOutput(result.output || []);
      setExecutionTime(result.executionTimeMs);
      if (result.quotaRemaining !== undefined) {
        setQuotaRemaining(result.quotaRemaining);
      }
    } catch (err: any) {
      setOutput([`Execution failed: ${err.message}`]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveToLibrary = async () => {
    const label = LANGUAGE_OPTIONS.find(l => l.id === language)?.label || language.toUpperCase();
    const title = `${label} Snippet: ${topicId.replace(/_/g, ' ')}`;
    await api.saveCodeSnippet(title, code, language, videoId, topicId);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleReset = () => {
    setCode(getTemplate(topicId, language));
    setOutput([]);
    setExecutionTime(null);
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-200 pb-2.5">
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as CodeLanguage)}
            className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
          >
            {LANGUAGE_OPTIONS.map(opt => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>

          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            {quotaRemaining}/50 left
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveToLibrary}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 border border-slate-200 transition-colors"
          >
            {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-colors disabled:opacity-50"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{isRunning ? 'Running...' : 'Run'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2.5 min-h-0">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="flex-1 bg-slate-50 border border-slate-300 rounded-xl p-3 font-mono text-xs text-slate-900 resize-none focus:outline-none focus:bg-white focus:border-indigo-500 leading-relaxed"
          placeholder="Write or test code here..."
        />

        <div className="h-36 bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between font-mono text-xs overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-1.5 border-b border-slate-200">
            <span className="font-semibold text-slate-700">Output</span>
            <div className="flex items-center gap-3">
              {executionTime !== null && (
                <span className="text-emerald-700 text-xs">
                  {executionTime}ms
                </span>
              )}
              <button
                onClick={() => setOutput([])}
                className="hover:text-slate-900 text-slate-400 transition-colors"
                title="Clear"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pt-2 space-y-1 text-slate-800">
            {output.length > 0 ? (
              output.map((line, i) => (
                <div
                  key={i}
                  className={line.startsWith('Error') || line.startsWith('Runtime Error') ? 'text-rose-600' : ''}
                >
                  {line}
                </div>
              ))
            ) : (
              <span className="text-slate-400 italic">Click Run to execute.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
