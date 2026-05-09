'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Topbar } from '@/components/layout/Topbar'
import { BalancePanel } from '@/components/payments/BalancePanel'
import { DepositWithdraw } from '@/components/payments/DepositWithdraw'
import { SystemStats } from '@/components/payments/SystemStats'
import { RecentActivity } from '@/components/payments/RecentActivity'
import { BudgetOverview } from '@/components/budget/BudgetOverview'

export default function DashboardPage() {
  const { isConnected, address } = useAccount()

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col">
        <Topbar />
        <div className="flex-1 flex items-center justify-center pt-14">
          <div className="text-center space-y-6">
            <div className="inline-block">
              <div className="w-16 h-16 border border-[#00ffa325] rotate-45 mx-auto flex items-center justify-center">
                <div className="w-6 h-6 bg-[#00ffa310] border border-[#00ffa340] rotate-0" />
              </div>
            </div>
            <div>
              <div className="arc-glow-text font-display text-2xl font-bold tracking-widest mb-2">
                NANOPAY SYSTEM
              </div>
              <div className="text-[#4a6a5a] text-xs tracking-wider font-mono mb-6">
                CONNECT WALLET TO ACCESS MULTI-AGENT PAYMENT NETWORK
              </div>
            </div>
            <ConnectButton />
            <div className="text-[10px] font-mono text-[#2a4a3a] tracking-widest">
              ARC TESTNET // CHAIN ID 5042002 // USDC MICROPAYMENTS
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Topbar />
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-4">
          <div>
            <div className="text-[10px] font-mono text-[#4a6a5a] tracking-[0.3em] mb-1">
              ◈ SYSTEM DASHBOARD
            </div>
            <h1 className="font-display font-bold text-xl tracking-widest arc-glow-text">
              AGENT PAYMENT NETWORK
            </h1>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono text-[#2a4a3a]">OPERATOR</div>
            <div className="text-xs font-mono text-[#00ffa360]">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <SystemStats />

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-4 mt-4">
          {/* Left col */}
          <div className="space-y-4">
            <BalancePanel />
            <DepositWithdraw />
          </div>

          {/* Center + Right */}
          <div className="lg:col-span-2 space-y-4">
            <BudgetOverview compact />
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  )
}
