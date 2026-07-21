'use client';

import { useState } from 'react';
import { useWebZjs } from '../lib/WebZjsProvider';
import { zecToZats } from '../lib/zec';

export function SendZec() {
  const { send, sending, balance } = useWebZjs();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const spendable =
    (balance?.sapling ?? 0) + (balance?.orchard ?? 0);

  const onSend = async () => {
    setError(null);
    setResult(null);
    try {
      await send(to.trim(), zecToZats(amount));
      setResult(`Sent ${amount} TAZ 🎉 — watch it confirm on the next sync.`);
      setTo('');
      setAmount('');
    } catch (e) {
      setError(String(e));
    }
  };

  return (
    <div className="card">
      <h2>Send shielded</h2>
      <div className="stack">
        <input
          placeholder="Recipient address (unified utest1… or transparent tm…)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <input
          placeholder="Amount in TAZ"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
        />
        <button
          onClick={onSend}
          disabled={sending || !to.trim() || !amount || spendable === 0}
        >
          {sending ? 'Building proof & sending…' : 'Send'}
        </button>
        {spendable === 0 && (
          <p className="hint">No spendable shielded balance yet.</p>
        )}
        <p className="hint">
          📝 Memo support is not exposed by WebZjs yet (payments are built
          with <code>Payment::without_memo</code>) — upstreaming it is on the{' '}
          <a
            href="https://github.com/ChainSafe/WebZjs"
            target="_blank"
            rel="noreferrer"
          >
            roadmap
          </a>
          .
        </p>
      </div>
      {result && <p className="success">{result}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
