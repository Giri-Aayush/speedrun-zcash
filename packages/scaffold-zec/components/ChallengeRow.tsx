import Link from 'next/link';
import type { Challenge } from '../lib/challenges';

export function ChallengeRow({
  challenge,
  cleared = false,
}: {
  challenge: Challenge;
  cleared?: boolean;
}) {
  const body = (
    <>
      <span
        className="row-number"
        style={{ color: challenge.status === 'live' ? 'var(--gold)' : 'var(--faint)' }}
      >
        #{challenge.number}
      </span>
      <div className="flex min-w-0 flex-col gap-[3px]">
        <span className="text-[16.5px] font-semibold">{challenge.title}</span>
        <span className="text-[13.5px] muted">{challenge.tagline}</span>
      </div>
      {cleared ? (
        <span className="pill pill-done ml-auto">CLEARED</span>
      ) : challenge.status === 'live' ? (
        <span className="pill pill-live ml-auto">LIVE</span>
      ) : (
        <span className="pill ml-auto">SOON</span>
      )}
      {challenge.status === 'live' && (
        <span className="text-[17px]" style={{ color: 'var(--gold)' }}>
          →
        </span>
      )}
    </>
  );

  if (challenge.status !== 'live') {
    return <div className="row row-soon">{body}</div>;
  }

  return (
    <Link href={`/challenges/${challenge.slug}`} className="row row-live">
      {body}
    </Link>
  );
}
