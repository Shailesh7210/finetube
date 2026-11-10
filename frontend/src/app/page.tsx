'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Play, Search, Star, Check, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { store } from '@/lib/store';
import { formatDuration } from '@/lib/utils';
import { Reveal } from '@/components/Reveal';
import { Logo } from '@/components/Logo';

interface PersonaDemo {
  id: string;
  label: string;
  level: string;
  subjects: string[];
  query: string;
  videoTitle: string;
  channel: string;
  duration: string;
  rating: string;
  toolTitle: string;
  toolBadge: string;
  toolLines: { label: string; value: string }[];
  feedMuted: string[];
}

const PERSONA_DEMOS: PersonaDemo[] = [
  {
    id: 'class12',
    label: 'Class 12 Science',
    level: 'Class 12 · Science Stream',
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    query: 'Class 12 Physics Electrostatics',
    videoTitle: "Electrostatics & Gauss's Law Full Derivation",
    channel: 'Physics Galaxy · Class 12',
    duration: '32:10',
    rating: '4.92',
    toolTitle: 'Formula Scratchpad',
    toolBadge: 'STEM Workspace',
    toolLines: [
      { label: "Gauss's Law", value: '∮ E⃗ · dA⃗ = Q_enc / ε₀' },
      { label: "Coulomb's Force", value: 'F = k · |q₁q₂| / r²' },
      { label: 'Step Result', value: 'E = λ / (2πε₀r)' }
    ],
    feedMuted: ['Gaming Streams', 'Viral Shorts', 'Random Tech News']
  },
  {
    id: 'medical',
    label: 'Medical Student',
    level: 'Medical Studies · Clinical',
    subjects: ['Anatomy', 'Physiology', 'Biochemistry'],
    query: 'Human cardiovascular system',
    videoTitle: 'Cardiac Cycle, Wiggers Diagram & Hemodynamics',
    channel: 'Osmosis & Ninja Nerd',
    duration: '35:40',
    rating: '4.95',
    toolTitle: 'Terminology & Recall Cards',
    toolBadge: 'Medical Workspace',
    toolLines: [
      { label: 'Cardiac Output', value: 'CO = HR × Stroke Volume (~5 L/min)' },
      { label: 'Frank-Starling Law', value: 'Preload ↑ → Myocardial stretch ↑ → SV ↑' },
      { label: 'Pacemaker', value: 'SA Node (60–100 bpm sinus rhythm)' }
    ],
    feedMuted: ['Celebrity Vlogs', 'Stock Trading', 'Coding Tutorials']
  },
  {
    id: 'humanities',
    label: 'History & Economics',
    level: 'Undergraduate · Humanities',
    subjects: ['World History', 'Economics', 'Law'],
    query: 'French Revolution 1789',
    videoTitle: 'From Estates-General to the Declaration of Rights',
    channel: 'Yale & CrashCourse History',
    duration: '24:15',
    rating: '4.87',
    toolTitle: 'Concept & Timeline Organizer',
    toolBadge: 'Humanities Workspace',
    toolLines: [
      { label: 'May 1789', value: 'Estates-General deadlock & Tennis Court Oath' },
      { label: 'July 14, 1789', value: 'Storming of the Bastille' },
      { label: 'Aug 1789', value: 'Declaration of the Rights of Man' }
    ],
    feedMuted: ['Reaction Videos', 'Gaming Clips', 'Clickbait Drama']
  },
  {
    id: 'developer',
    label: 'Software Developer',
    level: 'Professional · Engineering',
    subjects: ['React', 'Algorithms', 'System Design'],
    query: 'React useEffect lifecycle',
    videoTitle: 'Synchronizing Effects & Preventing Stale Closures',
    channel: 'Web Dev Simplified',
    duration: '14:05',
    rating: '4.89',
    toolTitle: 'Interactive Code Sandbox',
    toolBadge: 'Code Workspace',
    toolLines: [
      { label: 'useEffect', value: 'useEffect(() => { sub(); return unsub; }, [id])' },
      { label: 'Invariant', value: 'Cleanup runs before re-execution & unmount' },
      { label: 'Output', value: '✓ Zero leaked listeners' }
    ],
    feedMuted: ['Lifestyle Vlogs', 'Entertainment', 'Unrelated Podcasts']
  }
];

