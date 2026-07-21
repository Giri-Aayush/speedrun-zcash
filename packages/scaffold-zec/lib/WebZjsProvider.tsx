'use client';

/**
 * WebZjsProvider — the core of Scaffold-ZEC.
 *
 * Wraps the WebZjs WASM light client (built from ChainSafe/WebZjs) in a React
 * context: init WASM + thread pool, create/restore an in-browser testnet
 * wallet, periodic sync against a lightwalletd gRPC-web proxy, and shielded
 * sends.
 *
 * ⚠️ Educational starter: the seed phrase is kept in localStorage so the
 * wallet survives refreshes and can sign sends. Fine for TESTNET learning,
 * never do this for mainnet funds.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { get, set } from 'idb-keyval';
import { mnemonicToSeed } from './bip39';

// WebZjs is WASM + SharedArrayBuffer; types only at module level, real
// modules are dynamically imported in the browser during init.
import type { WebWallet, WalletSummary } from '@chainsafe/webzjs-wallet';

const NETWORK = process.env.NEXT_PUBLIC_ZCASH_NETWORK || 'test';
const LIGHTWALLETD_PROXY =
  process.env.NEXT_PUBLIC_LIGHTWALLETD_PROXY || 'http://localhost:8080';

const IDB_WALLET_KEY = 'scaffold-zec-wallet-db';
const LS_SEED_KEY = 'scaffold-zec-seed'; // testnet only!
const LS_BIRTHDAY_KEY = 'scaffold-zec-birthday';
const SYNC_INTERVAL_MS = 30_000;
const ACCOUNT_HD_INDEX = 0;

export interface AccountBalance {
  sapling: number;
  orchard: number;
  transparent: number;
  pendingChange: number;
  pendingSpendable: number;
}

export interface WebZjsState {
  status: 'idle' | 'initializing' | 'no-account' | 'ready' | 'error';
  error: string | null;
  seedPhrase: string | null;
  accountId: number | null;
  unifiedAddress: string | null;
  transparentAddress: string | null;
  balance: AccountBalance | null;
  chainHeight: bigint | null;
  fullyScannedHeight: bigint | null;
  syncing: boolean;
  sending: boolean;
}

export interface WebZjsApi extends WebZjsState {
  createWallet: () => Promise<string>;
  restoreWallet: (seedPhrase: string, birthday?: number) => Promise<void>;
  triggerSync: () => Promise<void>;
  send: (toAddress: string, amountZats: bigint) => Promise<void>;
  network: string;
}

const Ctx = createContext<WebZjsApi | null>(null);

export function useWebZjs(): WebZjsApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useWebZjs must be used inside <WebZjsProvider>');
  return ctx;
}

export function WebZjsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WebZjsState>({
    status: 'idle',
    error: null,
    seedPhrase: null,
    accountId: null,
    unifiedAddress: null,
    transparentAddress: null,
    balance: null,
    chainHeight: null,
    fullyScannedHeight: null,
    syncing: false,
    sending: false,
  });
  const walletRef = useRef<WebWallet | null>(null);
  const initRef = useRef(false);
  const syncingRef = useRef(false);

  const patch = (p: Partial<WebZjsState>) =>
    setState((s) => ({ ...s, ...p }));

  const refreshFromWallet = useCallback(async () => {
    const wallet = walletRef.current;
    if (!wallet) return;
    const summary: WalletSummary | undefined = await wallet.get_wallet_summary();
    if (summary && summary.account_balances.length > 0) {
      const [accountId, b] = summary.account_balances[0];
      patch({
        accountId,
        fullyScannedHeight:
          summary.fully_scanned_height != null
            ? BigInt(summary.fully_scanned_height)
            : null,
        balance: {
          sapling: b.sapling_balance ?? 0,
          orchard: b.orchard_balance ?? 0,
          transparent: b.unshielded_balance ?? 0,
          pendingChange: b.pending_change ?? 0,
          pendingSpendable: b.pending_spendable ?? 0,
        },
      });
      const [ua, ta] = await Promise.all([
        wallet.get_current_address(accountId),
        wallet.get_current_address_transparent(accountId),
      ]);
      patch({ unifiedAddress: ua, transparentAddress: ta });
    }
    try {
      const height = await wallet.get_latest_block();
      if (height) patch({ chainHeight: height });
    } catch {
      /* chain height is best-effort; retried on next sync */
    }
  }, []);

  const persistDb = useCallback(async () => {
    const wallet = walletRef.current;
    if (!wallet) return;
    const bytes = await wallet.db_to_bytes();
    await set(IDB_WALLET_KEY, bytes);
  }, []);

  // One-time WASM + wallet init (browser only)
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    (async () => {
      patch({ status: 'initializing' });
      try {
        const walletMod = await import('@chainsafe/webzjs-wallet');
        await walletMod.default();
        if (!crossOriginIsolated) {
          throw new Error(
            'Page is not cross-origin isolated — COOP/COEP headers missing, WASM threads unavailable',
          );
        }
        await walletMod.initThreadPool(navigator.hardwareConcurrency || 4);

        const savedDb = await get(IDB_WALLET_KEY);
        const wallet = new walletMod.WebWallet(
          NETWORK,
          LIGHTWALLETD_PROXY,
          1,
          1,
          savedDb ?? null,
        );
        walletRef.current = wallet;

        const seed = localStorage.getItem(LS_SEED_KEY);
        patch({ seedPhrase: seed });

        await refreshFromWallet();
        const summary = await wallet.get_wallet_summary();
        const hasAccount = !!summary && summary.account_balances.length > 0;
        patch({ status: hasAccount && seed ? 'ready' : 'no-account' });
      } catch (err) {
        console.error('WebZjs init failed:', err);
        patch({ status: 'error', error: String(err) });
      }
    })();
  }, [refreshFromWallet]);

  const addAccount = useCallback(
    async (seedPhrase: string, birthday: number) => {
      const wallet = walletRef.current;
      if (!wallet) throw new Error('Wallet not initialized');
      await wallet.create_account(
        'default',
        seedPhrase,
        ACCOUNT_HD_INDEX,
        birthday,
      );
      localStorage.setItem(LS_SEED_KEY, seedPhrase);
      localStorage.setItem(LS_BIRTHDAY_KEY, String(birthday));
      patch({ seedPhrase });
      await persistDb();
      await refreshFromWallet();
      patch({ status: 'ready' });
    },
    [persistDb, refreshFromWallet],
  );

  const createWallet = useCallback(async () => {
    const wallet = walletRef.current;
    if (!wallet) throw new Error('Wallet not initialized');
    const { generate_seed_phrase } = await import('@chainsafe/webzjs-wallet');
    const seedPhrase = generate_seed_phrase();
    // New wallet: birthday = current chain tip (nothing older to scan)
    const height = Number(await wallet.get_latest_block());
    await addAccount(seedPhrase, height);
    return seedPhrase;
  }, [addAccount]);

  const restoreWallet = useCallback(
    async (seedPhrase: string, birthday?: number) => {
      const wallet = walletRef.current;
      if (!wallet) throw new Error('Wallet not initialized');
      const tip = Number(await wallet.get_latest_block());
      await addAccount(seedPhrase.trim(), birthday ?? tip);
    },
    [addAccount],
  );

  const triggerSync = useCallback(async () => {
    const wallet = walletRef.current;
    if (!wallet || syncingRef.current) return;
    syncingRef.current = true;
    patch({ syncing: true });
    try {
      await wallet.sync();
      await refreshFromWallet();
      await persistDb();
    } catch (err) {
      console.warn('Sync failed (will retry):', err);
    } finally {
      syncingRef.current = false;
      patch({ syncing: false });
    }
  }, [persistDb, refreshFromWallet]);

  // Periodic background sync once an account exists
  useEffect(() => {
    if (state.status !== 'ready') return;
    triggerSync();
    const t = setInterval(triggerSync, SYNC_INTERVAL_MS);
    return () => clearInterval(t);
  }, [state.status, triggerSync]);

  // The wasm build exposes the PCZT flow rather than a one-shot transfer:
  // create → sign (needs the spending key, derived from the seed) → prove →
  // send. Proving runs in the browser and takes a few seconds.
  const send = useCallback(
    async (toAddress: string, amountZats: bigint) => {
      const wallet = walletRef.current;
      const mnemonic = localStorage.getItem(LS_SEED_KEY);
      if (!wallet || state.accountId === null || !mnemonic)
        throw new Error('Wallet not ready');
      patch({ sending: true });
      try {
        const { pczt_sign, SeedFingerprint, UnifiedSpendingKey } =
          await import('@chainsafe/webzjs-wallet');
        const seed = await mnemonicToSeed(mnemonic);
        const usk = new UnifiedSpendingKey(NETWORK, seed, ACCOUNT_HD_INDEX);
        const seedFp = new SeedFingerprint(seed);

        let pczt = await wallet.pczt_create(
          state.accountId,
          toAddress,
          amountZats,
        );
        pczt = await pczt_sign(NETWORK, pczt, usk, seedFp);
        pczt = await wallet.pczt_prove(
          pczt,
          usk.to_sapling_proof_generation_key(),
        );
        await wallet.pczt_send(pczt);

        await refreshFromWallet();
        await persistDb();
      } finally {
        patch({ sending: false });
      }
    },
    [state.accountId, persistDb, refreshFromWallet],
  );

  const api: WebZjsApi = {
    ...state,
    createWallet,
    restoreWallet,
    triggerSync,
    send,
    network: NETWORK,
  };

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
