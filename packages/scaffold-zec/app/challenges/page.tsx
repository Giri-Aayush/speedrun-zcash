import { challenges } from '../../lib/challenges';
import { ChallengeRow } from '../../components/ChallengeRow';

export const metadata = { title: 'Challenges · Speedrun Zcash' };

export default function ChallengesPage() {
  return (
    <main className="wrap section flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <span className="eyebrow">The curriculum</span>
        <h1 className="display text-[40px]">Challenges</h1>
        <p className="lede">
          Each one ships something real and unlocks the next. Start at zero.
        </p>
      </div>

      <div className="flex flex-col">
        {challenges.map((challenge, i) => (
          <div key={challenge.slug}>
            {i > 0 && <div className="row-divider" />}
            <ChallengeRow challenge={challenge} />
          </div>
        ))}
      </div>
    </main>
  );
}
