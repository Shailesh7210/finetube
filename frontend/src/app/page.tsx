'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[680px] h-[360px] bg-gradient-to-b from-indigo-500/12 via-sky-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-20 text-center space-y-7">
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
          Learn Deeply.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-zinc-400 to-indigo-300">
            Zero Distraction.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Personalized educational videos across <strong>sciences, medicine, humanities, and technology</strong> — paired with adaptive study tools and structured playlists.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
          {isAuthenticated ? (
            <Link
              href="/feed"
              className="px-7 py-3.5 rounded-xl bg-white text-zinc-950 font-bold text-base hover:bg-zinc-200 shadow-lg transition-all inline-flex items-center gap-2"
            >
              <span>Open Your Feed</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="px-7 py-3.5 rounded-xl bg-white text-zinc-950 font-bold text-base hover:bg-zinc-200 shadow-lg transition-all inline-flex items-center gap-2"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/topics"
                className="px-7 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white font-semibold text-base transition-all"
              >
                Browse Subjects
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Core Pillars */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-zinc-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
            <h3 className="text-lg font-bold text-white">Focused Feed</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Shows lectures matched to your <strong>subjects</strong> and <strong>interests</strong>. No entertainment noise.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
            <h3 className="text-lg font-bold text-white">Adaptive Workspace</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Formula scratchpads for STEM, concept flashcards for medicine &amp; humanities, and sandboxes for code.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
            <h3 className="text-lg font-bold text-white">Universal Discovery</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Search any topic on YouTube, build multi-subject playlists, and save timestamped notes.
            </p>
          </div>
        </div>
      </section>

      {/* Curriculum Preview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-zinc-900">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">Explore Disciplines</h2>
          <Link href="/topics" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
            All Subjects →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link
            href="/topics/physics-electrostatics"
            className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all space-y-2 block group"
          >
            <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
              Class 12 Physics
            </h3>
            <p className="text-sm text-zinc-400">
              Electrostatics, Gauss&apos;s Law, and field theory.
            </p>
          </Link>

          <Link
            href="/topics/med-cardiovascular-physiology"
            className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all space-y-2 block group"
          >
            <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
              Medical Science
            </h3>
            <p className="text-sm text-zinc-400">
              Cardiovascular physiology, anatomy, and pathology.
            </p>
          </Link>

          <Link
            href="/topics/hist-french-revolution"
            className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all space-y-2 block group"
          >
            <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
              World History
            </h3>
            <p className="text-sm text-zinc-400">
              The French Revolution and modern governance.
            </p>
          </Link>

          <Link
            href="/topics/react-hooks"
            className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all space-y-2 block group"
          >
            <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
              Computer Science
            </h3>
            <p className="text-sm text-zinc-400">
              React Hooks, Algorithms, and System Design.
            </p>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center border-t border-zinc-900">
        <div className="p-10 sm:p-14 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-5">
          <div className="flex justify-center">
            <Logo size={42} withText={false} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Ready to focus?</h2>
          <div className="pt-1">
            <Link
              href={isAuthenticated ? '/feed' : '/signup'}
              className="px-7 py-3.5 rounded-xl bg-white text-zinc-950 font-bold text-base hover:bg-zinc-200 transition-all inline-block shadow-lg"
            >
              {isAuthenticated ? 'Open Learning Feed' : 'Create Free Account'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
