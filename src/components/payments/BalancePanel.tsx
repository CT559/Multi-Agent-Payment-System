'use client'
import { useCoordinator } from '@/hooks/useCoordinator'
import { formatUSDC, COORDINATOR_ADDRESS } from '@/types'
import { ExternalLink } from 'lucide-react'

export function BalancePanel() {
  const { coordBalance, usdcBalance, feeBps } = useCoordinator()

  return (
    <div className="panel p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-[0.2em] text-[#4a6a5a]">◈ BALANCES</span>
        <a href={`https://testnet.arcscan.app/address/${COORDINATOR_ADDRESS}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] text-[#2a4a3a] hover:text-[#00ffa360] transition-colors">
          CONTRACT <ExternalLink size={10} />
        </a>
      </div>

      {/* Coordinator balance */}
      <div className="space-y-1">
        <div className="text-[10px] font-mono text-[#4a6a5a]">COORDINATOR BALANCE</div>
        <div className="flex items-baseline gap-2">
          <span className="font-display font-bold text-3xl arc-glow-text tracking-tight">
            {formatUSDC(coordBalance)}
          </span>
          <span className="text-xs text-[#4a6a5a]">USDC</span>
        </div>
        <div className="flow-line" />
      </div>

      {/* Wallet balance */}
      <div className="space-y-1">
        <div className="text-[10px] font-mono text-[#4a6a5a]">WALLET BALANCE</div>
        <div className="flex items-baseline gap-2">
          <span className="font-display font-bold text-xl text-[#8abaa0] tracking-tight">
            {formatUSDC(usdcBalance)}
          </span>
          <span className="text-xs text-[#4a6a5a]">USDC</span>
        </div>
      </div>

      <hr className="divider" />

      {/* Fee info */}
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span className="text-[#4a6a5a]">PROTOCOL FEE</span>
        <span className="arc-text">{Number(feeBps) / 100}%</span>
      </div>
    </div>
  )
}
