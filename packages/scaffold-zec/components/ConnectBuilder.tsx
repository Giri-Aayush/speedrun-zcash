'use client';

import { useBuilder } from '../lib/BuilderProvider';

export function ConnectBuilder() {
  const { builderId, connect, connecting, error, canConnect } = useBuilder();

  if (builderId) {
    return (
      <div
        className="flex flex-wrap items-center gap-3 rounded-xl px-4 py-3"
        style={{ border: '1px solid var(--hairline)' }}
      >
        <span className="dot dot-live" />
        <span className="text-[13px] muted">
          Builder <code style={{ color: 'var(--gold)' }}>{builderId.slice(0, 8)}</code> — your
          run follows this seed to any browser.
        </span>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-3 rounded-xl p-5"
      style={{
        border: '1px solid var(--gold-edge)',
        background: 'var(--gold-wash)',
      }}
    >
      <span className="eyebrow" style={{ color: 'var(--gold)' }}>
        Track your run
      </span>
      <p className="m-0 text-[14.5px] leading-[1.6] muted">
        Your builder identity is derived from your wallet seed — no account, no
        password. Only a pseudonym and a public key are sent, never the seed and
        nothing that links to your addresses.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <button
          className="btn btn-primary btn-small"
          onClick={connect}
          disabled={!canConnect || connecting}
        >
          {connecting ? 'Connecting…' : 'Connect wallet'}
        </button>
        {!canConnect && <span className="hint">Create a wallet below first.</span>}
      </div>
      {error && <p className="error m-0">{error}</p>}
    </div>
  );
}
