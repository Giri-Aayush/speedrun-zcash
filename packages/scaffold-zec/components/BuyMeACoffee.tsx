'use client';

import { useEffect, useState } from 'react';
import { Button, Modal } from '@heroui/react';
import { DONATION_ADDRESS, DONATION_URI } from '../lib/donation';

function QrCode() {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  // Loaded on open rather than with the page: nobody pays for a QR encoder
  // to read the landing page.
  useEffect(() => {
    let active = true;
    import('qrcode')
      .then((qrcode) =>
        qrcode.toDataURL(DONATION_URI, {
          margin: 2,
          width: 340,
          errorCorrectionLevel: 'M',
          color: { dark: '#0a0a0c', light: '#ededf0' },
        }),
      )
      .then((url) => active && setSrc(url))
      .catch(() => active && setFailed(true));
    return () => {
      active = false;
    };
  }, []);

  if (failed) return null;

  return (
    <div
      className="mx-auto flex h-[170px] w-[170px] items-center justify-center rounded-xl"
      style={{ background: '#ededf0' }}
    >
      {src ? (
        <img
          src={src}
          alt="QR code for the donation address"
          className="h-full w-full rounded-xl"
        />
      ) : (
        <span className="dot dot-busy" />
      )}
    </div>
  );
}

function AddressBlock() {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <span className="eyebrow">Shielded address · mainnet</span>
      <code
        className="block rounded-xl p-3 text-[11.5px] leading-[1.6]"
        style={{
          background: 'var(--field-background)',
          border: '1px solid var(--hairline)',
          wordBreak: 'break-all',
        }}
      >
        {DONATION_ADDRESS}
      </code>
      <Button
        size="sm"
        variant="primary"
        onPress={async () => {
          await navigator.clipboard.writeText(DONATION_ADDRESS);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        }}
      >
        {copied ? 'Copied' : 'Copy address'}
      </Button>
    </div>
  );
}

export function BuyMeACoffee() {
  return (
    <Modal>
      <Modal.Trigger>
        <button type="button" className="meta hover:text-[var(--accent)]">
          ☕ Buy me a coffee
        </button>
      </Modal.Trigger>

      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading className="panel-title">
                Buy me a coffee
              </Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>

            <Modal.Body className="flex flex-col gap-5">
              <p className="m-0 text-[14.5px] leading-[1.6] muted">
                Speedrun Zcash is free and always will be. If it taught you
                something, you can send a little ZEC — shielded, so the amount
                and the sender stay private. Which felt like the right way to
                fund a project about exactly that.
              </p>

              <QrCode />
              <AddressBlock />

              <p className="hint m-0">
                This is a mainnet address, so send from a real wallet such as
                Zashi or YWallet. The wallet built into this site is
                testnet-only and cannot pay it.
              </p>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
