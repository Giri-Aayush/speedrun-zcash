export interface ChallengeStep {
  id: string;
  title: string;
  detail: string;
}

export interface Challenge {
  slug: string;
  number: number;
  emoji: string;
  title: string;
  tagline: string;
  status: 'live' | 'soon';
  skills: string[];
  /** Lesson sections rendered before the interactive part */
  lesson: { heading: string; body: string[] }[];
  steps: ChallengeStep[];
  gotcha?: { heading: string; body: string[] };
}

export const challenges: Challenge[] = [
  {
    slug: 'first-shielded-transaction',
    number: 0,
    emoji: '🏁',
    title: 'First Shielded Transaction',
    tagline:
      'Create an in-browser wallet, fund it from the faucet, and send a payment nobody can see.',
    status: 'live',
    skills: ['Shielded pools', 'Unified addresses', 'Testnet', 'Light clients'],
    lesson: [
      {
        heading: 'Why this challenge',
        body: [
          'On most blockchains every payment you ever make is public forever — amounts, counterparties, your whole graph. Zcash flips the default: value lives in a shielded pool where amounts and addresses are encrypted, and only the people you choose can see your activity.',
          'In this challenge you run the full loop every Zcash app is built on: create a wallet, receive shielded funds, and spend them — entirely in your browser. The wallet you use here is the same WebZjs light client this starter kit ships with.',
        ],
      },
      {
        heading: 'The pools: transparent vs. shielded',
        body: [
          'Zcash has one chain but several value pools. The transparent pool works like Bitcoin — addresses start with t, and every transaction is visible to anyone. The shielded pools (Sapling, and the newer Orchard) hide sender, receiver, and amount behind zero-knowledge proofs.',
          'A shielded balance is a set of encrypted "notes" only your keys can decrypt. When you spend one, the network verifies a proof that the money exists and is yours — without learning anything else.',
        ],
      },
      {
        heading: 'Unified addresses',
        body: [
          'Modern Zcash wallets share one Unified Address (UA) that bundles receivers for multiple pools. Payments to a UA land shielded whenever the sender supports it. Your wallet below shows both your UA and a transparent address — compare what a block explorer can see about each after you transact.',
        ],
      },
    ],
    steps: [
      {
        id: 'wallet',
        title: 'Create your wallet',
        detail:
          'Generate a 24-word seed in the browser. The seed is the wallet — everything else is derived from it.',
      },
      {
        id: 'fund',
        title: 'Get testnet ZEC from the faucet',
        detail:
          'Copy your unified address and request TAZ from a testnet faucet, then wait for the wallet to sync it. Testnet coins are worthless — perfect for breaking things.',
      },
      {
        id: 'send',
        title: 'Send a shielded payment',
        detail:
          'Send some TAZ to any address — the challenge address works. Your browser builds a real zero-knowledge proof; expect it to take a few seconds.',
      },
    ],
    gotcha: {
      heading: '⚠️ The gotcha: transparent leakage',
      body: [
        'Look up your transparent address in a testnet explorer — every coin it ever touches is public. Now look up your unified address: nothing to find. The lesson every Zcash developer internalizes early: privacy is a property of the pool the money sits in, and touching the transparent pool leaks metadata even if you shield afterwards.',
        'Rule of thumb when you build apps: keep funds shielded end-to-end, and treat every transparent hop as a disclosure event.',
      ],
    },
  },
  {
    slug: 'memo-messenger',
    number: 1,
    emoji: '💬',
    title: 'Memo Messenger',
    tagline:
      'Turn Zcash into an encrypted messaging layer using the 512-byte shielded memo field.',
    status: 'soon',
    skills: ['Encrypted memos', 'Trial decryption', 'Viewing keys'],
    lesson: [],
    steps: [],
  },
  {
    slug: 'build-a-light-wallet',
    number: 2,
    emoji: '👛',
    title: 'Build a Light Wallet',
    tagline:
      'Sync, derive addresses, and spend — build your own wallet on the light client protocol.',
    status: 'soon',
    skills: ['Compact blocks', 'ZIP-32 keys', 'Sync UX'],
    lesson: [],
    steps: [],
  },
  {
    slug: 'shielded-storefront',
    number: 3,
    emoji: '🛒',
    title: 'Shielded Storefront',
    tagline:
      'Sell digital goods for shielded ZEC and detect payments with a viewing key.',
    status: 'soon',
    skills: ['ZIP-321 payment URIs', 'Watch-only wallets', 'Payment detection'],
    lesson: [],
    steps: [],
  },
];

export function getChallenge(slug: string): Challenge | undefined {
  return challenges.find((c) => c.slug === slug);
}
