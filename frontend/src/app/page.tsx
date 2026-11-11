'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Play, Search, Star } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { store } from '@/lib/store';
import { formatDuration } from '@/lib/utils';
import { Reveal } from '@/components/Reveal';
import { Logo } from '@/components/Logo';
import { HeroTopicAnimation } from '@/components/HeroTopicAnimation';

const KINETIC_SUBJECTS = ['Physics', 'Medicine', 'History', 'Calculus', 'Code'];

interface WorkspaceSlide {
  id: string;
  tab: string;
  subject: string;
  title: string;
  channel: string;
  duration: string;
  rating: string;
  toolLabel: string;
  snippet: string;
  query: string;
}

const WORKSPACE_SLIDES: WorkspaceSlide[] = [
  {
    id: 'science',
    tab: 'Science',
    subject: 'Class 12 · Physics',
    title: "Electrostatics & Gauss's Law",
    channel: 'Physics Galaxy',
    duration: '32:10',
    rating: '4.92',
    toolLabel: 'Formula Scratchpad',
    snippet: '∮ E⃗ · dA⃗ = Q_enc / ε₀',
    query: 'Class 12 Physics Electrostatics'
  },
  {
    id: 'medicine',
    tab: 'Medicine',
    subject: 'Medical · Physiology',
    title: 'Cardiac Cycle & Hemodynamics',
    channel: 'Osmosis & Ninja Nerd',
    duration: '35:40',
    rating: '4.95',
    toolLabel: 'Terminology Cards',
    snippet: 'CO = HR × Stroke Volume',
    query: 'Human cardiovascular system'
  },
  {
    id: 'history',
    tab: 'History',
    subject: 'World History · 1789',
    title: 'French Revolution & Reforms',
    channel: 'CrashCourse History',
    duration: '24:15',
    rating: '4.87',
    toolLabel: 'Concept Timeline',
    snippet: 'Estates-General → Rights of Man',
    query: 'French Revolution'
  },
  {
    id: 'code',
    tab: 'Code',
    subject: 'Computer Science · React',
    title: 'useEffect & State Sync',
    channel: 'Web Dev Simplified',
    duration: '14:05',
    rating: '4.89',
    toolLabel: 'Code Sandbox',
    snippet: 'useEffect(() => cleanup, [deps])',
    query: 'React useEffect'
  }
];

