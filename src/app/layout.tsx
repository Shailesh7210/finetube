import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/Navbar';

export const metadata: Metadata = {
  title: 'FineTube - Education-Only Video Platform',
  description: 'Topic-aware discovery, evidence-informed ranking, editable learning playlists, and an in-context learning workspace.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-brand-500 selection:text-white">
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <footer className="border-t border-slate-900 bg-slate-950/60 py-6 px-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400">FineTube</span>
              <span>•</span>
              <span>AI organizes & assists; users retain control.</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <span>Bayesian Quality Ranking</span>
              <span>Evidence-First AI Notes</span>
              <span>In-Context Workspace</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
