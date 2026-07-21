const REPO = 'https://github.com/Giri-Aayush/speedrun-zcash';

/**
 * The old hero badge, split into site chrome: a live indicator pinned
 * top-left and the open-source link pinned top-right, flanking the
 * floating nav pill on its own line.
 */
export function CornerStatus() {
  return (
    <>
      <div
        className="mono fixed left-6 top-6 z-50 flex h-12 items-center gap-2 text-[11px] tracking-[0.14em]"
        style={{ color: 'var(--dim)' }}
      >
        <span className="dot dot-live" />
        LIVE
      </div>
      <a
        href={REPO}
        target="_blank"
        rel="noreferrer"
        className="mono fixed right-6 top-6 z-50 flex h-12 items-center gap-1 text-[11px] tracking-[0.14em] transition-colors hover:text-[var(--gold)]"
        style={{ color: 'var(--dim)' }}
      >
        OPEN SOURCE
        <span aria-hidden="true">↗</span>
      </a>
    </>
  );
}
