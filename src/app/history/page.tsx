'use client'
import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { useStore, AGENTS } from '@/stores/useStore'
import { formatUSDC } from '@/types'
import { ExternalLink, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function HistoryPage() {
  const { isConnected } = useAccount()
  const { payments, clearPayments } = useStore()
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'failed'>('all')

  const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter)

  const totalVolume = payments.filter(p => p.status === 'confirmed').reduce((a, p) => a + p.amount, 0n)
  const totalFees   = payments.filter(p => p.status === 'confirmed').reduce((a, p) => a + p.fee, 0n)

  if (!isConnected) {
    return (
      <div className="min-h-screen"><Topbar />
        <div className="flex items-center justify-center min-h-screen"><ConnectButton /></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Topbar />
      <main className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <div className="pt-4 mb-8 flex items-start justify-between">
          <div>
            <div className="text-[10px] tracking-[0.3em] text-[#4a6a5a] mb-1">◈ TRANSACTION LOG</div>
            <h1 className="font-display font-bold text-xl tracking-widest arc-glow-text">PAYMENT HISTORY</h1>
          </div>
          {payments.length > 0 && (
            <button onClick={() => { clearPayments(); toast.success('History cleared') }}
              className="ghost-btn flex items-center gap-1.5 px-3 py-1.5 mt-4">
              <Trash2 size={11} /> CLEAR
            </button>
          )}
        </div>

        {/* Summary */}
        <div className="panel p-4 mb-6 grid grid-cols-3 gap-4">
          <div>
            <div className="text-[9px] tracking-widest text-[#2a4a3a] mb-1">TOTAL TRANSACTIONS</div>
            <div className="font-display font-bold arc-glow-text">{payments.length}</div>
          </div>
          <div>
            <div className="text-[9px] tracking-widest text-[#2a4a3a] mb-1">VOLUME PAID</div>
            <div className="font-display font-bold text-[#8abaa0]">{formatUSDC(totalVolume)} USDC</div>
          </div>
          <div>
            <div className="text-[9px] tracking-widest text-[#2a4a3a] mb-1">FEES PAID</div>
            <div className="font-display font-bold text-[#4a6a5a]">{formatUSDC(totalFees)} USDC</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {(['all', 'confirmed', 'pending', 'failed'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 text-[11px] tracking-wider font-mono border transition-colors
                ${filter === f
                  ? 'border-[#00ffa340] text-[#00ffa3] bg-[#00ffa310]'
                  : 'border-[#ffffff10] text-[#4a6a5a] hover:border-[#ffffff20]'}`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="panel p-16 text-center text-[#2a4a3a] text-xs font-mono">
            NO TRANSACTIONS FOUND
          </div>
        ) : (
          <div className="panel overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-2 border-b border-[#00ffa310] text-[9px] tracking-widest text-[#2a4a3a]">
              <span>STATUS</span>
              <span>AGENT / TX</span>
              <span>AMOUNT</span>
              <span>FEE</span>
              <span>TIME</span>
            </div>

            {filtered.map((p, i) => (
              <div key={p.id}
                className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-3 items-center
                  ${i < filtered.length - 1 ? 'border-b border-[#00ffa308]' : ''}
                  hover:bg-[#00ffa305] transition-colors`}
              >
                <span className={`dot dot-${p.status}`} />

                <div className="min-w-0">
                  <div className="text-[11px] font-mono text-[#8abaa0] font-medium">{p.agentName}</div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-[#2a4a3a] truncate">
                      {p.txHash.slice(0, 14)}...
                    </span>
                    <a href={`https://testnet.arcscan.app/tx/${p.txHash}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-[#2a4a3a] hover:text-[#00ffa3] transition-colors flex-shrink-0">
                      <ExternalLink size={9} />
                    </a>
                  </div>
                  {p.prompt && (
                    <div className="text-[10px] font-mono text-[#2a4a3a] truncate max-w-xs">
                      "{p.prompt.slice(0, 40)}{p.prompt.length > 40 ? '...' : ''}"
                    </div>
                  )}
                </div>

                <span className="text-[11px] font-mono arc-text text-right whitespace-nowrap">
                  {formatUSDC(p.amount)} USDC
                </span>

                <span className="text-[11px] font-mono text-[#4a6a5a] text-right whitespace-nowrap">
                  {formatUSDC(p.fee)}
                </span>

                <span className="text-[10px] font-mono text-[#2a4a3a] text-right whitespace-nowrap">
                  {formatDistanceToNow(p.timestamp, { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
