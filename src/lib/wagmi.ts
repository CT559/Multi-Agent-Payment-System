'use client'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { arcTestnet } from './chain'

export const wagmiConfig = getDefaultConfig({
  appName: 'Nanopay Multi-Agent System',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? 'demo',
  chains: [arcTestnet],
  ssr: true,
})
