import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { display, sans, mono } from './fonts';
import { Providers } from '../components/Providers';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: 'Speedrun Zcash',
  description:
    'Learn to build privacy apps on Zcash through numbered challenges, with a real shielded wallet running in your browser.',
};

const REPO = 'https://github.com/Giri-Aayush/speedrun-zcash';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${display.variable} ${sans.variable} ${mono.variable}`}
      data-theme="dark"
    >
      <body>
        <Providers>
          <nav className="wrap flex items-center gap-6 py-[22px]">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[15px] font-bold"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}
            >
              🏃 Speedrun
              <span style={{ color: 'var(--gold)', marginLeft: '-3px' }}>
                Zcash
              </span>
            </Link>
            <div className="ml-auto flex items-center gap-5 text-[13.5px] font-medium sm:gap-[26px]">
              <Link href="/challenges" className="muted hover:text-[var(--gold)]">
                Challenges
              </Link>
              <Link href="/wallet" className="muted hover:text-[var(--gold)]">
                Wallet
              </Link>
              <a
                href={REPO}
                target="_blank"
                rel="noreferrer"
                className="muted hidden hover:text-[var(--gold)] sm:inline"
              >
                GitHub ↗
              </a>
            </div>
          </nav>
          <div className="rule" />

          {children}

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
