'use client';

import { useWebZjs } from '../lib/WebZjsProvider';

export function SyncStatus() {
  const { syncing, chainHeight, fullyScannedHeight, triggerSync, network } =
    useWebZjs();
  const synced =
    chainHeight !== null &&
    fullyScannedHeight !== null &&
    chainHeight - fullyScannedHeight <= 1n;

  return (
    <div
      className="flex items-center gap-[10px] rounded-full px-4 py-2"
      style={{ border: '1px solid var(--hairline)' }}
    >
      <span
        className={`dot ${syncing ? 'dot-busy' : synced ? 'dot-live' : 'dot-idle'}`}
      />
      <span className="mono text-[12px]" style={{ color: 'var(--dim)' }}>
        {network === 'test' ? 'testnet' : 'mainnet'} ·{' '}
        {syncing
          ? 'scanning…'
          : fullyScannedHeight !== null
            ? `${fullyScannedHeight}${chainHeight !== null ? ` / ${chainHeight}` : ''}`
            : 'not synced'}
      </span>
      <button
        className="btn btn-ghost btn-small ml-auto"
        onClick={triggerSync}
        disabled={syncing}
      >
        Sync
      </button>
    </div>
  );
}
