'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, BookOpen, CheckCircle2, Code2, Compass, Play, Search, ShieldCheck, SlidersHorizontal, Sparkles, Star, XCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { store } from '@/lib/store';
import { formatDuration } from '@/lib/utils';
import { Reveal } from '@/components/Reveal';
import { Logo } from '@/components/Logo';
import { HeroTopicAnimation } from '@/components/HeroTopicAnimation';
import { ScrollBackgroundCanvas } from '@/components/ScrollBackgroundCanvas';

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

interface StreamShowcase {
  id: string;
  label: string;
  headline: string;
  description: string;
  topics: string[];
  workspaceTool: string;
  searchQuery: string;
  accent: string;
}

const STREAM_SHOWCASES: StreamShowcase[] = [
  {
    id: 'science',
    label: 'Science & Math',
    headline: 'Physics, Chemistry & Calculus without algorithmic noise',
    description: 'Follow Class 11–12 or university STEM tracks with equations, derivations, and worked numericals.',
    topics: ['Electrostatics', 'Thermodynamics', 'Organic Mechanisms', 'Multivariable Calculus'],
    workspaceTool: 'Formula Scratchpad & Timestamp Notes',
    searchQuery: 'Class 12 Physics Electrostatics',
    accent: 'indigo'
  },
  {
    id: 'medical',
    label: 'Medical & Bio',
    headline: 'Clinical anatomy, physiology & pathology lectures only',
    description: 'Focus strictly on medical sciences with structured conceptual diagrams and active-recall quizzes.',
    topics: ['Cardiovascular Physiology', 'Human Anatomy', 'Cell Biology', 'Neurobiology'],
    workspaceTool: 'Concept Organizer & Grounded Quiz',
    searchQuery: 'Human cardiovascular system',
    accent: 'emerald'
  },
  {
    id: 'cs',
    label: 'Computer Science',
    headline: 'Data structures, system design & AI engineering in one place',
    description: 'Search linked lists, RAG architectures, or React internals and test ideas live inside the browser.',
    topics: ['Linked Lists & Trees', 'System Design', 'RAG & AI Engineering', 'React Hooks'],
    workspaceTool: '10-Language Code Sandbox & AI Assistant',
    searchQuery: 'Data structures linked list',
    accent: 'sky'
  },
  {
    id: 'commerce',
    label: 'Commerce & Finance',
    headline: 'Macroeconomics, markets & financial accounting',
    description: 'Filter out clickbait finance hype and study verified macroeconomic models and policy breakdowns.',
    topics: ['Macroeconomics & GDP', 'Monetary Policy', 'Corporate Finance', 'Microeconomics'],
    workspaceTool: 'Structured AI Notes & Study Playlists',
    searchQuery: 'Macroeconomics GDP inflation',
    accent: 'amber'
  },
  {
    id: 'humanities',
    label: 'Law & Humanities',
    headline: 'Constitutional law, history & cognitive sciences',
    description: 'Build chronological clarity across historical revolutions, public policy, and cognitive theory.',
    topics: ['French Revolution', 'Constitutional Law', 'Cognitive Psychology', 'World Geography'],
    workspaceTool: 'Concept Timeline & Grounded Citations',
    searchQuery: 'Constitutional Law lecture',
    accent: 'violet'
  }
];

