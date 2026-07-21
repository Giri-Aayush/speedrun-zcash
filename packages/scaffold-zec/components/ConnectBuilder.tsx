'use client';

import { Card, Chip } from '@heroui/react';
import { useBuilder } from '../lib/BuilderProvider';

export function ConnectBuilder() {
  const { builderId, connect, connecting, error, canConnect } = useBuilder();

  if (builderId) {
    return (
      <div className="flex items-center gap-2 text-sm opacity-80">
        <Chip size="sm" color="success">
          Connected
        </Chip>
        <span>
          Builder <code>{builderId.slice(0, 8)}…</code> — progress saves across
          devices when you restore this seed.
        </span>
      </div>
    );
  }

  return (
    <Card className="border-yellow-600/40">
      <Card.Header>
        <Card.Title>Connect to track your progress</Card.Title>
        <Card.Description>
          Your builder identity is derived from your wallet seed. Restore the
          same seed anywhere and your completed challenges follow you.
        </Card.Description>
      </Card.Header>
      <Card.Content className="flex flex-col gap-3">
        <p className="hint m-0">
          Only a derived pseudonym and a public key are sent — never your seed,
          and nothing that links to your addresses or balances.
        </p>
        <div>
          <button onClick={connect} disabled={!canConnect || connecting}>
            {connecting ? 'Connecting…' : '🔗 Connect wallet'}
          </button>
        </div>
        {!canConnect && (
          <p className="hint m-0">Create a wallet below first.</p>
        )}
        {error && <p className="error m-0 text-sm">{error}</p>}
      </Card.Content>
    </Card>
  );
}
