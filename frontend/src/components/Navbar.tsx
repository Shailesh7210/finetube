'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Logo } from '@/components/Logo';
import { IngestVideoModal } from '@/components/IngestVideoModal';

export function Navbar() {
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [isIngestOpen, setIsIngestOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const publicLinks = [
    { href: '/', label: 'About' },
    { href: '/topics', label: 'Topics' },
    { href: '/playlists', label: 'Playlists' },
  ];

  const authLinks = [
    { href: '/feed', label: 'Feed' },
    { href: '/topics', label: 'Topics' },
    { href: '/playlists', label: 'Playlists' },
    { href: '/library', label: 'Library' },
  ];

  const currentLinks = isAuthenticated ? authLinks : publicLinks;

  return (
    <div className="sticky top-3 z-50 w-full px-4 sm:px-6 pointer-events-none">
      <header className="max-w-7xl mx-auto h-16 rounded-2xl border border-slate-200/90 bg-white/90 backdrop-blur-xl shadow-sm px-5 sm:px-6 flex items-center justify-between gap-4 pointer-events-auto transition-all">
        <div className="flex items-center gap-8">
          <Link href={isAuthenticated ? '/feed' : '/'} className="transition-transform hover:scale-[1.02]">
            <Logo size={32} />
          </Link>

          <nav className="hidden md:flex items-center gap-1.5">
            {currentLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-slate-900 text-white font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <form action="/search" method="GET" className="relative w-44 sm:w-64 hidden sm:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="q"
              placeholder="Search any subject..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-100 text-sm border border-slate-200 rounded-xl pl-10 pr-3.5 py-2 text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
            />
          </form>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-2.5 pl-2 pr-3.5 py-1.5 rounded-xl text-sm font-medium bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-800 hover:text-slate-950 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                  {user.displayName.charAt(0)}
                </div>
                <span className="hidden sm:inline font-semibold">{user.displayName.split(' ')[0]}</span>
              </Link>

              <button
                onClick={logout}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="px-3.5 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition-all"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </header>

      <IngestVideoModal
        isOpen={isIngestOpen}
        onClose={() => setIsIngestOpen(false)}
      />
    </div>
  );
}
