'use client'
import { useStore, AGENTS } from '@/stores/useStore'
import { formatUSDC } from '@/types'

export function SystemStats() {
  const { payments, budgets } = useStore()

  const totalVolume   = payments.reduce((a, p) => a + p.amount, 0n)
  const totalBudget   = budgets.reduce((a, b) => a + b.allocated, 0n)
  const totalSpent    = budgets.reduce((a, b) => a + b.spent, 0n)
  const activeAgents  = AGENTS.filter(a => a.status === 'active').length
  const confirmedTxs  = payments.filter(p => p.status === 'confirmed').length

  const stats = [
    { label: 'TOTAL VOLUME',   value: `${formatUSDC(totalVolume)} USDC`, accent: true },
    { label: 'BUDGET ALLOCATED', value: `${formatUSDC(totalBudget)} USDC`, accent: false },
    { label: 'TOTAL SPENT',    value: `${formatUSDC(totalSpent)} USDC`, accent: false },
    { label: 'ACTIVE AGENTS',  value: `${activeAgents} / ${AGENTS.length}`, accent: true },
    { label: 'CONFIRMED TXS',  value: confirmedTxs.toString(), accent: false },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
      {stats.map(({ label, value, accent }) => (
        <div key={label} className="panel p-3">
          <div className="text-[9px] tracking-[0.2em] text-[#2a4a3a] mb-1">{label}</div>
          <div className={`font-display font-bold text-sm tracking-wide ${accent ? 'arc-glow-text' : 'text-[#8abaa0]'}`}>
            {value}
          </div>
        </div>
      ))}
    </div>
  )
}
