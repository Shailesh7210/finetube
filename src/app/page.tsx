import Link from 'next/link';
import { 
  Sparkles, 
  Compass, 
  BookOpen, 
  SlidersHorizontal, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { store } from '../lib/store';
import { VideoCard } from '../components/VideoCard';

export default function HomePage() {
  const feedItems = store.getFocusedFeed();
  const followedTopics = store.getTopics().filter(t => 
    store.user.followedTopicIds.includes(t.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Top Value Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-950/60 via-slate-900 to-indigo-950/40 border border-brand-500/20 p-6 sm:p-8">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-brand-400" />
            Distraction-Free Educational Architecture
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Learn with intent. Zero entertainment rabbit holes.
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            FineTube ranks videos strictly by concept coverage, Bayesian community consensus, and pedagogical clarity — never by pure addictive watch time.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/topics"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Browse Subject Taxonomy</span>
            </Link>
            <Link
              href="/playlists"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Structured Learning Paths</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Followed Topics Bar */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-400" />
            Your Focused Feed
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Governed by your explicit interests • Sorted by Bayesian pedagogical quality
          </p>
        </div>

        <Link
          href="/settings/interests"
          className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Manage Interests</span>
        </Link>
      </div>

      {/* Quick Topic Switcher Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-medium text-slate-400 shrink-0">Followed:</span>
        {followedTopics.map((topic) => (
          <Link
            key={topic.id}
            href={`/topics/${topic.slug}`}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:border-brand-500/50 hover:text-white transition-all shrink-0"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
            <span>{topic.name}</span>
          </Link>
        ))}
        <Link
          href="/topics"
          className="text-xs text-brand-400 hover:underline px-2 py-1 shrink-0"
        >
          + Add more
        </Link>
      </div>

      {/* Video Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feedItems.map(({ video, topic }) => (
          <VideoCard 
            key={video.id} 
            video={video} 
            topic={topic}
            showRankScore={true}
          />
        ))}
      </div>

      {/* Bottom Educational Callout */}
      <div className="border border-slate-800/80 rounded-xl p-5 bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-brand-400 shrink-0" />
          <div>
            <p className="font-semibold text-slate-200">How FineTube Ranking Works</p>
            <p>Scores are calculated using Bayesian user averages + AI topic coverage evaluation. Zero clickbait algorithms.</p>
          </div>
        </div>
        <Link
          href="/topics/react-hooks"
          className="text-brand-400 hover:text-brand-300 font-medium inline-flex items-center gap-1 shrink-0"
        >
          <span>Explore React Hooks Module</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
