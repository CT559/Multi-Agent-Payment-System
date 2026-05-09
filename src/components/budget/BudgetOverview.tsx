'use client'
import Link from 'next/link'
import { useStore, AGENTS } from '@/stores/useStore'
import { formatUSDC } from '@/types'

export function BudgetOverview({ compact = false }: { compact?: boolean }) {
  const { budgets } = useStore()

  const allocatedAgents = budgets.filter(b => b.allocated > 0n)

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] tracking-[0.2em] text-[#4a6a5a]">◈ BUDGET ALLOCATION</span>
        <Link href="/budget" className="text-[10px] font-mono text-[#00ffa340] hover:text-[#00ffa3] transition-colors">
          MANAGE →
        </Link>
      </div>

      {allocatedAgents.length === 0 ? (
        <div className="text-center py-6 text-[#2a4a3a] text-xs font-mono">
          NO BUDGETS ALLOCATED<br />
          <Link href="/budget" className="text-[#00ffa340] hover:text-[#00ffa3] transition-colors text-[10px]">
            → ALLOCATE BUDGET TO AGENTS
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {allocatedAgents.slice(0, compact ? 3 : 10).map(b => {
            const agent = AGENTS.find(a => a.id === b.agentId)
            if (!agent) return null
            const pct = b.allocated > 0n ? Number((b.spent * 100n) / b.allocated) : 0
            return (
              <div key={b.agentId} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{agent.avatar}</span>
                    <span className="text-[11px] font-mono text-[#8abaa0]">{agent.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-mono arc-text">{formatUSDC(b.spent)}</span>
                    <span className="text-[11px] font-mono text-[#4a6a5a]"> / {formatUSDC(b.allocated)}</span>
                  </div>
                </div>
                <div className="progress-track h-1">
                  <div className="progress-fill h-full" style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-[#2a4a3a]">
                  <span>{b.callsUsed} / {b.maxCalls} CALLS</span>
                  <span>{pct.toFixed(0)}% USED</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
