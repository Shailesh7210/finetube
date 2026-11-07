'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ArrowRight, Sparkles, Check, Play, BookOpen, Terminal, Layers } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative w-full overflow-hidden">
      {/* Subtle top ambient radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[680px] h-[360px] bg-gradient-to-b from-indigo-500/12 via-sky-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center space-y-6">
        {/* Subtle Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 shadow-sm transition-all hover:border-zinc-700">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span><strong>Education-Only</strong> Video Platform</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
          Learn Deeply.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-zinc-400 to-indigo-300">
            Without Algorithmic Distraction.
          </span>
        </h1>

        {/* Crisp Description with Strategic Contextual Bolding */}
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          FineTube is a dedicated educational environment. Watch <strong>subject-focused lectures</strong>, capture <strong>timestamped personal notes</strong>, run <strong>live code</strong>, and follow <strong>structured learning sequences</strong>—free from entertainment rabbit holes.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          {isAuthenticated ? (
            <Link
              href="/feed"
              className="px-6 py-3 rounded-xl bg-white text-zinc-950 font-bold text-xs sm:text-sm hover:bg-zinc-200 shadow-lg shadow-white/5 transition-all inline-flex items-center gap-2 group"
            >
              <span>Go to Your Learning Feed</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="px-6 py-3 rounded-xl bg-white text-zinc-950 font-bold text-xs sm:text-sm hover:bg-zinc-200 shadow-lg shadow-white/5 transition-all inline-flex items-center gap-2 group"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/topics"
                className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white font-semibold text-xs sm:text-sm transition-all"
              >
                Browse Curriculum
              </Link>
            </>
          )}
        </div>
      </section>

      {/* About The Platform - 3 Core Architectural Pillars */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-zinc-900">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">About FineTube</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Engineered around one fundamental promise: <strong>respecting the learner’s attention</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/80 transition-all space-y-3">
            <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-wider">01 • Discovery</span>
            <h3 className="text-base font-bold text-white">Governed Home Feed</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Your home feed prioritizes <strong>explicitly followed topics</strong>. Unrelated recommendations are strictly suppressed, and exploration outside your curriculum <strong>never silently hijacks your feed</strong>.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/80 transition-all space-y-3">
            <span className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-wider">02 • Active Study</span>
            <h3 className="text-base font-bold text-white">In-Context Workspace</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every video is paired with a split workspace: write <strong>timestamp-synced notes</strong>, execute <strong>JavaScript code snippets</strong>, and query <strong>grounded AI assistant</strong> for verified answers.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/80 transition-all space-y-3">
            <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">03 • Progression</span>
            <h3 className="text-base font-bold text-white">Sequenced Learning Paths</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Playlists are ordered by <strong>prerequisite dependencies</strong>—foundational principles precede advanced applications, with <strong>coverage gaps flagged honestly</strong> and zero redundant fluff.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works - 3 Easy Steps */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-zinc-900">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">How It Works</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            A frictionless learning flow designed for <strong>maximum conceptual retention</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800/60 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-zinc-200 flex items-center justify-center text-xs font-mono font-bold border border-zinc-800">
              1
            </div>
            <h4 className="text-sm font-bold text-white">Choose Your Topics</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Sign up and <strong>customize your profile</strong> by selecting the exact subjects, coding language, and study target you want to master.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800/60 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-zinc-200 flex items-center justify-center text-xs font-mono font-bold border border-zinc-800">
              2
            </div>
            <h4 className="text-sm font-bold text-white">Watch in the Workspace</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Study without distractions. Click timestamps to jump to key moments, take notes, and run practice code directly alongside the video.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800/60 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-zinc-200 flex items-center justify-center text-xs font-mono font-bold border border-zinc-800">
              3
            </div>
            <h4 className="text-sm font-bold text-white">Retain in Your Library</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              All your timestamped notes, code drafts, and forked playlists are automatically organized in your <strong>personal library</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Topics Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-zinc-900">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Curriculum Preview</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Explore structured domains mapped to objective <strong>concept checklists</strong>.</p>
          </div>
          <Link href="/topics" className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors">
            View All Topics →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/topics/react-hooks"
            className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all space-y-2.5 block group"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                React Hooks
              </h3>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded">
                8 Lessons
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
              Master <strong>useState</strong>, <strong>useEffect lifecycle</strong>, <strong>dependency arrays</strong>, and custom hooks.
            </p>
          </Link>

          <Link
            href="/topics/binary-search-trees"
            className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all space-y-2.5 block group"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                Binary Search Trees
              </h3>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded">
                6 Lessons
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
              Understand <strong>BST invariant properties</strong>, pointer manipulation, recursive insert, and deletion cases.
            </p>
          </Link>

          <Link
            href="/topics/system-design"
            className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all space-y-2.5 block group"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                System Design
              </h3>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded">
                5 Lessons
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
              Architect scalable backends: <strong>horizontal scaling</strong>, <strong>caching layers</strong>, and <strong>CAP theorem</strong>.
            </p>
          </Link>
        </div>
      </section>

      {/* Clean Call To Action */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center border-t border-zinc-900">
        <div className="p-8 sm:p-12 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
          <div className="flex justify-center mb-1">
            <Logo size={36} withText={false} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Ready to focus your learning?</h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Create an account in 30 seconds to <strong>customize your profile</strong>, select your target topics, and eliminate educational noise.
          </p>
          <div className="pt-2">
            <Link
              href={isAuthenticated ? '/feed' : '/signup'}
              className="px-6 py-3 rounded-xl bg-white text-zinc-950 font-bold text-xs sm:text-sm hover:bg-zinc-200 transition-all inline-block shadow-lg shadow-white/5"
            >
              {isAuthenticated ? 'Open Learning Feed' : 'Create Free Account'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
