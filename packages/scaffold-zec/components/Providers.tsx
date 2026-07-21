'use client';

import { WebZjsProvider } from '../lib/WebZjsProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return <WebZjsProvider>{children}</WebZjsProvider>;
}
