'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

type RevealVariant = 'up' | 'left' | 'right' | 'scale';

interface RevealProps {
  children: ReactNode;
  delayMs?: number;
  className?: string;
  variant?: RevealVariant;
}

const HIDDEN_TRANSFORMS: Record<RevealVariant, string> = {
  up: 'opacity-0 translate-y-10 blur-[3px] scale-[0.98]',
  left: 'opacity-0 -translate-x-10 blur-[3px]',
  right: 'opacity-0 translate-x-10 blur-[3px]',
  scale: 'opacity-0 scale-[0.94] translate-y-6 blur-[3px]'
};

export function Reveal({ children, delayMs = 0, className = '', variant = 'up' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delayMs}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className={`transition-all duration-700 will-change-transform ${
        visible ? 'opacity-100 translate-y-0 translate-x-0 scale-100 blur-0' : HIDDEN_TRANSFORMS[variant]
      } ${className}`}
    >
      {children}
    </div>
  );
}
