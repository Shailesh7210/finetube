'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  Compass, 
  FolderHeart, 
  Search, 
  SlidersHorizontal, 
  Sparkles,
  Video,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';

interface NavbarProps {
  followedCount?: number;
}

export function Navbar({ followedCount = 3 }: NavbarProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { href: '/', label: 'Focused Feed', icon: Sparkles },
    { href: '/topics', label: 'Topics & Taxonomy', icon: Compass },
    { href: '/playlists', label: 'Learning Paths', icon: BookOpen },
    { href: '/library', label: 'Study Library', icon: FolderHeart },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Video className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white">FineTube</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  Edu Only
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">Purpose-Driven Learning</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-slate-800/80 text-brand-400 border border-slate-700/60"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Search Bar & Actions */}
        <div className="flex items-center gap-3">
          <form 
            action="/search" 
            method="GET"
            className="relative hidden lg:block w-72"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="q"
              placeholder="Search concepts, topics, videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 text-sm border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />
          </form>

          {/* Interests Setting Pill */}
          <Link
            href="/settings/interests"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white transition-all shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-brand-400" />
            <span className="hidden sm:inline">Feed Filters</span>
            <span className="flex items-center justify-center bg-brand-500/20 text-brand-400 px-1.5 py-0.2 rounded font-mono text-[10px]">
              {followedCount} active
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
