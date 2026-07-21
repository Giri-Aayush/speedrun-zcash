import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Scaffold-ZEC · Speedrun Zcash',
  description:
    'Batteries-included Zcash dev starter — in-browser testnet light wallet powered by WebZjs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
