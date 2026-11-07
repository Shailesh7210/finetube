'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { store } from '@/lib/store';
import { ArrowRight, Check } from 'lucide-react';

export default function LandingPage() {
  const { user, isAuthenticated } = useAuth();
  const topics = store.getTopics();

  return (
    <div className="w-full">
      {/* Hero / About Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center space-y-6">
        {isAuthenticated && user && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
            <span>Logged in as <strong className="text-white">{user.displayName}</strong></span>
            <Link href="/feed" className="text-blue-400 hover:underline inline-flex items-center gap-0.5">
              Go to Feed <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
          Video learning built for focus, not watch time.
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          FineTube is an education-only platform designed to eliminate algorithmic distractions. Choose your subjects, explore verified explanations, take timestamped notes, and practice code directly in context.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          {isAuthenticated ? (
            <Link
              href="/feed"
              className="px-5 py-2.5 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs transition-colors inline-flex items-center gap-1.5"
            >
              <span>Open Your Feed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="px-5 py-2.5 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs transition-colors inline-flex items-center gap-1.5"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-medium text-xs transition-colors"
              >
                Log In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* About The Platform */}
      <section className="border-t border-zinc-800/80 bg-zinc-950/40 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xl font-semibold text-white">How FineTube Works</h2>
            <p className="text-xs text-zinc-400">
              Designed around deliberate mastery rather than entertainment clickbait.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-zinc-900/40 border border-zinc-800/80 space-y-3">
              <span className="text-xs font-mono text-zinc-500">01</span>
              <h3 className="text-sm font-semibold text-zinc-100">Topic-Aware Discovery</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Feeds are governed strictly by your followed curriculum topics. Browsing behavior does not silently hijack your feed with unrelated videos.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-zinc-900/40 border border-zinc-800/80 space-y-3">
              <span className="text-xs font-mono text-zinc-500">02</span>
              <h3 className="text-sm font-semibold text-zinc-100">Bayesian Evidence Ranking</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Recommendations prioritize explanation clarity, concept coverage, and confidence-adjusted community feedback rather than raw views.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-zinc-900/40 border border-zinc-800/80 space-y-3">
              <span className="text-xs font-mono text-zinc-500">03</span>
              <h3 className="text-sm font-semibold text-zinc-100">In-Context Workspace</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Watch lessons alongside timestamped personal notes, structured AI summaries, and an isolated browser code sandbox.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Topics Preview */}
      <section className="border-t border-zinc-800/80 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Curriculum Topics</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Explore foundational and advanced technical topics.</p>
            </div>
            <Link href="/topics" className="text-xs text-zinc-400 hover:text-white">
              Browse all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {topics.map(t => (
              <Link
                key={t.id}
                href={`/topics/${t.slug}`}
                className="p-4 rounded-lg bg-zinc-900/30 border border-zinc-800/70 hover:border-zinc-700 transition-colors space-y-1.5 block"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-200">{t.name}</span>
                </div>
                <p className="text-xs text-zinc-500 line-clamp-2">{t.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-zinc-800/80 py-16 text-center bg-zinc-900/20">
        <div className="max-w-xl mx-auto px-4 space-y-4">
          <h2 className="text-xl font-semibold text-white">Start your focused learning today</h2>
          <p className="text-xs text-zinc-400">
            Sign up to customize your curriculum preferences and save timestamped notes.
          </p>
          <div className="pt-2">
            <Link
              href={isAuthenticated ? '/feed' : '/signup'}
              className="px-5 py-2.5 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs transition-colors inline-block"
            >
              {isAuthenticated ? 'Open Your Feed' : 'Create Free Account'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
