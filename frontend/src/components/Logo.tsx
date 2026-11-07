import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  withText?: boolean;
}

export function Logo({ className = '', size = 28, withText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Emblem */}
      <div 
        className="relative flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(99,102,241,0.35)]"
        >
          <defs>
            <linearGradient id="logoGradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="50%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <linearGradient id="logoGradPrism" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E0E7FF" />
            </linearGradient>
            <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Lens Frame (Focus Octagon/Hexagon) */}
          <rect
            x="2"
            y="2"
            width="32"
            height="32"
            rx="10"
            fill="#09090B"
            stroke="url(#logoGradPrimary)"
            strokeWidth="2"
          />

          {/* Precision Focus Lines */}
          <path
            d="M8 18H11M25 18H28M18 8V11M18 25V28"
            stroke="#4F46E5"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Inner Play / Focus Prism */}
          <path
            d="M15 12.8C15 12.02 15.85 11.54 16.51 11.95L24.2 16.75C24.84 17.15 24.84 18.09 24.2 18.49L16.51 23.29C15.85 23.7 15 23.22 15 22.44V12.8Z"
            fill="url(#logoGradPrimary)"
            filter="url(#subtleGlow)"
          />
          <path
            d="M16 14.5L22 17.62L16 20.74V14.5Z"
            fill="url(#logoGradPrism)"
            opacity="0.95"
          />
        </svg>
      </div>

      {/* Wordmark */}
      {withText && (
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-bold text-base tracking-tight text-white font-sans">
            Fine<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">Tube</span>
          </span>
          <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            EDU
          </span>
        </div>
      )}
    </div>
  );
}
