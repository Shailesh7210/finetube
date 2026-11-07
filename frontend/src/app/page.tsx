'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { store } from '@/lib/store';
import { ArrowRight, Play, Terminal, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function LandingPage() {
  const { user, isAuthenticated } = useAuth();
  const topics = store.getTopics();

  return (
    <div className="relative w-full overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-600/15 via-sky-600/5 to-transparent blur-3xl pointer-events-none -z-10 animate-pulse-glow" />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center space-y-6 animate-fade-in-up">
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 shadow-sm transition-transform hover:scale-105">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
          <span><strong>FineTube v1.0</strong> • Education-only learning platform</span>
        </div>

        {/* Hero Title with Contextual Bolding */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.12] max-w-4xl mx-auto">
          Master complex concepts with <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-indigo-300">undivided focus</span>, not <span className="text-zinc-400">clickbait algorithms</span>.
        </h1>

        {/* Description with Strategic Contextual Bolding */}
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          FineTube replaces entertainment rabbit holes with <strong>topic-governed feeds</strong>, <strong>Bayesian pedagogical ranking</strong>, and an integrated <strong>in-context study workspace</strong>.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          {isAuthenticated ? (
            <Link
              href="/feed"
              className="px-6 py-3 rounded-xl bg-white text-zinc-950 font-bold text-xs sm:text-sm hover:bg-zinc-100 shadow-xl shadow-white/5 transition-all inline-flex items-center gap-2 group"
            >
              <span>Continue Learning Feed</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="px-6 py-3 rounded-xl bg-white text-zinc-950 font-bold text-xs sm:text-sm hover:bg-zinc-100 shadow-xl shadow-white/5 transition-all inline-flex items-center gap-2 group"
              >
                <span>Start Learning for Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/topics"
                className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white font-semibold text-xs sm:text-sm transition-all"
              >
                Explore Curriculum
              </Link>
            </>
          )}
        </div>

        {/* Interactive Workspace Preview Mockup */}
        <div className="pt-10 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-zinc-800/90 bg-zinc-950/90 p-3 sm:p-5 shadow-2xl shadow-indigo-950/20 text-left transition-all hover:border-zinc-700/80">
            {/* Mockup Window Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80 text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="ml-2 font-mono text-[11px] text-zinc-400">finetube.internal/watch/react-hooks</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                Live Workspace Preview
              </span>
            </div>

            {/* Split Mockup */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Left Mock Player */}
              <div className="md:col-span-7 bg-zinc-900/80 rounded-xl p-4 border border-zinc-800/60 flex flex-col justify-between min-h-[220px]">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-indigo-400 font-semibold uppercase">React Hooks Mastery</span>
                  <h4 className="text-sm font-semibold text-white leading-snug">
                    Learn useEffect & Dependency Invariants
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Analyzing how <strong>Object.is shallow comparisons</strong> trigger side-effect lifecycles.
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <span className="font-mono text-[11px]">13:42 / 15:00</span>
                  </div>
                  <span className="text-zinc-400 font-medium">⭐ <strong>4.88</strong> Bayesian Rating</span>
                </div>
              </div>

              {/* Right Mock Notes & Code Tools */}
              <div className="md:col-span-5 bg-zinc-900/50 rounded-xl p-3 border border-zinc-800/60 flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-2 text-xs border-b border-zinc-800 pb-2">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" /> Notes
                  </span>
                  <span className="text-zinc-500 font-medium flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" /> Code
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-zinc-200">Dependency Array Gotcha</span>
                      <span className="text-indigo-400 font-mono text-[10px]">05:10</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-snug">
                      Functions re-created every render violate <strong>referential stability</strong> unless wrapped in <strong>useCallback</strong>.
                    </p>
                  </div>

                  <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80 font-mono text-[10px] text-emerald-400">
                    <code>useEffect(() =&gt; cleanUp(), [dep]);</code>
                  </div>
                </div>

                <div className="text-[10px] text-zinc-500 flex items-center justify-between pt-1">
                  <span>Autosaved to <strong>My Notes</strong></span>
                  <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Synced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About The Platform & Core Pillars */}
      <section className="border-t border-zinc-800/80 bg-zinc-950/60 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-white">Engineered Around Intentional Learning</h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Three architectural pillars designed to optimize <strong>time-to-understanding</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all space-y-3">
              <span className="text-xs font-mono font-bold text-indigo-400">01</span>
              <h3 className="text-base font-semibold text-zinc-100">Topic-Aware Discovery</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Your home feed is governed strictly by <strong>explicitly chosen subjects</strong>. Exploration outside your curriculum is deliberate and will <strong>never silently hijack your recommendations</strong>.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all space-y-3">
              <span className="text-xs font-mono font-bold text-sky-400">02</span>
              <h3 className="text-base font-semibold text-zinc-100">Bayesian Evidence Ranking</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Rankings balance <strong>Bayesian adjusted ratings</strong> with <strong>verified concept checklists</strong> and <strong>pedagogical clarity</strong>, preventing clickbait from dominating.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all space-y-3">
              <span className="text-xs font-mono font-bold text-emerald-400">03</span>
              <h3 className="text-base font-semibold text-zinc-100">Integrated Workspace</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Every video player is paired with <strong>click-to-seek timestamped notes</strong>, <strong>evidenced AI key takeaways</strong>, and a <strong>sandboxed JavaScript code runner</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Showcase */}
      <section className="border-t border-zinc-800/80 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Curriculum Domains</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Explore foundational topics mapped with <strong>concept checklists</strong>.</p>
            </div>
            <Link href="/topics" className="text-xs font-medium text-indigo-400 hover:text-indigo-300">
              Browse all topics →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {topics.map(t => (
              <Link
                key={t.id}
                href={`/topics/${t.slug}`}
                className="p-5 rounded-xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-2 group block"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-indigo-400 transition-colors">
                    {t.name}
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    {t.conceptChecklist.length} Concepts
                  </span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{t.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="border-t border-zinc-800/80 py-20 text-center bg-zinc-950">
        <div className="max-w-xl mx-auto px-4 space-y-5">
          <div className="flex justify-center mb-2">
            <Logo size={36} withText={false} />
          </div>
          <h2 className="text-2xl font-bold text-white">Ready for purposeful video learning?</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Create an account in seconds to <strong>customize your learning profile</strong> and follow the exact topics you want to master.
          </p>
          <div className="pt-2">
            <Link
              href={isAuthenticated ? '/feed' : '/signup'}
              className="px-6 py-3 rounded-xl bg-white text-zinc-950 font-bold text-xs sm:text-sm hover:bg-zinc-100 shadow-xl shadow-white/5 transition-all inline-block"
            >
              {isAuthenticated ? 'Open Your Learning Feed' : 'Create Free Account'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
