'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Chip } from '@heroui/react';
import { getChallenge } from '../../../lib/challenges';
import { WalletBoot } from '../../../components/WalletBoot';
import { Notice } from '../../../components/Notice';
import { Challenge0Play } from '../../../components/challenge/Challenge0Play';

export default function ChallengePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const challenge = getChallenge(slug);
  if (!challenge || challenge.status !== 'live') notFound();

  return (
    <main className="wrap section flex max-w-[760px] flex-col gap-10">
      <WalletBoot />

      <header className="flex flex-col gap-4">
        <Link href="/challenges" className="eyebrow hover:text-[var(--gold)]">
          ← All challenges
        </Link>
        <div className="flex items-baseline gap-4">
          <span
            className="display text-[44px] leading-none"
            style={{ color: 'var(--gold)' }}
          >
            #{challenge.number}
          </span>
          <h1 className="display text-[32px]">{challenge.title}</h1>
        </div>
        <p className="lede">{challenge.tagline}</p>
        <div className="flex flex-wrap gap-2">
          {challenge.skills.map((skill) => (
            <Chip key={skill} size="sm" variant="soft" className="mono">
              {skill}
            </Chip>
          ))}
        </div>
      </header>

      <Notice
        id="proving-time"
        action={{ label: 'faucet ↗', href: 'https://faucet.zecpages.com/' }}
      >
        Testnet only — these coins are worthless. Zero-knowledge proofs are
        built in this tab, so a send takes around 30 seconds.
      </Notice>

      {challenge.lesson.map((section) => (
        <section key={section.heading} className="flex flex-col gap-3">
          <h2 className="card-title">{section.heading}</h2>
          {section.body.map((paragraph, i) => (
            <p key={i} className="m-0 text-[15px] leading-[1.7] muted">
              {paragraph}
            </p>
          ))}
        </section>
      ))}

      {challenge.slug === 'first-shielded-transaction' && (
        <Challenge0Play challenge={challenge} />
      )}

      {challenge.gotcha && (
        <section
          className="flex flex-col gap-3 rounded-2xl p-6"
          style={{
            border: '1px solid rgba(244,183,40,.25)',
            background: 'var(--gold-wash)',
          }}
        >
          <h2 className="card-title" style={{ color: 'var(--gold)' }}>
            {challenge.gotcha.heading}
          </h2>
          {challenge.gotcha.body.map((paragraph, i) => (
            <p key={i} className="m-0 text-[15px] leading-[1.7] muted">
              {paragraph}
            </p>
          ))}
        </section>
      )}
    </main>
  );
}
