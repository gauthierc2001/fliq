'use client'

import React, { useMemo } from 'react'
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css'

interface WalletProviderProps {
  children: React.ReactNode
}

export default function WalletProvider({ children }: WalletProviderProps) {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta'
  const endpoint = useMemo(() => clusterApiUrl(network as 'mainnet-beta' | 'testnet' | 'devnet'), [network])

  // Use empty wallets array to rely on Wallet Standard (auto-detects installed wallets)
  const wallets = useMemo(() => [], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
}
