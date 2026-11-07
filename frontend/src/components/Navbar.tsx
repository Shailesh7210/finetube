'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href={isAuthenticated ? '/feed' : '/'} className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-white">FineTube</span>
            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
              Edu
            </span>
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
                    "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                    isActive
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Search & Auth Actions */}
        <div className="flex items-center gap-3">
          <form action="/search" method="GET" className="relative w-36 sm:w-56">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="q"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-zinc-900 text-xs border border-zinc-800 rounded-md pl-8 pr-3 py-1.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
            />
          </form>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-200 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
                title="Customize Profile"
              >
                <span>{user.displayName.split(' ')[0]}</span>
              </Link>
              <button
                onClick={logout}
                className="px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-100 hover:bg-white text-zinc-950 transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
