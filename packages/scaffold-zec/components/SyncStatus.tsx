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
    <div className="syncbar">
      <span className={`dot ${syncing ? 'busy' : synced ? 'ok' : 'warn'}`} />
      <span>
        {network === 'test' ? 'testnet' : 'mainnet'} ·{' '}
        {syncing
          ? 'syncing…'
          : fullyScannedHeight !== null
            ? `scanned ${fullyScannedHeight}${chainHeight !== null ? ` / ${chainHeight}` : ''}`
            : 'not synced yet'}
      </span>
      <button className="secondary small" onClick={triggerSync} disabled={syncing}>
        Sync now
      </button>
    </div>
  );
}
