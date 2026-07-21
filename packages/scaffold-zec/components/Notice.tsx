'use client';

import { useEffect, useState } from 'react';
import { ShieldGlyph } from './ShieldGlyph';

/**
 * Dismissible inline notice. Dismissal is remembered per `id`, so a notice
 * someone has already read does not nag them on every visit.
 */

export function Notice({
  id,
  children,
  action,
}: {
  id: string;
  children: React.ReactNode;
  action?: { label: string; href: string };
}) {
  const storageKey = `speedrun-notice-${id}`;
  // Starts hidden so a previously dismissed notice never flashes in before
  // localStorage can be read on the client.
  const [state, setState] = useState<'checking' | 'shown' | 'dismissed'>(
    'checking',
  );

  useEffect(() => {
    setState(localStorage.getItem(storageKey) === '1' ? 'dismissed' : 'shown');
  }, [storageKey]);

  if (state !== 'shown') return null;

  return (
    <div className="notice">
      <span className="spark spark--tl" aria-hidden="true">
        <ShieldGlyph />
      </span>
      <span className="spark spark--br" aria-hidden="true">
        <ShieldGlyph />
      </span>

      <p className="m-0 text-[13.5px] leading-[1.5]">{children}</p>

      {action && (
        <a
          href={action.href}
          target="_blank"
          rel="noreferrer"
          className="notice-action"
        >
          {action.label}
        </a>
      )}

      <button
        type="button"
        aria-label="Dismiss notice"
        className="notice-close"
        onClick={() => {
          localStorage.setItem(storageKey, '1');
          setState('dismissed');
        }}
      >
        ✕
      </button>
    </div>
  );
}
