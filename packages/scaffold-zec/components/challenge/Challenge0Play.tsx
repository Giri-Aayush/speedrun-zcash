'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Card, Chip } from '@heroui/react';
import type { Challenge } from '../../lib/challenges';
import { useWebZjs } from '../../lib/WebZjsProvider';
import { useBuilder } from '../../lib/BuilderProvider';
import { ConnectBuilder } from '../ConnectBuilder';
import { CreateWallet } from '../CreateWallet';
import { AddressDisplay } from '../AddressDisplay';
import { ShieldedBalance } from '../ShieldedBalance';
import { SendZec } from '../SendZec';
import { SyncStatus } from '../SyncStatus';

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

const CLAIMED_KEY = 'speedrun-claimed-steps';

export function Challenge0Play({ challenge }: { challenge: Challenge }) {
  const { status, balance, chainHeight, listTransactions } = useWebZjs();
  const { builderId, completions, submitStep, isComplete } = useBuilder();
  const [pending, setPending] = useState<string | null>(null);
  const [rejection, setRejection] = useState<string | null>(null);
  const [claimed, setClaimed] = useState<string[]>([]);
  const inFlight = useRef(new Set<string>());

  useEffect(() => {
    setClaimed(JSON.parse(localStorage.getItem(CLAIMED_KEY) ?? '[]'));
  }, []);

  const claim = useCallback((stepId: string) => {
    setClaimed((previous) => {
      if (previous.includes(stepId)) return previous;
      const next = [...previous, stepId];
      localStorage.setItem(CLAIMED_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const funded =
    !!balance &&
    balance.sapling +
      balance.orchard +
      balance.transparent +
      balance.pendingSpendable >
      0;

  // What the wallet says has happened, before the server confirms it. A
  // claimed step stays claimed so it can be retried while its transaction
  // waits to be mined.
  const observed: Record<string, boolean> = {
    wallet: status === 'ready',
    fund: funded,
    send: claimed.includes('send'),
  };

  const evidenceFor = useCallback(
    async (stepId: string): Promise<{ txid?: string } | undefined> => {
      if (stepId === 'wallet') return undefined;
      const wanted = stepId === 'fund' ? 'received' : 'sent';
      const transactions = await listTransactions();
      const match = transactions.find(
        (tx) => tx.direction === wanted && tx.blockHeight !== null,
      );
      return match ? { txid: match.txid } : undefined;
    },
    [listTransactions],
  );

  /**
   * Steps advance on their own: the wallet notices something happened, and
   * the server is asked to confirm it. Chain-verified steps only stick once
   * lightwalletd agrees the transaction is mined, so a step can sit pending
   * for a block or two — that is the honest state, not a bug.
   */
  const advance = useCallback(
    async (stepId: string) => {
      if (!builderId || inFlight.current.has(stepId)) return;
      inFlight.current.add(stepId);
      setPending(stepId);
      try {
        const evidence = await evidenceFor(stepId);
        const result = await submitStep(challenge.slug, stepId, evidence);
        setRejection(result.ok ? null : (result.reason ?? null));
      } finally {
        inFlight.current.delete(stepId);
        setPending(null);
      }
    },
    [builderId, challenge.slug, evidenceFor, submitStep],
  );

  // Retried on every new block, so a step whose transaction was still in the
  // mempool last time gets picked up as soon as it lands.
  useEffect(() => {
    if (!builderId) return;
    for (const step of challenge.steps) {
      if (observed[step.id] && !isComplete(challenge.slug, step.id)) {
        void advance(step.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [builderId, status, funded, chainHeight, claimed, completions.length]);

  const done = (stepId: string) =>
    builderId ? isComplete(challenge.slug, stepId) : observed[stepId];
  const completed = challenge.steps.filter((s) => done(s.id)).length;

  const verificationOf = (stepId: string) =>
    completions.find(
      (c) => c.challengeSlug === challenge.slug && c.stepId === stepId,
    )?.verification;

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
        <ConnectBuilder />

        <ol className="m-0 flex list-none flex-col gap-4 p-0">
          {challenge.steps.map((step, i) => {
            const verification = verificationOf(step.id);
            return (
              <li key={step.id} className="flex gap-3">
                <StepBadge done={done(step.id)} index={i} />
                <div>
                  <p className="m-0 flex items-center gap-2 font-semibold">
                    {step.title}
                    {verification === 'chain' && (
                      <Chip size="sm" color="success">
                        verified on-chain
                      </Chip>
                    )}
                    {verification === 'attested' && (
                      <Chip size="sm">self-attested</Chip>
                    )}
                    {pending === step.id && <Chip size="sm">checking…</Chip>}
                  </p>
                  <p className="m-0 text-sm opacity-75">{step.detail}</p>
                  {step.verification === 'chain' && !verification && (
                    <p className="hint m-0 mt-1">
                      Confirmed by looking your transaction up on lightwalletd.
                    </p>
                  )}
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
            );
          })}
        </ol>

        {rejection && (
          <p className="hint m-0">Not confirmed yet: {rejection}</p>
        )}

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
            <SendZec onSent={() => claim('send')} />
          </>
        )}

        {completed === challenge.steps.length && (
          <p className="success m-0 text-sm">
            🎉 Challenge complete — and two of those steps were proven against
            the chain itself, not taken on your word.
          </p>
        )}
      </Card.Content>
    </Card>
  );
}
