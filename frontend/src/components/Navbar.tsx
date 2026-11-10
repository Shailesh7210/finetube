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
      <header className="max-w-7xl mx-auto h-16 rounded-2xl border border-zinc-800/80 bg-zinc-950/85 backdrop-blur-xl shadow-2xl shadow-black/60 px-5 sm:px-6 flex items-center justify-between gap-4 pointer-events-auto transition-all">
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
                    "px-3.5 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-zinc-800 text-white font-semibold"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
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
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="q"
              placeholder="Search any subject..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-zinc-900/90 text-sm border border-zinc-800/90 rounded-xl pl-10 pr-3.5 py-2 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-all"
            />
          </form>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-2.5 pl-2 pr-3.5 py-1.5 rounded-xl text-sm font-medium bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-xs font-bold text-white uppercase">
                  {user.displayName.charAt(0)}
                </div>
                <span className="hidden sm:inline font-semibold">{user.displayName.split(' ')[0]}</span>
              </Link>

              <button
                onClick={logout}
                className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 rounded-lg transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="px-3.5 py-2 text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-white text-zinc-950 hover:bg-zinc-200 shadow-sm transition-all"
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
