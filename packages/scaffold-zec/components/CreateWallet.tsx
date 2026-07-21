'use client';

import { useState } from 'react';
import { Alert, Button, Card, Spinner, TextArea } from '@heroui/react';
import { useWebZjs } from '../lib/WebZjsProvider';

export function CreateWallet() {
  const { createWallet, restoreWallet } = useWebZjs();
  const [mode, setMode] = useState<'choose' | 'created' | 'restore'>('choose');
  const [seed, setSeed] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCreate = async () => {
    setBusy(true);
    setError(null);
    try {
      setSeed(await createWallet());
      setMode('created');
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  };

  const onRestore = async () => {
    setBusy(true);
    setError(null);
    try {
      await restoreWallet(seed);
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title className="eyebrow">Get started</Card.Title>
        <Card.Description className="panel-title mt-2">
          {mode === 'created' ? 'Write these down' : 'Create a testnet wallet'}
        </Card.Description>
      </Card.Header>
      <Card.Content className="flex flex-col gap-5">
        {mode === 'choose' && (
          <>
            <p className="m-0 text-[14.5px] leading-[1.6] muted">
              Generated in this tab. The keys never touch a server, which also
              means nothing can recover them for you.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" onPress={onCreate} isPending={busy}>
                {({ isPending }) => (
                  <>
                    {isPending && <Spinner color="current" size="sm" />}
                    {isPending ? 'Generating…' : 'Create new wallet'}
                  </>
                )}
              </Button>
              <Button variant="outline" onPress={() => setMode('restore')}>
                Restore from seed
              </Button>
            </div>
          </>
        )}

        {mode === 'created' && (
          <>
            <p className="m-0 text-[14.5px] leading-[1.6] muted">
              These 24 words are the wallet. Anyone who has them has your funds,
              and losing them loses everything.
            </p>
            <ol className="m-0 grid list-none grid-cols-2 gap-x-6 gap-y-2 p-0 sm:grid-cols-4">
              {seed.split(/\s+/).map((word, i) => (
                <li key={i} className="flex items-baseline gap-2">
                  <span
                    className="mono text-[11px]"
                    style={{ color: 'var(--faint)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="mono text-[13px]"
                    style={{ color: 'var(--accent)' }}
                  >
                    {word}
                  </span>
                </li>
              ))}
            </ol>
          </>
        )}

        {mode === 'restore' && (
          <>
            <TextArea
              aria-label="Seed phrase"
              placeholder="24-word seed phrase"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              rows={3}
              className="mono"
            />
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                onPress={onRestore}
                isPending={busy}
                isDisabled={!seed.trim()}
              >
                {({ isPending }) => (
                  <>
                    {isPending && <Spinner color="current" size="sm" />}
                    {isPending ? 'Restoring…' : 'Restore wallet'}
                  </>
                )}
              </Button>
              <Button variant="outline" onPress={() => setMode('choose')}>
                Back
              </Button>
            </div>
          </>
        )}

        {error && (
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description>{error}</Alert.Description>
            </Alert.Content>
          </Alert>
        )}
      </Card.Content>
    </Card>
  );
}
