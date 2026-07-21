'use client';

import Link from 'next/link';
import { Card } from '@heroui/react';
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
      <Card>
        <Card.Content className="flex items-center gap-3">
          <span className="dot dot-busy" />
          <span className="muted text-sm">
            Starting the light client — the proving parameters are a large
            download the first time.
          </span>
        </Card.Content>
      </Card>
    );
  }

  if (status === 'error') {
    return (
      <Card>
        <Card.Header>
          <Card.Title className="panel-title">Wallet failed to start</Card.Title>
        </Card.Header>
        <Card.Content className="flex flex-col gap-3">
          <p className="error m-0">{error}</p>
          <p className="hint m-0">
            Most likely no lightwalletd proxy is running. Start one with{' '}
            <code>./infra/run-testnet-proxy.sh</code> from the repo root.
          </p>
        </Card.Content>
      </Card>
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
          <Link href="/challenges" style={{ color: 'var(--accent)' }}>
            the challenges
          </Link>
          .
        </p>
      </div>
      <Dashboard />
    </main>
  );
}
