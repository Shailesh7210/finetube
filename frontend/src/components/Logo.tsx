import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  withText?: boolean;
}

export function Logo({ className = '', size = 28, withText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          <defs>
            <linearGradient id="logoGradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>

          <rect
            x="2"
            y="2"
            width="32"
            height="32"
            rx="10"
            fill="url(#logoGradPrimary)"
          />

          <path
            d="M15 12.8C15 12.02 15.85 11.54 16.51 11.95L24.2 16.75C24.84 17.15 24.84 18.09 24.2 18.49L16.51 23.29C15.85 23.7 15 23.22 15 22.44V12.8Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>

      {withText && (
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-bold text-lg tracking-tight text-slate-900 font-sans">
            Fine<span className="text-indigo-600">Tube</span>
          </span>
        </div>
      )}
    </div>
  );
}
