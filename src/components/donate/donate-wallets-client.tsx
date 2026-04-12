'use client'

import { useState } from 'react'

type WalletItem = {
  id: string
  asset: string
  network: string
  address: string
}

const WALLETS: WalletItem[] = [
  { id: 'btc', asset: 'BTC', network: 'Bitcoin', address: 'bc1qdzxgxg6qt0sjceercxhfngq47qyr2gyqdpd7tj' },
  { id: 'eth', asset: 'ETH', network: 'ERC-20', address: '0x64afa8201ab478573243a852251d46abe124acd1' },
  { id: 'usdt', asset: 'USDT', network: 'ERC-20', address: '0x64afa8201ab478573243a852251d46abe124acd1' },
  { id: 'usdc', asset: 'USDC', network: 'ERC-20', address: '0x64afa8201ab478573243a852251d46abe124acd1' },
  { id: 'sol', asset: 'SOL', network: 'Solana', address: 'FsymgjzjxKyEZQeJDuAcDd8fyX7Ny7yxzZX9UKvCzfen' },
  { id: 'bnb', asset: 'BNB', network: 'BEP-20', address: '0x64afa8201ab478573243a852251d46abe124acd1' },
  { id: 'doge', asset: 'DOGE', network: 'Dogecoin', address: 'DLThxkLh5skugJnofdm5WRARadX83x4Zmz' },
  { id: 'avax', asset: 'AVAX', network: 'Avalanche C-Chain', address: '0x64afa8201ab478573243a852251d46abe124acd1' },
  { id: 'xrp', asset: 'XRP', network: 'XRPL', address: 'rfNBaSjUQ8r7vCR2aMJKYVG3gNKiQ2Q9uh' },
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

export default function DonateWalletsClient() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = async (id: string, address: string) => {
    try {
      await copyText(address)
      setCopiedId(id)
      window.setTimeout(() => {
        setCopiedId((current) => (current === id ? null : current))
      }, 1600)
    } catch {
      setCopiedId(null)
    }
  }

  return (
    <div className="donate-wallet-grid">
      {WALLETS.map((wallet) => (
        <article className="donate-wallet-card" key={wallet.id}>
          <div className="donate-wallet-top">
            <div className="donate-wallet-copy">
              <div className="donate-wallet-asset">{wallet.asset}</div>
              <div className="donate-wallet-network">{wallet.network}</div>
            </div>

            <div className="donate-wallet-copy">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => void handleCopy(wallet.id, wallet.address)}
              >
                {copiedId === wallet.id ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <code className="donate-address">{wallet.address}</code>
        </article>
      ))}
    </div>
  )
}
