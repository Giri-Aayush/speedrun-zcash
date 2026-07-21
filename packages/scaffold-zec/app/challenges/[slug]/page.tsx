'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, Chip } from '@heroui/react';
import { getChallenge } from '../../../lib/challenges';
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
    <main>
      <header>
        <Link
          href="/challenges"
          className="text-sm no-underline opacity-70 hover:opacity-100"
        >
          ← All challenges
        </Link>
        <h1 className="mt-2">
          {challenge.emoji} Challenge #{challenge.number}: {challenge.title}
        </h1>
        <p className="tagline">{challenge.tagline}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {challenge.skills.map((s) => (
            <Chip key={s} size="sm" variant="secondary">
              {s}
            </Chip>
          ))}
        </div>
      </header>

      {challenge.lesson.map((section) => (
        <Card key={section.heading}>
          <Card.Header>
            <Card.Title>{section.heading}</Card.Title>
          </Card.Header>
          <Card.Content className="flex flex-col gap-3">
            {section.body.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed opacity-90">
                {p}
              </p>
            ))}
          </Card.Content>
        </Card>
      ))}

      {challenge.slug === 'first-shielded-transaction' && (
        <Challenge0Play challenge={challenge} />
      )}

      {challenge.gotcha && (
        <Card className="border-yellow-600/40">
          <Card.Header>
            <Card.Title>{challenge.gotcha.heading}</Card.Title>
          </Card.Header>
          <Card.Content className="flex flex-col gap-3">
            {challenge.gotcha.body.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed opacity-90">
                {p}
              </p>
            ))}
          </Card.Content>
        </Card>
      )}
    </main>
  );
}
