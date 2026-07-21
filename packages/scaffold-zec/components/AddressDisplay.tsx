'use client';

import { useState } from 'react';
import { useWebZjs } from '../lib/WebZjsProvider';
import { shortenAddress } from '../lib/zec';

function CopyRow({ label, value }: { label: string; value: string | null }) {
  const [copied, setCopied] = useState(false);
  if (!value) return null;
  return (
    <div className="addr-row">
      <span className="addr-label">{label}</span>
      <code title={value}>{shortenAddress(value, 14)}</code>
      <button
        className="secondary small"
        onClick={async () => {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
      >
        {copied ? '✓' : 'Copy'}
      </button>
    </div>
  );
}

export function AddressDisplay() {
  const { unifiedAddress, transparentAddress } = useWebZjs();
  return (
    <div className="card">
      <h2>Receive</h2>
      <CopyRow label="Unified (shielded)" value={unifiedAddress} />
      <CopyRow label="Transparent" value={transparentAddress} />
      <p className="hint">
        Fund it from the{' '}
        <a
          href="https://faucet.zecpages.com/"
          target="_blank"
          rel="noreferrer"
        >
          testnet faucet
        </a>
        . Unified address = privacy by default; transparent = visible to
        everyone, like Bitcoin.
      </p>
    </div>
  );
}
