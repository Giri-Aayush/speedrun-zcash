import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { Providers } from '../components/Providers';

export const metadata: Metadata = {
  title: 'Speedrun Zcash',
  description:
    'Learn to build on Zcash by shipping real privacy apps — powered by Scaffold-ZEC',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          <nav className="mx-auto flex max-w-3xl items-center gap-6 px-5 pt-6 text-sm">
            <Link href="/" className="font-bold text-base no-underline">
              🏃 Speedrun <span style={{ color: 'var(--accent)' }}>Zcash</span>
            </Link>
            <Link href="/challenges" className="no-underline text-inherit opacity-80 hover:opacity-100">
              Challenges
            </Link>
            <Link href="/" className="no-underline text-inherit opacity-80 hover:opacity-100">
              Wallet
            </Link>
          </nav>
          {children}
        </Providers>
      </body>
    </html>
  );
}
