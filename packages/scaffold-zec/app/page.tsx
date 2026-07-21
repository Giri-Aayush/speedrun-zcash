'use client';

import Link from 'next/link';
import { useWebZjs } from '../lib/WebZjsProvider';
import { CreateWallet } from '../components/CreateWallet';
import { ShieldedBalance } from '../components/ShieldedBalance';
import { AddressDisplay } from '../components/AddressDisplay';
import { SendZec } from '../components/SendZec';
import { SyncStatus } from '../components/SyncStatus';

function Dashboard() {
  const { status, error } = useWebZjs();

  if (status === 'idle' || status === 'initializing') {
    return (
      <div className="card center">
        <p>⏳ Initializing WASM light client…</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="card">
        <h2>Startup failed</h2>
        <p className="error">{error}</p>
        <p className="hint">
          Most common cause: no lightwalletd gRPC-web proxy running. Start one
          with <code>./infra/run-testnet-proxy.sh</code> from the repo root.
        </p>
      </div>
    );
  }

  if (status === 'no-account') return <CreateWallet />;

  return (
    <>
      <SyncStatus />
      <div className="grid">
        <ShieldedBalance />
        <AddressDisplay />
      </div>
      <SendZec />
    </>
  );
}

export default function Home() {
  return (
    <main>
      <header>
        <h1>
          🛡️ Scaffold-ZEC <span className="badge">testnet</span>
        </h1>
        <p className="tagline">
          The Speedrun Zcash starter — an in-browser shielded wallet, running
          entirely client-side via WASM. New here? Start with{' '}
          <Link href="/challenges">the challenges</Link>.
        </p>
      </header>
      <Dashboard />
    </main>
  );
}
