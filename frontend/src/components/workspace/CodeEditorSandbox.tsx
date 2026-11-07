'use client';

import { useState, useEffect } from 'react';
import { Play, BookmarkPlus, Check, RotateCcw, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';

interface CodeEditorSandboxProps {
  videoId?: string;
  topicId?: string;
}

const TEMPLATES: Record<string, Record<string, string>> = {
  react_hooks: {
    javascript: `// React Hook Lifecycle Simulation
function simulateEffect(dependencies) {
  console.log("Effect executed with deps:", JSON.stringify(dependencies));
  return function cleanup() {
    console.log("Cleaned up previous effect resources");
  };
}

const cleanup = simulateEffect([1, "active"]);
cleanup();`,
    python: `# Python State Simulator
def simulate_state(initial):
    state = [initial]
    def set_state(new_val):
        state[0] = new_val
        print(f"State mutated to: {new_val}")
    return state, set_state

val, update_val = simulate_state(10)
update_val(25)`,
    typescript: `// TypeScript Typed Hook State
interface State<T> {
  data: T;
  isLoading: boolean;
}

const hookState: State<string> = {
  data: "Synchronized User Profile",
  isLoading: false
};

console.log("Typed State Data:", hookState.data);`
  },
  binary_search_trees: {
    javascript: `// Binary Search Tree (BST) Node & Invariant Check
class BSTNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

function insert(root, val) {
  if (!root) return new BSTNode(val);
  if (val < root.val) root.left = insert(root.left, val);
  else root.right = insert(root.right, val);
  return root;
}

let root = insert(null, 20);
insert(root, 10);
insert(root, 30);

console.log("BST Root:", root.val);
console.log("Left Child (< Root):", root.left.val);
console.log("Right Child (> Root):", root.right.val);`,
    python: `# Binary Search Tree Insertion
class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None

print("Initialized BST Node class")`,
    typescript: `// BST Generic Definition
class TreeNode<T> {
  val: T;
  left: TreeNode<T> | null = null;
  right: TreeNode<T> | null = null;
  constructor(val: T) {
    this.val = val;
  }
}
const n = new TreeNode<number>(42);
console.log("Created root node with value:", n.val);`
  },
  system_design: {
    javascript: `// Distributed Cache with LRU Eviction
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const v = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, v);
    return v;
  }
  put(key, val) {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.capacity) {
      const oldest = this.cache.keys().next().value;
      this.cache.delete(oldest);
      console.log("Evicted LRU key from cache:", oldest);
    }
    this.cache.set(key, val);
  }
}

const c = new LRUCache(2);
c.put("session_1", "active");
c.put("session_2", "active");
c.put("session_3", "active");
console.log("Session 1 present:", c.get("session_1"));`,
    python: `# Simple Token Bucket Rate Limiter
capacity = 10
tokens = 10
print(f"Token bucket initialized with capacity: {capacity}")`,
    typescript: `// Load Balancer Round Robin
const servers = ["10.0.0.1", "10.0.0.2", "10.0.0.3"];
let idx = 0;
function getNext() {
  const target = servers[idx];
  idx = (idx + 1) % servers.length;
  return target;
}
console.log("Routed request to:", getNext());`
  }
};

export function CodeEditorSandbox({ videoId, topicId = 'react_hooks' }: CodeEditorSandboxProps) {
  const [language, setLanguage] = useState<'javascript' | 'python' | 'typescript'>('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [quotaRemaining, setQuotaRemaining] = useState<number>(48);
  const [isSaved, setIsSaved] = useState(false);

  // Load template on mount or topic/language switch
  useEffect(() => {
    const topicKey = topicId in TEMPLATES ? topicId : 'react_hooks';
    const initial = TEMPLATES[topicKey][language] || TEMPLATES.react_hooks.javascript;
    setCode(initial);
    setOutput([]);
    setExecutionTime(null);
  }, [topicId, language]);

  // Load quota
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
    const title = `${language.toUpperCase()} Practice: ${topicId.replace('_', ' ')}`;
    await api.saveCodeSnippet(title, code, language, videoId, topicId);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleReset = () => {
    const topicKey = topicId in TEMPLATES ? topicId : 'react_hooks';
    setCode(TEMPLATES[topicKey][language] || '');
    setOutput([]);
    setExecutionTime(null);
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Sandbox Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-zinc-800 pb-2.5">
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-200 focus:outline-none focus:border-zinc-600"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="typescript">TypeScript</option>
          </select>

          {/* Quota Badge */}
          <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
            Quota: <strong>{quotaRemaining}/50</strong> runs left
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Save Snippet */}
          <button
            onClick={handleSaveToLibrary}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
            title="Save snippet to Study Library"
          >
            {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Saved to Library' : 'Save Snippet'}</span>
          </button>

          {/* Reset Template */}
          <button
            onClick={handleReset}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
            title="Reset to topic template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Run Code Button */}
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-zinc-200 text-zinc-950 font-bold rounded-md text-xs transition-colors shadow-sm disabled:opacity-50"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Console Split */}
      <div className="flex-1 flex flex-col gap-2 min-h-0">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-3 font-mono text-xs text-zinc-200 resize-none focus:outline-none focus:border-zinc-700 leading-relaxed tracking-wide"
          placeholder="Write or test code here..."
        />

        {/* Execution Output Console */}
        <div className="h-36 bg-zinc-950 border border-zinc-800/90 rounded-lg p-3 flex flex-col justify-between font-mono text-xs overflow-hidden">
          <div className="flex items-center justify-between text-[11px] text-zinc-500 pb-1.5 border-b border-zinc-900">
            <span className="font-semibold uppercase tracking-wider text-zinc-400">Sandbox Output</span>
            <div className="flex items-center gap-3">
              {executionTime !== null && (
                <span className="text-emerald-400 text-[10px]">
                  ⚡ <strong>{executionTime}ms</strong> execution
                </span>
              )}
              <button
                onClick={() => setOutput([])}
                className="hover:text-zinc-300 text-zinc-600 transition-colors"
                title="Clear console"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pt-2 space-y-1 text-zinc-300">
            {output.length > 0 ? (
              output.map((line, i) => (
                <div
                  key={i}
                  className={line.startsWith('Error') || line.startsWith('Runtime Error') ? 'text-rose-400' : ''}
                >
                  {line}
                </div>
              ))
            ) : (
              <span className="text-zinc-600 italic">Click Run to evaluate in isolated sandbox.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
