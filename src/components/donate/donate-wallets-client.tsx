'use client'

import { useState } from 'react'
import styles from './donate-wallets-client.module.css'

type Locale = 'en' | 'ja'

type WalletItem = {
  id: string
  asset: string
  network: string
  address: string
  note?: string
  addressLabel?: string
}

const EVM_ADDRESS = '0x64afa8201ab478573243a852251d46abe124acd1'

const PRIMARY_WALLETS: WalletItem[] = [
  {
    id: 'btc',
    asset: 'BTC',
    network: 'Bitcoin',
    address: 'bc1qdzxgxg6qt0sjceercxhfngq47qyr2gyqdpd7tj',
  },
  {
    id: 'evm-primary',
    asset: 'ETH · USDT · USDC',
    network: 'Ethereum / ERC-20',
    address: EVM_ADDRESS,
    note: 'One EVM address for ETH, ERC-20 USDT, and ERC-20 USDC.',
    addressLabel: 'EVM address',
  },
]

const ADDITIONAL_WALLETS: WalletItem[] = [
  {
    id: 'sol',
    asset: 'SOL',
    network: 'Solana',
    address: 'FsymgjzjxKyEZQeJDuAcDd8fyX7Ny7yxzZX9UKvCzfen',
  },
  {
    id: 'bnb',
    asset: 'BNB',
    network: 'BNB Smart Chain / BEP-20',
    address: EVM_ADDRESS,
    note: 'Uses the EVM address shown in Primary options.',
    addressLabel: 'EVM address',
  },
  {
    id: 'doge',
    asset: 'DOGE',
    network: 'Dogecoin',
    address: 'DLThxkLh5skugJnofdm5WRARadX83x4Zmz',
  },
  {
    id: 'avax',
    asset: 'AVAX',
    network: 'Avalanche C-Chain',
    address: EVM_ADDRESS,
    note: 'Uses the EVM address shown in Primary options.',
    addressLabel: 'EVM address',
  },
  {
    id: 'xrp',
    asset: 'XRP',
    network: 'XRPL · no destination tag listed',
    address: 'rfNBaSjUQ8r7vCR2aMJKYVG3gNKiQ2Q9uh',
  },
]

async function copyText(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.setAttribute('readonly', '')
  textArea.style.position = 'absolute'
  textArea.style.left = '-9999px'
  document.body.appendChild(textArea)
  textArea.select()
  document.execCommand('copy')
  document.body.removeChild(textArea)
}

function WalletCard({
  wallet,
  locale,
  copied,
  onCopy,
}: {
  wallet: WalletItem
  locale: Locale
  copied: boolean
  onCopy: () => void
}) {
  const ja = locale === 'ja'
  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <div>
          <div className={styles.asset}>{wallet.asset}</div>
          <div className={styles.network}>{wallet.network}</div>
        </div>
        <button
          type="button"
          className={styles.copyButton}
          onClick={onCopy}
          aria-label={ja
            ? `${wallet.asset}（${wallet.network}）のアドレスをコピー`
            : `Copy ${wallet.asset} address for ${wallet.network}`}
        >
          {copied ? (ja ? 'コピー済み' : 'Copied') : (ja ? 'コピー' : 'Copy address')}
        </button>
      </div>
      {wallet.note && <p className={styles.note}>{ja
        ? wallet.note
            .replace('One EVM address for ETH, ERC-20 USDT, and ERC-20 USDC.', 'ETH、ERC-20 USDT、ERC-20 USDCで共通のEVMアドレスです。')
            .replace('Uses the EVM address shown in Primary options.', 'Primary optionsに表示されたEVMアドレスを使用します。')
        : wallet.note}</p>}
      <span className={styles.addressLabel}>{wallet.addressLabel ?? (ja ? 'アドレス' : 'Address')}</span>
      <code className={styles.address}>{wallet.address}</code>
      <p className={styles.warning}>{ja
        ? '送付前に資産、チェーン、アドレスを自身の端末で再確認してください。誤ったネットワークへの送付は復旧できない場合があります。'
        : 'Verify the asset, chain, and address on your own device before sending. Transfers on the wrong network may be unrecoverable.'}</p>
    </article>
  )
}

export default function DonateWalletsClient({ locale = 'en' }: { locale?: Locale }) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const ja = locale === 'ja'

  const handleCopy = async (wallet: WalletItem) => {
    try {
      await copyText(wallet.address)
      setCopiedId(wallet.id)
      window.setTimeout(() => {
        setCopiedId((current) => (current === wallet.id ? null : current))
      }, 2000)
    } catch {
      setCopiedId(null)
    }
  }

  const renderWallet = (wallet: WalletItem) => (
    <WalletCard
      key={wallet.id}
      wallet={wallet}
      locale={locale}
      copied={copiedId === wallet.id}
      onCopy={() => void handleCopy(wallet)}
    />
  )

  return (
    <div className={styles.wrapper}>
      <section aria-labelledby="hei-primary-support-options">
        <h3 id="hei-primary-support-options" className={styles.groupTitle}>{ja ? '主な送付方法' : 'Primary options'}</h3>
        <div className={styles.grid}>{PRIMARY_WALLETS.map(renderWallet)}</div>
      </section>

      <details className={styles.additional}>
        <summary>{ja ? 'その他のネットワーク' : 'Additional networks'}</summary>
        <div className={styles.grid}>{ADDITIONAL_WALLETS.map(renderWallet)}</div>
      </details>
    </div>
  )
}
