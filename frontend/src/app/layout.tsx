import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { AuthProvider } from '@/lib/auth-context';
import { PageTransition } from '@/components/PageTransition';

export const metadata: Metadata = {
  title: 'FineTube — Education Video Platform',
  description: 'Distraction-free educational video learning platform across all subjects.',
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
            <PageTransition>{children}</PageTransition>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
