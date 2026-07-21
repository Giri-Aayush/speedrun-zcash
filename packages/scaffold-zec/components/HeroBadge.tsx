import { ShieldGlyph } from './ShieldGlyph';

const REPO = 'https://github.com/Giri-Aayush/speedrun-zcash';

/**
 * The hero's status line as a badge rather than loose text: it states what
 * the project is, and doubles as the way into the repository.
 */
export function HeroBadge() {
  return (
    <a
      href={REPO}
      target="_blank"
      rel="noreferrer"
      className="hero-badge"
      aria-label="Open source on GitHub — running on Zcash testnet"
    >
      <span className="spark spark--tl" aria-hidden="true">
        <ShieldGlyph />
      </span>
      <span className="spark spark--br" aria-hidden="true">
        <ShieldGlyph />
      </span>

      <span className="dot dot-live" />
      <span>Open source · Zcash testnet · Live</span>
      <span className="hero-badge__arrow" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}