function SectionWaveBridge({ tint = 'indigo' }: { tint?: 'indigo' | 'emerald' | 'sky' }) {
  const strokeColor =
    tint === 'emerald' ? '#10b981' : tint === 'sky' ? '#0ea5e9' : '#6366f1';

  return (
    <div aria-hidden="true" className="relative w-full h-14 overflow-hidden pointer-events-none select-none my-2">
      <svg
        className="w-[200%] h-full animate-marquee opacity-35"
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0,30 Q150,4 300,30 T600,30 T900,30 T1200,30"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
        <path
          d="M0,36 Q150,58 300,36 T600,36 T900,36 T1200,36"
          stroke={strokeColor}
          strokeOpacity="0.45"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [heroSearch, setHeroSearch] = useState('');
  const [subjectWordIdx, setSubjectWordIdx] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);
  const [discoveryIdx, setDiscoveryIdx] = useState(0);
  const [activeStreamIdx, setActiveStreamIdx] = useState(0);

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
  const activeStream = STREAM_SHOWCASES[activeStreamIdx];

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

  const marqueeTopics = useMemo(() => topics, [topics]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroSearch.trim()) return;
    router.push(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
  };

  return (
    <div className="relative z-0 w-full overflow-x-clip">
      {/* Scroll-Reactive Pastel Background, Constellation Canvas & Section Rail */}
      <ScrollBackgroundCanvas />

      <div className="relative z-10">

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

      {/* CLEAN EDGE-FADED EDITORIAL SUBJECTS MARQUEE */}
      <section className="py-5 border-y border-slate-200/80 bg-white/70 backdrop-blur-xs">
        <div
          className="max-w-7xl mx-auto marquee-container overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
          }}
        >
          <div className="animate-marquee items-center">
            {[...marqueeTopics, ...marqueeTopics].map((t, i) => (
              <div key={`${t.id}-m-${i}`} className="flex items-center shrink-0">
                <Link
                  href={`/topics/${t.slug}`}
                  className="px-4 py-1 text-sm font-medium text-slate-600 hover:text-indigo-600 whitespace-nowrap transition-colors"
                >
                  {t.name}
                </Link>
                <span className="w-1 h-1 rounded-full bg-slate-300 mx-1" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM METRICS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <Reveal variant="scale">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-2xl bg-white/95 backdrop-blur-xs border border-slate-200 shadow-xs text-center hover:-translate-y-0.5 transition-transform">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">{subjects.length}+</div>
              <div className="text-sm font-medium text-slate-500 mt-1">Academic Disciplines</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/95 backdrop-blur-xs border border-slate-200 shadow-xs text-center hover:-translate-y-0.5 transition-transform">
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600">{topics.length}+</div>
              <div className="text-sm font-medium text-slate-500 mt-1">Curated Topics</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/95 backdrop-blur-xs border border-slate-200 shadow-xs text-center hover:-translate-y-0.5 transition-transform">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">10</div>
              <div className="text-sm font-medium text-slate-500 mt-1">Sandbox Languages</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/95 backdrop-blur-xs border border-slate-200 shadow-xs text-center hover:-translate-y-0.5 transition-transform">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600">0%</div>
              <div className="text-sm font-medium text-slate-500 mt-1">Sidebar Distractions</div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* HOW IT WORKS — SOFT SECTION BAND TRANSITION */}
      <SectionWaveBridge tint="indigo" />
      <section className="relative py-16 bg-gradient-to-b from-transparent via-indigo-50/45 to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto space-y-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-indigo-200 text-xs font-semibold text-indigo-700 shadow-2xs">
                <Compass className="w-3.5 h-3.5" />
                <span>How FineTube Works</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                YouTube&apos;s entire lecture library,{' '}
                <span className="font-editorial italic font-normal text-indigo-600">scoped</span> to your goal
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Keep access to thousands of lectures while removing Shorts, clickbait, and off-topic rabbit holes.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Reveal delayMs={40} variant="left">
              <div className="h-full p-7 rounded-3xl bg-white/95 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
                    <SlidersHorizontal className="w-5 h-5" />
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">STEP 01</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Lock Your Stream</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Select Science, Medical, Computer Science, Commerce, Humanities, or Law in your profile to fence your personal feed.
                </p>
              </div>
            </Reveal>

            <Reveal delayMs={110} variant="up">
              <div className="h-full p-7 rounded-3xl bg-white/95 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">STEP 02</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">AI-Filtered YouTube Live</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Queries YouTube Data API v3 on demand, strips Shorts (&lt;90s) and entertainment noise, and verifies subject alignment.
                </p>
              </div>
            </Reveal>

            <Reveal delayMs={180} variant="right">
              <div className="h-full p-7 rounded-3xl bg-white/95 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center">
                    <Code2 className="w-5 h-5" />
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">STEP 03</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Interactive Study Room</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Watch with zero-recommendation <code className="text-xs font-mono bg-slate-100 px-1 py-0.5 rounded">rel=0</code> embeds alongside notes, grounded AI Q&amp;A, quizzes, and a 10-language sandbox.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* INTERACTIVE STREAM EXPLORER */}
      <SectionWaveBridge tint="sky" />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-8">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                Built for Every Discipline
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Explore Workspaces by Stream
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {STREAM_SHOWCASES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setActiveStreamIdx(idx)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeStreamIdx === idx
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal variant="scale">
          <div
            key={activeStream.id}
            className="p-7 sm:p-9 rounded-3xl bg-white/95 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in-up"
          >
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-700">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{activeStream.label} Stream</span>
              </span>
              <h3 className="text-2xl font-bold text-slate-900 leading-snug">
                {activeStream.headline}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {activeStream.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {activeStream.topics.map(t => (
                  <Link
                    key={t}
                    href={`/search?q=${encodeURIComponent(t)}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-xs font-medium text-slate-700 hover:text-indigo-700 transition-colors"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/50 border border-slate-200 space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Paired Study Environment
              </div>
              <div className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>{activeStream.workspaceTool}</span>
              </div>
              <p className="text-xs text-slate-600">
                Every lecture opens inside an adaptive study room with chapter citations, Bayesian quality ratings, and timestamp notes.
              </p>
              <Link
                href={`/search?q=${encodeURIComponent(activeStream.searchQuery)}`}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
              >
                <span>Search {activeStream.label} Lectures</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* COMPARISON & BENTO FEATURES — SOFT TEAL/EMERALD SECTION TRANSITION */}
      <SectionWaveBridge tint="emerald" />
      <section className="relative py-14 bg-gradient-to-b from-transparent via-emerald-50/30 to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Reveal delayMs={30} variant="left" className="lg:col-span-6">
              <div className="h-full p-7 rounded-3xl bg-white/95 border border-slate-200 shadow-xs space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Standard YouTube
                </div>
                <h3 className="text-xl font-bold text-slate-900">Designed to maximize watch time</h3>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>Home feed mixes physics or coding with vlogs, gaming &amp; Shorts</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>Autoplay sidebar pulls learners out of study sessions</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>No built-in code runner, timestamped notebook, or concept quiz</span>
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal delayMs={90} variant="right" className="lg:col-span-6">
              <div className="h-full p-7 rounded-3xl bg-white/95 border border-emerald-200 shadow-xs space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  FineTube Focus Mode
                </div>
                <h3 className="text-xl font-bold text-slate-900">Built for deliberate conceptual mastery</h3>
                <ul className="space-y-2.5 text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Stream-locked feed shows strictly your selected subjects &amp; topics</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Clean <code className="text-xs font-mono bg-slate-100 px-1 rounded">rel=0</code> embed with Bayesian quality scores &amp; chapter jump links</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>On-demand YouTube search across any topic (e.g., Linked Lists or RAG Systems)</span>
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>

          {/* Existing Bento Discovery & Paths Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Reveal delayMs={40} className="lg:col-span-6">
              <div className="h-full p-7 rounded-3xl bg-white/95 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5">
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
              <div className="h-full p-7 rounded-3xl bg-white/95 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5">
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
        </div>
      </section>

      {/* FEATURED LECTURES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-6">
        <Reveal>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Featured Lectures
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                High-clarity lessons scored on concept coverage and accuracy.
              </p>
            </div>
            <Link href="/feed" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 shrink-0">
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
                  className="group block rounded-2xl bg-white/95 border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all"
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
        <Reveal variant="scale">
          <div className="p-10 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-50/90 via-white to-sky-50/90 border border-indigo-200 text-center space-y-5 shadow-md">
            <div className="flex justify-center">
              <Logo size={40} withText={false} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Ready to{' '}
              <span className="font-editorial italic font-normal text-indigo-600">focus</span>?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
              Pick your academic stream once and turn YouTube into a structured, distraction-free study platform.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-1">
              <Link
                href={isAuthenticated ? '/feed' : '/signup'}
                className="px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-sm transition-all inline-flex items-center gap-2"
              >
                <span>{isAuthenticated ? 'Go to Feed' : 'Get Started Free'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/search"
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-base transition-all inline-flex items-center gap-2"
              >
                <span>Browse YouTube Search</span>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
      </div>
    </div>
  );
}
