import Link from 'next/link';
import { challenges } from '../lib/challenges';
import { ChallengeRow } from '../components/ChallengeRow';
import { ChainTip } from '../components/ChainTip';
import { CursorTrail } from '../components/CursorTrail';
import { ArrowLink } from '../components/ArrowLink';
import { Notice } from '../components/Notice';
import { Faqs } from '../components/Faqs';
import { HeroBadge } from '../components/HeroBadge';

const STEPS = [
  {
    label: '01 — READ',
    title: 'A short lesson',
    body: 'Two minutes of the crypto that matters. No fluff.',
  },
  {
    label: '02 — BUILD',
    title: 'Do the real thing',
    body: 'A live shielded wallet is embedded in every challenge. Real keys, real proofs, real testnet blocks.',
  },
  {
    label: '03 — CLEAR',
    title: 'Steps check themselves',
    body: 'The run panel watches wallet state and ticks steps off as you go. No self-reporting.',
  },
];

export default function Home() {
  const first = challenges.find((c) => c.status === 'live');

  return (
    <main>
      <div className="relative isolate overflow-hidden">
        <CursorTrail />
        <div className="hero-glow" aria-hidden="true" />

        <section className="wrap relative flex flex-col items-center gap-9 pt-28 pb-24 text-center">
          <div className="rise" style={{ animationDelay: '0ms' }}>
            <HeroBadge />
          </div>

          <div className="hero-frame rise" style={{ animationDelay: '90ms' }}>
            <span className="hero-bracket hero-bracket--tl" aria-hidden="true" />
            <span className="hero-bracket hero-bracket--tr" aria-hidden="true" />
            <span className="hero-bracket hero-bracket--bl" aria-hidden="true" />
            <span className="hero-bracket hero-bracket--br" aria-hidden="true" />

            <h1 className="hero-title-center">
              Send a payment <span className="unredact">nobody</span> can see.
            </h1>
          </div>

          <p
            className="lede rise mx-auto"
            style={{ animationDelay: '210ms' }}
          >
            Learn to build privacy apps on Zcash through numbered challenges —
            with a real shielded wallet running in your browser. Steps clear
            themselves. Nothing to install.
          </p>

          <div
            className="rise flex flex-wrap items-center justify-center gap-[18px]"
            style={{ animationDelay: '300ms' }}
          >
            {/* These navigate, so they stay anchors and borrow HeroUI's button
                styling through its BEM classes rather than becoming buttons. */}
            {first && (
              <ArrowLink href={`/challenges/${first.slug}`}>
                Start Challenge #{first.number}
              </ArrowLink>
            )}
            <Link
              href="/challenges"
              className="button button--outline button--lg"
            >
              View all challenges
            </Link>
          </div>

          <div className="rise" style={{ animationDelay: '390ms' }}>
            <ChainTip />
          </div>
        </section>
      </div>

      <div className="wrap">
        <div className="rule" />
      </div>

      <section className="wrap section grid gap-12 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
        {STEPS.map((step) => (
          <div key={step.label} className="flex flex-col gap-3">
            <span className="mono text-[12px]" style={{ color: 'var(--gold)' }}>
              {step.label}
            </span>
            <span className="card-title">{step.title}</span>
            <p className="m-0 text-[14.5px] leading-[1.6] muted">{step.body}</p>
          </div>
        ))}
      </section>

      <div className="wrap">
        <div className="rule" />
      </div>

      <section id="challenges" className="wrap section flex flex-col gap-7">
        <Notice
          id="open-source"
          action={{
            label: 'github ↗',
            href: 'https://github.com/Giri-Aayush/speedrun-zcash',
          }}
        >
          Free and open source under MIT — the challenges, the wallet, and the
          platform running them. No accounts, no paid tier, nothing to unlock.
        </Notice>

        <div className="flex items-baseline gap-4">
          <h2 className="display text-[28px]">Challenges</h2>
          <span className="mono ml-auto text-[12px]" style={{ color: 'var(--dim)' }}>
            {challenges.filter((c) => c.status === 'live').length}/
            {challenges.length} live
          </span>
        </div>

        <div className="flex flex-col">
          {challenges.map((challenge, i) => (
            <div key={challenge.slug}>
              {i > 0 && <div className="row-divider" />}
              <ChallengeRow challenge={challenge} />
            </div>
          ))}
        </div>
      </section>

      <div className="wrap">
        <div className="rule" />
      </div>

      <Faqs />
    </main>
  );
}