const DISCOVERY_QUERIES = [
  { q: 'Class 12 Physics Electrostatics', tag: 'Physics' },
  { q: 'Human cardiovascular system', tag: 'Medicine' },
  { q: 'Organic Chemistry Mechanisms', tag: 'Chemistry' },
  { q: 'French Revolution', tag: 'History' },
  { q: 'React useEffect', tag: 'Engineering' }
];

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [heroSearch, setHeroSearch] = useState('');
  const [subjectWordIdx, setSubjectWordIdx] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);
  const [discoveryIdx, setDiscoveryIdx] = useState(0);

  const subjects = store.getSubjects();
  const topics = store.getTopics();
  const videos = store.getVideos();
  const playlists = store.getPlaylists();

  useEffect(() => {
    const timer = setInterval(() => {
      setSubjectWordIdx(prev => (prev + 1) % KINETIC_SUBJECTS.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!autoSlide) return;
    const timer = setInterval(() => {
      setSlideIdx(prev => (prev + 1) % WORKSPACE_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [autoSlide]);

  useEffect(() => {
    const timer = setInterval(() => {
      setDiscoveryIdx(prev => (prev + 1) % DISCOVERY_QUERIES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = WORKSPACE_SLIDES[slideIdx];
  const currentDiscovery = DISCOVERY_QUERIES[discoveryIdx];

  const featuredVideos = useMemo(() => {
    const preferredIds = [
      'vid_physics_electrostatics_cbse',
      'vid_med_cardio_anatomy',
      'vid_chem_organic_reactions_mastery',
      'vid_hist_french_revolution_crash',
      'vid_math_calculus_essence',
      'vid_react_useeffect'
    ];
    const picked = preferredIds
      .map(id => videos.find(v => v.id === id))
      .filter((v): v is NonNullable<typeof v> => !!v);
    return picked.length >= 4 ? picked : videos.slice(0, 6);
  }, [videos]);

  const marqueeRow1 = useMemo(() => topics.slice(0, Math.ceil(topics.length / 2)), [topics]);
  const marqueeRow2 = useMemo(() => topics.slice(Math.ceil(topics.length / 2)), [topics]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroSearch.trim()) return;
    router.push(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Ambient Grid & Gentle Pastel Orbs */}
      <div className="absolute inset-0 bg-dot-grid opacity-45 pointer-events-none -z-20" />
      <div className="absolute -top-24 left-1/4 w-[460px] h-[460px] rounded-full bg-indigo-200/40 blur-3xl animate-blob pointer-events-none -z-10" />
      <div className="absolute top-28 right-1/6 w-[400px] h-[400px] rounded-full bg-sky-200/40 blur-3xl animate-blob-delayed pointer-events-none -z-10" />

      {/* MINIMAL SPLIT HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 sm:pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left: Clean Editorial Typography & Search */}
          <div className="lg:col-span-6 space-y-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-medium text-slate-600 animate-fade-in-up">
              <span>Built for</span>
              <span
                key={subjectWordIdx}
                className="font-bold text-indigo-600 inline-block animate-word-slide min-w-[64px] text-left"
              >
                {KINETIC_SUBJECTS[subjectWordIdx]}
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-[68px] font-bold tracking-[-0.04em] text-slate-900 leading-[1.04] animate-fade-in-up">
              Study deeper,{' '}
              <span className="font-editorial italic font-normal text-indigo-600">
                without
              </span>{' '}
              the noise.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-md mx-auto lg:mx-0 animate-fade-in-up">
              Educational YouTube filtered for your subjects.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleHeroSearch} className="max-w-lg mx-auto lg:mx-0 animate-fade-in-up">
              <div className="flex items-center bg-white rounded-2xl border border-slate-300 shadow-md shadow-slate-200/50 p-1.5 focus-within:border-indigo-500 transition-all">
                <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={e => setHeroSearch(e.target.value)}
                  placeholder="Search Physics, Cardiology, History..."
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-sm font-semibold transition-all shrink-0"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Primary Actions */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 animate-fade-in-up">
              <Link
                href={isAuthenticated ? '/feed' : '/signup'}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold text-sm sm:text-base shadow-md shadow-indigo-500/20 transition-all inline-flex items-center gap-2"
              >
                <span>{isAuthenticated ? 'Open Feed' : 'Start Learning'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/topics"
                className="px-5 py-3 rounded-xl text-slate-700 hover:text-slate-900 font-semibold text-sm sm:text-base hover:bg-white border border-transparent hover:border-slate-200 transition-all"
              >
                Explore {topics.length} Topics →
              </Link>
            </div>
          </div>

          {/* Right: Animated Floating Workspace Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative max-w-xl mx-auto pt-4 pb-8">
              {/* Floating Tool Pill Top-Right */}
              <div className="hidden sm:block absolute -top-2 -right-2 z-20 px-4 py-2.5 rounded-2xl bg-white border border-indigo-200 shadow-lg shadow-indigo-100/80 animate-float">
                <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wide block">
                  {currentSlide.toolLabel}
                </span>
                <span className="text-xs font-mono font-semibold text-slate-900">
                  {currentSlide.snippet}
                </span>
              </div>

              {/* Main Glass Video Preview Card */}
              <div
                key={currentSlide.id}
                className="rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/70 p-5 space-y-4 animate-fade-in-up"
              >
                {/* Animated Topic Video Stage */}
                <Link
                  href={`/search?q=${encodeURIComponent(currentSlide.query)}`}
                  className="relative aspect-video rounded-2xl bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 border border-slate-200/90 flex flex-col justify-between overflow-hidden group block"
                  aria-label={`Explore ${currentSlide.title}`}
                >
                  {/* Topic-Specific Animated Visualization */}
                  <div className="absolute inset-0">
                    <HeroTopicAnimation topicId={currentSlide.id} />
                  </div>

                  {/* Top Stage Overlay Chips */}
                  <div className="relative z-10 flex items-center justify-between p-3.5 pointer-events-none">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200 text-xs font-semibold text-indigo-700 shadow-2xs">
                      {currentSlide.subject}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-xs border border-slate-200 text-xs font-mono font-semibold text-slate-800">
                      {currentSlide.duration}
                    </span>
                  </div>

                  {/* Subtle Hover Play Action (Keeps Topic Animation Unobstructed) */}
                  <div className="relative z-10 flex items-center justify-center my-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="px-4 py-2.5 rounded-full bg-slate-900/90 text-white text-xs font-semibold inline-flex items-center gap-2 shadow-lg backdrop-blur-xs">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Explore Topic</span>
                    </span>
                  </div>

                  {/* Animated Playback Progress */}
                  <div className="relative z-10 px-4 pb-3 pt-1">
                    <div className="w-full h-1.5 rounded-full bg-slate-200/90 overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full animate-progress-flow" />
                    </div>
                  </div>
                </Link>

                {/* Card Footer Meta */}
                <div className="flex items-center justify-between gap-4 px-1">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {currentSlide.title}
                    </h3>
                    <span className="text-xs text-slate-500">{currentSlide.channel}</span>
                  </div>

                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-slate-900 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{currentSlide.rating}</span>
                  </div>
                </div>
              </div>

              {/* Floating Filter Badge Bottom-Left */}
              <div className="hidden sm:flex items-center gap-2 absolute bottom-2 -left-3 z-20 px-4 py-2 rounded-2xl bg-white border border-emerald-200 shadow-lg shadow-slate-200/60 animate-float-delayed">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-slate-800">Distractions suppressed</span>
              </div>
            </div>

            {/* Quick Mode Selector Dots */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {WORKSPACE_SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setAutoSlide(false);
                    setSlideIdx(idx);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    slideIdx === idx
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {s.tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DUAL-ROW INFINITE SUBJECTS MARQUEE */}
      <section className="py-8 border-y border-slate-200 bg-white/80 marquee-container overflow-hidden space-y-3">
        <div className="animate-marquee gap-3">
          {[...marqueeRow1, ...marqueeRow1].map((t, i) => (
            <Link
              key={`${t.id}-r1-${i}`}
              href={`/topics/${t.slug}`}
              className="mx-1.5 px-4 py-2 rounded-full bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-sm font-medium text-slate-700 hover:text-indigo-700 whitespace-nowrap transition-colors"
            >
              {t.name}
            </Link>
          ))}
        </div>

        <div className="animate-marquee-reverse gap-3">
          {[...marqueeRow2, ...marqueeRow2].map((t, i) => (
            <Link
              key={`${t.id}-r2-${i}`}
              href={`/topics/${t.slug}`}
              className="mx-1.5 px-4 py-2 rounded-full bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-sm font-medium text-slate-700 hover:text-indigo-700 whitespace-nowrap transition-colors"
            >
              {t.name}
            </Link>
          ))}
        </div>
      </section>

      {/* PLATFORM METRICS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-center hover:-translate-y-0.5 transition-transform">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">{subjects.length}+</div>
              <div className="text-sm font-medium text-slate-500 mt-1">Disciplines</div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-center hover:-translate-y-0.5 transition-transform">
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600">{topics.length}+</div>
              <div className="text-sm font-medium text-slate-500 mt-1">Topics</div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-center hover:-translate-y-0.5 transition-transform">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">3</div>
              <div className="text-sm font-medium text-slate-500 mt-1">Study Workspaces</div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-center hover:-translate-y-0.5 transition-transform">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600">0%</div>
              <div className="text-sm font-medium text-slate-500 mt-1">Noise</div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* BENTO FEATURES (LOW TEXT, VISUAL DATA) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Reveal delayMs={40} className="lg:col-span-6">
            <div className="h-full p-7 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Dynamic YouTube Discovery</h3>
                <p className="text-sm text-slate-500 mt-1">Live search across any subject on demand.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <span className="font-mono text-sm text-slate-800 truncate">
                  {currentDiscovery.q}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold shrink-0">
                  {currentDiscovery.tag}
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delayMs={100} className="lg:col-span-6">
            <div className="h-full p-7 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Universal Learning Paths</h3>
                <p className="text-sm text-slate-500 mt-1">Structured sequences across sciences, medicine &amp; tech.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {playlists.slice(0, 2).map(pl => (
                  <Link
                    key={pl.id}
                    href={`/playlists/${pl.id}`}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 transition-colors block"
                  >
                    <span className="text-xs font-bold text-slate-900 line-clamp-1 block">{pl.title}</span>
                    <span className="text-[11px] text-slate-500">{pl.items.length} lessons · {pl.ratingAverage} ★</span>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURED LECTURES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 space-y-6">
        <Reveal>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Featured Lectures
            </h2>
            <Link href="/feed" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              Open Feed →
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVideos.map((v, idx) => {
            const topic = topics.find(t => t.id === v.primaryTopicId);
            return (
              <Reveal key={v.id} delayMs={idx * 65}>
                <Link
                  href={`/watch/${v.id}`}
                  className="group block rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all"
                >
                  <div className="relative aspect-video bg-slate-200 overflow-hidden">
                    <img
                      src={v.thumbnailUrl}
                      alt={v.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-900/85 text-xs font-mono font-semibold text-white">
                      {formatDuration(v.durationSeconds)}
                    </span>
                  </div>
                  <div className="p-4 space-y-1.5">
                    {topic && (
                      <span className="text-xs font-semibold text-indigo-600 block">
                        {topic.name}
                      </span>
                    )}
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-2 transition-colors">
                      {v.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span>{v.channelTitle}</span>
                      <span className="font-semibold text-slate-800">{v.ratingAverage} ★</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* CLEAN BOTTOM CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <Reveal>
          <div className="p-10 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-sky-50 border border-indigo-200 text-center space-y-5 shadow-md">
            <div className="flex justify-center">
              <Logo size={40} withText={false} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Ready to{' '}
              <span className="font-editorial italic font-normal text-indigo-600">focus</span>?
            </h2>
            <div className="flex flex-wrap justify-center gap-3 pt-1">
              <Link
                href={isAuthenticated ? '/feed' : '/signup'}
                className="px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-sm transition-all inline-flex items-center gap-2"
              >
                <span>{isAuthenticated ? 'Go to Feed' : 'Get Started'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
