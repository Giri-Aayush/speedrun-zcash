'use client';

import { useWebZjs } from '../lib/WebZjsProvider';
import { zatsToZec } from '../lib/zec';

export function ShieldedBalance() {
  const { balance } = useWebZjs();
  const shielded = (balance?.sapling ?? 0) + (balance?.orchard ?? 0);
  const pending =
    (balance?.pendingChange ?? 0) + (balance?.pendingSpendable ?? 0);

  return (
    <div className="card">
      <h2>Balance</h2>
      <div className="balance-main">
        🛡️ {zatsToZec(shielded)} <span className="unit">TAZ</span>
      </div>
      <div className="balance-rows">
        <div>
          <span>Orchard</span>
          <span>{zatsToZec(balance?.orchard ?? 0)}</span>
        </div>
        <div>
          <span>Sapling</span>
          <span>{zatsToZec(balance?.sapling ?? 0)}</span>
        </div>
        <div>
          <span>Transparent ⚠️</span>
          <span>{zatsToZec(balance?.transparent ?? 0)}</span>
        </div>
        {pending > 0 && (
          <div>
            <span>Pending</span>
            <span>{zatsToZec(pending)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
