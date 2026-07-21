'use client';

import { useState } from 'react';
import { useWebZjs } from '../lib/WebZjsProvider';
import { zecToZats } from '../lib/zec';

export function SendZec({ onSent }: { onSent?: () => void }) {
  const { send, sending, balance } = useWebZjs();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const spendable = (balance?.sapling ?? 0) + (balance?.orchard ?? 0);

  const onSend = async () => {
    setError(null);
    setResult(null);
    try {
      await send(to.trim(), zecToZats(amount));
      setResult(`Sent ${amount} TAZ. It will confirm on the next block.`);
      setTo('');
      setAmount('');
      onSent?.();
    } catch (e) {
      setError(String(e));
    }
  };

  return (
    <div className="card flex flex-col gap-4">
      <span className="eyebrow">Send shielded</span>

      <input
        placeholder="Recipient — utest1… or tm…"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      <input
        placeholder="Amount in TAZ"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        inputMode="decimal"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          className="btn btn-primary"
          onClick={onSend}
          disabled={sending || !to.trim() || !amount || spendable === 0}
        >
          {sending ? 'Building proof…' : 'Send'}
        </button>
        {sending && (
          <span className="hint">
            Proving runs in this tab and takes a while — leave it open.
          </span>
        )}
        {!sending && spendable === 0 && (
          <span className="hint">Nothing spendable yet.</span>
        )}
      </div>

      {result && <p className="success m-0">{result}</p>}
      {error && <p className="error m-0">{error}</p>}
    </div>
  );
}
