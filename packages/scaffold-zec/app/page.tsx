import Link from 'next/link';
import { challenges } from '../lib/challenges';
import { ChallengeRow } from '../components/ChallengeRow';
import { ChainTip } from '../components/ChainTip';

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
      <section className="wrap flex flex-col gap-9 pt-32 pb-24">
        <div className="eyebrow flex items-center gap-[10px]">
          <span className="dot dot-live" />
          Open source · Zcash testnet · Live
        </div>

        <h1 className="hero-title">
          Send a payment <span style={{ color: 'var(--gold)' }}>nobody</span> can
          see.
        </h1>

        <p className="lede">
          Learn to build privacy apps on Zcash through numbered challenges — with
          a real shielded wallet running in your browser. Steps clear themselves.
          Nothing to install.
        </p>

        <div className="flex flex-wrap items-center gap-[18px]">
          {first && (
            <Link href={`/challenges/${first.slug}`} className="btn btn-primary">
              Start Challenge #{first.number}
            </Link>
          )}
          <Link href="/challenges" className="btn btn-ghost">
            View all challenges
          </Link>
        </div>

        <ChainTip />
      </section>

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
    </main>
  );
}
