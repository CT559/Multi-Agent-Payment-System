'use client'
import { useStore } from '@/stores/useStore'
import { formatUSDC } from '@/types'
import { ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export function RecentActivity({ limit = 8 }: { limit?: number }) {
  const { payments } = useStore()
  const recent = payments.slice(0, limit)

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] tracking-[0.2em] text-[#4a6a5a]">◈ RECENT PAYMENTS</span>
        <span className="text-[10px] font-mono text-[#2a4a3a]">{payments.length} TOTAL</span>
      </div>

      {recent.length === 0 ? (
        <div className="text-center py-8 text-[#2a4a3a] text-xs font-mono">
          NO TRANSACTIONS YET<br />
          <span className="text-[10px]">INVOKE AN AGENT TO SEE PAYMENTS HERE</span>
        </div>
      ) : (
        <div className="space-y-1">
          {recent.map(p => (
            <div key={p.id} className="flex items-center gap-3 py-2 px-2 hover:bg-[#00ffa308] transition-colors rounded-sm group">
              <span className={`dot dot-${p.status}`} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#8abaa0] truncate">{p.agentName}</span>
                  <span className="text-[10px] text-[#2a4a3a]">
                    {formatDistanceToNow(p.timestamp, { addSuffix: true })}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-[#4a6a5a] truncate">
                  {p.from.slice(0, 6)}...{p.from.slice(-4)} → {p.to.slice(0, 6)}...{p.to.slice(-4)}
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-[11px] font-mono arc-text">{formatUSDC(p.amount)} USDC</div>
                <div className="text-[9px] text-[#2a4a3a]">+fee {formatUSDC(p.fee)}</div>
              </div>

              <a href={`https://testnet.arcscan.app/tx/${p.txHash}`}
                target="_blank" rel="noopener noreferrer"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-[#4a6a5a] hover:text-[#00ffa3]">
                <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
