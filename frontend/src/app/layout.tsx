import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'FineTube — Education Video Platform',
  description: 'Distraction-free educational video learning platform across all subjects with adaptive study tools and structured learning paths.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