const DISCOVERY_QUERIES = [
  { q: 'Class 12 Physics Electrostatics', subject: 'Physics', count: '12 Embeddable Lectures' },
  { q: 'Human cardiovascular system', subject: 'Medicine', count: '10 Clinical Lectures' },
  { q: 'Organic Chemistry Reaction Mechanisms', subject: 'Chemistry', count: '14 Mechanism Guides' },
  { q: 'French Revolution', subject: 'History', count: '9 Historical Lectures' },
  { q: 'React useEffect', subject: 'Computer Science', count: '11 Engineering Guides' }
];

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [heroSearch, setHeroSearch] = useState('');
  const [activePersonaIdx, setActivePersonaIdx] = useState(0);
  const [isAutoCycling, setIsAutoCycling] = useState(true);
  const [discoveryIdx, setDiscoveryIdx] = useState(0);

  const subjects = store.getSubjects();
  const topics = store.getTopics();
  const videos = store.getVideos();
  const playlists = store.getPlaylists();

  // Auto-cycle personas smoothly until user interacts
  useEffect(() => {
    if (!isAutoCycling) return;
    const timer = setInterval(() => {
      setActivePersonaIdx(prev => (prev + 1) % PERSONA_DEMOS.length);
    }, 5200);
    return () => clearInterval(timer);
  }, [isAutoCycling]);

  // Cycle live discovery simulator
  useEffect(() => {
    const timer = setInterval(() => {
      setDiscoveryIdx(prev => (prev + 1) % DISCOVERY_QUERIES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const activePersona = PERSONA_DEMOS[activePersonaIdx];
  const activeDiscovery = DISCOVERY_QUERIES[discoveryIdx];

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
      {/* Subtle Light Dot Grid + Animated Pastel Orbs */}
      <div className="absolute inset-0 bg-dot-grid opacity-50 pointer-events-none -z-20" />
      <div className="absolute -top-24 left-1/4 w-[480px] h-[480px] rounded-full bg-indigo-200/45 blur-3xl animate-blob pointer-events-none -z-10" />
      <div className="absolute top-32 right-1/5 w-[420px] h-[420px] rounded-full bg-sky-200/45 blur-3xl animate-blob-delayed pointer-events-none -z-10" />

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-14">
        <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{subjects.length} Disciplines · Dynamic YouTube Discovery · Adaptive Workspaces</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.06]">
            Every Subject.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-sky-500 to-indigo-600 animate-gradient">
              Zero Distraction.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Built for <strong>school students, medical learners, researchers, and developers</strong>. Search YouTube inside an education-only workspace tailored to your exact subjects.
          </p>

          {/* Hero Instant Search Bar */}
          <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center bg-white rounded-2xl border border-slate-300 shadow-lg shadow-slate-200/60 p-1.5 focus-within:border-indigo-500 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={heroSearch}
                onChange={e => setHeroSearch(e.target.value)}
                placeholder="Search any topic (e.g. Class 12 Electrostatics, Cardiology, French Revolution)..."
                className="flex-1 bg-transparent px-3 py-2.5 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors shrink-0"
              >
                Discover
              </button>
            </div>
          </form>

          {/* Quick Search Chips + Primary CTA */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {[
              'Class 12 Physics Electrostatics',
              'Human cardiovascular system',
              'Organic Chemistry',
              'French Revolution',
              'React useEffect'
            ].map(chip => (
              <Link
                key={chip}
                href={`/search?q=${encodeURIComponent(chip)}`}
                className="px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white border border-slate-200 hover:border-indigo-300 text-xs font-medium text-slate-700 hover:text-indigo-600 transition-all shadow-2xs"
              >
                {chip}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <Link
              href={isAuthenticated ? '/feed' : '/signup'}
              className="px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-md shadow-indigo-500/20 transition-all hover:-translate-y-0.5 inline-flex items-center gap-2"
            >
              <span>{isAuthenticated ? 'Open Learning Feed' : 'Create Personalized Profile'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/topics"
              className="px-7 py-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-semibold text-base transition-all hover:-translate-y-0.5"
            >
              Browse {topics.length} Topics
            </Link>
          </div>
        </div>

        {/* INTERACTIVE LIVE WORKSPACE SHOWCASE */}
        <Reveal delayMs={150} className="mt-14 max-w-6xl mx-auto">
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/70 overflow-hidden">
            {/* Persona Switcher Bar */}
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Preview Learner Mode:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {PERSONA_DEMOS.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setIsAutoCycling(false);
                        setActivePersonaIdx(idx);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                        activePersonaIdx === idx
                          ? 'bg-slate-900 text-white font-semibold shadow-xs'
                          : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <span className="text-xs text-slate-500 font-mono hidden md:inline">
                {activePersona.level}
              </span>
            </div>

            {/* Interactive Preview Body */}
            <div
              key={activePersona.id}
              className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch animate-fade-in-up"
            >
              {/* Left: Personalized Feed Card */}
              <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 flex flex-col justify-between space-y-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {activePersona.subjects.map(sub => (
                      <span
                        key={sub}
                        className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    Strict Focus On
                  </span>
                </div>

                {/* Mock Lecture Player Row */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-16 rounded-lg bg-gradient-to-br from-indigo-600 to-sky-500 flex items-center justify-center shrink-0 text-white shadow-sm">
                      <Play className="w-6 h-6 fill-current" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono text-indigo-600 font-semibold">
                        YouTube Query: &ldquo;{activePersona.query}&rdquo;
                      </span>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {activePersona.videoTitle}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{activePersona.channel}</span>
                        <span>·</span>
                        <span>{activePersona.duration}</span>
                        <span>·</span>
                        <span className="inline-flex items-center gap-0.5 text-slate-800 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {activePersona.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/search?q=${encodeURIComponent(activePersona.query)}`}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shrink-0 text-center transition-colors"
                  >
                    Try Search →
                  </Link>
                </div>

                {/* Filtered Noise Strip */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="text-slate-500 font-medium">Suppressed distractions:</span>
                  {activePersona.feedMuted.map(noise => (
                    <span
                      key={noise}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200/80 line-through opacity-80"
                    >
                      <X className="w-3 h-3" />
                      {noise}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: Subject-Adaptive Workspace Tool */}
              <div className="lg:col-span-5 rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/70 via-white to-sky-50/70 p-5 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">{activePersona.toolTitle}</h3>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-semibold">
                    {activePersona.toolBadge}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1 flex flex-col justify-center">
                  {activePersona.toolLines.map((line, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-0.5"
                    >
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-indigo-600 block">
                        {line.label}
                      </span>
                      <span className="text-xs sm:text-sm font-mono text-slate-800 block break-words">
                        {line.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* DUAL-ROW INFINITE SUBJECTS MARQUEE */}
      <section className="py-10 border-y border-slate-200 bg-white/70 marquee-container overflow-hidden space-y-3">
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

      {/* PLATFORM METRICS BAR */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">{subjects.length}+</div>
              <div className="text-sm font-medium text-slate-600">Universal Disciplines</div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600">{topics.length}+</div>
              <div className="text-sm font-medium text-slate-600">Curriculum Topics</div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">3 Modes</div>
              <div className="text-sm font-medium text-slate-600">Formulas · Concepts · Code</div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600">0%</div>
              <div className="text-sm font-medium text-slate-600">Entertainment Distractions</div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* BENTO GRID ARCHITECTURE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 space-y-8">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Designed for Serious Learning
            </h2>
            <Link href="/topics" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              Explore Full Taxonomy →
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bento 1: Live YouTube Discovery */}
          <Reveal delayMs={50} className="lg:col-span-7">
            <div className="h-full p-7 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  01 · Dynamic YouTube API v3
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Instant Video Discovery for Any Topic
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Never wait for admins to upload links. Search any subject or chapter and FineTube fetches matching educational lectures with duration, chapters, and AI classification.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Live Query</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">
                    {activeDiscovery.subject}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono text-sm text-slate-900 flex items-center justify-between">
                  <span className="truncate">&ldquo;{activeDiscovery.q}&rdquo;</span>
                  <span className="text-xs text-emerald-600 font-sans font-semibold shrink-0 ml-2">
                    {activeDiscovery.count}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Bento 2: Multi-Dimensional Profile */}
          <Reveal delayMs={120} className="lg:col-span-5">
            <div className="h-full p-7 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  02 · Flexible Profiles
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  No Forced Degrees or Levels
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Combine formal classes with freeform curiosity. Education level and interests stay completely independent.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  'Class 12 · Physics, Chemistry & Calculus',
                  'Medical · Anatomy, Physiology & Pathology',
                  'General · History, Economics & Psychology'
                ].map(item => (
                  <div
                    key={item}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Bento 3: Curated Multi-Subject Learning Paths */}
          <Reveal delayMs={160} className="lg:col-span-12">
            <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    03 · Sequenced Curriculum Paths
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                    Ready-to-Study Playlists Across Every Discipline
                  </h3>
                </div>
                <Link href="/playlists" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                  All {playlists.length} Learning Paths →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {playlists.slice(0, 6).map(pl => (
                  <Link
                    key={pl.id}
                    href={`/playlists/${pl.id}`}
                    className="p-5 rounded-2xl bg-slate-50 hover:bg-indigo-50/40 border border-slate-200 hover:border-indigo-300 transition-all hover:-translate-y-0.5 space-y-2 block group"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{pl.items.length} lessons · ~{pl.estimatedTotalMinutes}m</span>
                      <span className="font-semibold text-slate-800">{pl.ratingAverage} ★</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {pl.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{pl.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURED LECTURES ACROSS DISCIPLINES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 space-y-6">
        <Reveal>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Featured Educational Lectures
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
              <Reveal key={v.id} delayMs={idx * 70}>
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

      {/* BOTTOM CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <Reveal>
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-sky-50 border border-indigo-200 text-slate-900 text-center space-y-5 shadow-lg shadow-indigo-100/60">
            <div className="flex justify-center">
              <Logo size={42} withText={false} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Start Your Focused Learning Space
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              Select your subjects, search any topic on YouTube, and organize everything in one distraction-free library.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link
                href={isAuthenticated ? '/feed' : '/signup'}
                className="px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-md shadow-indigo-500/20 transition-all inline-flex items-center gap-2"
              >
                <span>{isAuthenticated ? 'Go to Feed' : 'Get Started Free'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/search"
                className="px-7 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-base border border-slate-300 transition-all"
              >
                Search Videos
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
