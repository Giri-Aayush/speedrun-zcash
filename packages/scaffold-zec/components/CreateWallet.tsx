'use client';

import { useState } from 'react';
import { useWebZjs } from '../lib/WebZjsProvider';

export function CreateWallet() {
  const { createWallet, restoreWallet } = useWebZjs();
  const [mode, setMode] = useState<'choose' | 'created' | 'restore'>('choose');
  const [seed, setSeed] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCreate = async () => {
    setBusy(true);
    setError(null);
    try {
      setSeed(await createWallet());
      setMode('created');
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  };

  const onRestore = async () => {
    setBusy(true);
    setError(null);
    try {
      await restoreWallet(seed);
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="eyebrow">Get started</span>
        <p className="card-title">
          {mode === 'created' ? 'Write these down' : 'Create a testnet wallet'}
        </p>
      </div>

      {mode === 'choose' && (
        <>
          <p className="m-0 text-[14.5px] leading-[1.6] muted">
            Generated in this tab. The keys never touch a server — which also
            means nothing can recover them for you.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-primary" onClick={onCreate} disabled={busy}>
              {busy ? 'Generating…' : 'Create new wallet'}
            </button>
            <button className="btn btn-ghost" onClick={() => setMode('restore')}>
              Restore from seed
            </button>
          </div>
        </>
      )}

      {mode === 'created' && (
        <>
          <p className="m-0 text-[14.5px] leading-[1.6] muted">
            These 24 words are the wallet. Anyone who has them has your funds,
            and losing them loses everything.
          </p>
          <ol className="m-0 grid list-none grid-cols-2 gap-x-6 gap-y-2 p-0 sm:grid-cols-4">
            {seed.split(/\s+/).map((word, i) => (
              <li key={i} className="flex items-baseline gap-2">
                <span className="mono text-[11px]" style={{ color: 'var(--faint)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="mono text-[13px]" style={{ color: 'var(--gold)' }}>
                  {word}
                </span>
              </li>
            ))}
          </ol>
        </>
      )}

      {mode === 'restore' && (
        <>
          <textarea
            placeholder="24-word seed phrase"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            rows={3}
          />
          <div className="flex flex-wrap gap-3">
            <button
              className="btn btn-primary"
              onClick={onRestore}
              disabled={busy || !seed.trim()}
            >
              {busy ? 'Restoring…' : 'Restore wallet'}
            </button>
            <button className="btn btn-ghost" onClick={() => setMode('choose')}>
              Back
            </button>
          </div>
        </>
      )}

      {error && <p className="error m-0">{error}</p>}
    </div>
  );
}
