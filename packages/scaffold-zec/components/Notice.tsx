'use client';

import { useEffect, useState } from 'react';

/**
 * Dismissible inline notice. Dismissal is remembered per `id`, so a notice
 * someone has already read does not nag them on every visit.
 */

function ShieldGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 0.5 1.5 3v4.6c0 3.6 2.6 6.9 6.5 7.9 3.9-1 6.5-4.3 6.5-7.9V3L8 .5Zm0 2.1 4.5 1.7v3.3c0 2.6-1.8 5-4.5 5.9-2.7-.9-4.5-3.3-4.5-5.9V4.3L8 2.6Z" />
    </svg>
  );
}

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
      <span className="notice-spark notice-spark--a" aria-hidden="true">
        <ShieldGlyph />
      </span>
      <span className="notice-spark notice-spark--b" aria-hidden="true">
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
