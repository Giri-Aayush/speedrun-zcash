'use client';

import Link from 'next/link';
import { Card, Chip } from '@heroui/react';
import { challenges } from '../../lib/challenges';

export default function ChallengesPage() {
  return (
    <main>
      <header>
        <h1>Challenges</h1>
        <p className="tagline">
          Ship something real in every challenge. Each one unlocks the next.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {challenges.map((c) => {
          const inner = (
            <Card
              key={c.slug}
              className={c.status === 'live' ? 'transition hover:border-yellow-500/60' : 'opacity-55'}
            >
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <span>{c.emoji}</span>
                  <span className="text-zinc-500 font-mono text-sm">
                    #{c.number}
                  </span>
                  {c.title}
                  {c.status === 'live' ? (
                    <Chip size="sm" color="success" className="ml-auto">
                      Live
                    </Chip>
                  ) : (
                    <Chip size="sm" className="ml-auto">
                      Coming soon
                    </Chip>
                  )}
                </Card.Title>
                <Card.Description>{c.tagline}</Card.Description>
              </Card.Header>
              <Card.Content className="flex flex-wrap gap-2">
                {c.skills.map((s) => (
                  <Chip key={s} size="sm" variant="secondary">
                    {s}
                  </Chip>
                ))}
              </Card.Content>
            </Card>
          );
          return c.status === 'live' ? (
            <Link
              key={c.slug}
              href={`/challenges/${c.slug}`}
              className="no-underline"
            >
              {inner}
            </Link>
          ) : (
            inner
          );
        })}
      </div>
    </main>
  );
}
