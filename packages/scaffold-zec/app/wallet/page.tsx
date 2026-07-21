'use client';

import Link from 'next/link';
import { useWebZjs } from '../../lib/WebZjsProvider';
import { WalletBoot } from '../../components/WalletBoot';
import { CreateWallet } from '../../components/CreateWallet';
import { ShieldedBalance } from '../../components/ShieldedBalance';
import { AddressDisplay } from '../../components/AddressDisplay';
import { SendZec } from '../../components/SendZec';
import { SyncStatus } from '../../components/SyncStatus';

function Dashboard() {
  const { status, error } = useWebZjs();

  if (status === 'idle' || status === 'initializing') {
    return (
      <div className="card flex items-center gap-3">
        <span className="dot dot-busy" />
        <span className="muted text-sm">
          Starting the light client — the proving parameters are a large
          download the first time.
        </span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="card flex flex-col gap-3">
        <p className="card-title m-0">Wallet failed to start</p>
        <p className="error m-0">{error}</p>
        <p className="hint m-0">
          Most likely no lightwalletd proxy is running. Start one with{' '}
          <code>./infra/run-testnet-proxy.sh</code> from the repo root.
        </p>
      </div>
    );
  }

  if (status === 'no-account') return <CreateWallet />;

  return (
    <>
      <SyncStatus />
      <div className="grid gap-4 sm:grid-cols-2">
        <ShieldedBalance />
        <AddressDisplay />
      </div>
      <SendZec />
    </>
  );
}

export default function WalletPage() {
  return (
    <main className="wrap section flex flex-col gap-6">
      <WalletBoot />
      <div className="flex flex-col gap-3">
        <span className="eyebrow">Scaffold-ZEC · testnet</span>
        <h1 className="display text-[40px]">Wallet</h1>
        <p className="lede">
          A shielded wallet running entirely in this tab. Keys never leave your
          machine. New here? Start with{' '}
          <Link href="/challenges" style={{ color: 'var(--gold)' }}>
            the challenges
          </Link>
          .
        </p>
      </div>
      <Dashboard />
    </main>
  );
}
