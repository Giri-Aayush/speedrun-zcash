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
      const phrase = await createWallet();
      setSeed(phrase);
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
    <div className="card">
      <h2>Get started</h2>
      {mode === 'choose' && (
        <div className="stack">
          <p>
            Create an in-browser Zcash <strong>testnet</strong> wallet. Keys
            never leave your machine.
          </p>
          <button onClick={onCreate} disabled={busy}>
            {busy ? 'Creating…' : '✨ Create new wallet'}
          </button>
          <button className="secondary" onClick={() => setMode('restore')}>
            Restore from seed phrase
          </button>
        </div>
      )}
      {mode === 'created' && (
        <div className="stack">
          <p>
            Your seed phrase — this is the wallet. Copy it somewhere safe
            (it&apos;s testnet, but build the habit):
          </p>
          <code className="seed">{seed}</code>
        </div>
      )}
      {mode === 'restore' && (
        <div className="stack">
          <textarea
            placeholder="24-word seed phrase"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            rows={3}
          />
          <button onClick={onRestore} disabled={busy || !seed.trim()}>
            {busy ? 'Restoring…' : 'Restore wallet'}
          </button>
          <button className="secondary" onClick={() => setMode('choose')}>
            Back
          </button>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
