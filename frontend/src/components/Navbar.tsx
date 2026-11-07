'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Logo } from '@/components/Logo';

export function Navbar() {
  const pathname = usePathname();
  const [query, setQuery] = useState('');
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
      <header className="max-w-6xl mx-auto h-14 rounded-2xl border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl shadow-2xl shadow-black/60 px-4 sm:px-5 flex items-center justify-between gap-4 pointer-events-auto transition-all">
        {/* Brand with New Logo */}
        <div className="flex items-center gap-7">
          <Link href={isAuthenticated ? '/feed' : '/'} className="transition-transform hover:scale-[1.02]">
            <Logo size={28} />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {currentLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    isActive
                      ? "bg-zinc-800 text-white font-semibold shadow-inner"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Search Bar & Auth Actions */}
        <div className="flex items-center gap-3">
          <form action="/search" method="GET" className="relative w-36 sm:w-56 hidden sm:block">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="q"
              placeholder="Search concepts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-zinc-900/90 text-xs border border-zinc-800/90 rounded-lg pl-8 pr-3 py-1.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            />
          </form>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-lg text-xs font-medium bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white transition-all shadow-sm"
                title="Customize Profile"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                  {user.displayName.charAt(0)}
                </div>
                <span className="hidden sm:inline font-semibold">{user.displayName.split(' ')[0]}</span>
              </Link>

              <button
                onClick={logout}
                className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 rounded-lg transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-100 shadow-sm transition-all"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}
