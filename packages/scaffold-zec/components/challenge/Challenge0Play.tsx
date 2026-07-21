'use client';

import { useEffect, useState } from 'react';
import { Card, Chip } from '@heroui/react';
import type { Challenge } from '../../lib/challenges';
import { useWebZjs } from '../../lib/WebZjsProvider';
import { CreateWallet } from '../CreateWallet';
import { AddressDisplay } from '../AddressDisplay';
import { ShieldedBalance } from '../ShieldedBalance';
import { SendZec } from '../SendZec';
import { SyncStatus } from '../SyncStatus';

const LS_SENT_KEY = 'speedrun-c0-sent';

function StepBadge({ done, index }: { done: boolean; index: number }) {
  return (
    <span
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
        done ? 'bg-green-600 text-white' : 'bg-zinc-700 text-zinc-300'
      }`}
    >
      {done ? '✓' : index + 1}
    </span>
  );
}

export function Challenge0Play({ challenge }: { challenge: Challenge }) {
  const { status, balance } = useWebZjs();
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setSent(localStorage.getItem(LS_SENT_KEY) === '1');
  }, []);

  const funded =
    !!balance &&
    balance.sapling +
      balance.orchard +
      balance.transparent +
      balance.pendingSpendable >
      0;

  const done: Record<string, boolean> = {
    wallet: status === 'ready',
    fund: funded,
    send: sent,
  };
  const completed = challenge.steps.filter((s) => done[s.id]).length;

  return (
    <Card>
      <Card.Header>
        <Card.Title className="flex items-center gap-3">
          Your run
          <Chip
            size="sm"
            color={completed === challenge.steps.length ? 'success' : 'default'}
            className="ml-auto"
          >
            {completed}/{challenge.steps.length} steps
          </Chip>
        </Card.Title>
        <Card.Description>
          Steps complete themselves as your wallet state changes — no
          self-reporting.
        </Card.Description>
      </Card.Header>
      <Card.Content className="flex flex-col gap-5">
        <ol className="m-0 flex list-none flex-col gap-4 p-0">
          {challenge.steps.map((step, i) => (
            <li key={step.id} className="flex gap-3">
              <StepBadge done={done[step.id]} index={i} />
              <div>
                <p className="m-0 font-semibold">{step.title}</p>
                <p className="m-0 text-sm opacity-75">{step.detail}</p>
                {step.id === 'fund' && (
                  <p className="m-0 mt-1 text-sm">
                    Faucet:{' '}
                    <a
                      href="https://faucet.zecpages.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      faucet.zecpages.com
                    </a>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>

        {status === 'error' ? (
          <p className="error m-0 text-sm">
            Wallet failed to start — is the lightwalletd proxy running?
            (<code>./infra/run-testnet-proxy.sh</code>)
          </p>
        ) : status !== 'ready' ? (
          <CreateWallet />
        ) : (
          <>
            <SyncStatus />
            <div className="grid gap-4 sm:grid-cols-2">
              <ShieldedBalance />
              <AddressDisplay />
            </div>
            <SendZec
              onSent={() => {
                localStorage.setItem(LS_SENT_KEY, '1');
                setSent(true);
              }}
            />
          </>
        )}

        {completed === challenge.steps.length && (
          <p className="success m-0 text-sm">
            🎉 Challenge complete. Proof-of-completion via shielded memo (the
            real autograder) ships with Challenge #1 — for now, you know it
            happened, and so does no one else. That&apos;s the point.
          </p>
        )}
      </Card.Content>
    </Card>
  );
}
