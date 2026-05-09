'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Topbar } from '@/components/layout/Topbar'
import { useStore, AGENTS } from '@/stores/useStore'
import { useCoordinator } from '@/hooks/useCoordinator'
import { formatUSDC, parseUSDC } from '@/types'
import { Loader2, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function BudgetPage() {
  const { isConnected } = useAccount()
  const { budgets, setBudget, removeBudget } = useStore()
  const { coordBalance } = useCoordinator()
  const [editing, setEditing] = useState<string | null>(null)
  const [amounts, setAmounts] = useState<Record<string, string>>({})

  const totalAllocated = budgets.reduce((a, b) => a + b.allocated, 0n)
  const remaining = coordBalance - totalAllocated

  function handleSet(agentId: string) {
    const raw = amounts[agentId] || '0'
    const parsed = parseUSDC(raw)
    if (parsed === 0n) return toast.error('Enter a valid amount')
    if (parsed > remaining + (budgets.find(b => b.agentId === agentId)?.allocated ?? 0n)) {
      return toast.error('Exceeds available coordinator balance')
    }
    setBudget(agentId, parsed)
    toast.success(`Budget set: ${raw} USDC for ${AGENTS.find(a => a.id === agentId)?.name}`)
    setEditing(null)
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen">
        <Topbar />
        <div className="flex items-center justify-center min-h-screen">
          <ConnectButton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Topbar />
      <main className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <div className="pt-4 mb-8">
          <div className="text-[10px] tracking-[0.3em] text-[#4a6a5a] mb-1">◈ BUDGET MANAGEMENT</div>
          <h1 className="font-display font-bold text-xl tracking-widest arc-glow-text">
            ALLOCATE AGENT BUDGETS
          </h1>
        </div>

        {/* Summary bar */}
        <div className="panel p-4 mb-6 grid grid-cols-3 gap-4">
          <div>
            <div className="text-[9px] tracking-widest text-[#2a4a3a] mb-1">COORDINATOR BALANCE</div>
            <div className="font-display font-bold arc-glow-text">{formatUSDC(coordBalance)} <span className="text-xs text-[#4a6a5a]">USDC</span></div>
          </div>
          <div>
            <div className="text-[9px] tracking-widest text-[#2a4a3a] mb-1">TOTAL ALLOCATED</div>
            <div className="font-display font-bold text-[#ffaa00]">{formatUSDC(totalAllocated)} <span className="text-xs text-[#4a6a5a]">USDC</span></div>
          </div>
          <div>
            <div className="text-[9px] tracking-widest text-[#2a4a3a] mb-1">UNALLOCATED</div>
            <div className={`font-display font-bold ${remaining < 0n ? 'danger-text' : 'text-[#8abaa0]'}`}>
              {formatUSDC(remaining < 0n ? 0n : remaining)} <span className="text-xs text-[#4a6a5a]">USDC</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-track h-2 mb-8">
          <div className="progress-fill h-full"
            style={{ width: coordBalance > 0n ? `${Math.min(Number((totalAllocated * 100n) / coordBalance), 100)}%` : '0%' }} />
        </div>

        {/* Agent list */}
        <div className="space-y-3">
          {AGENTS.map((agent) => {
            const budget = budgets.find(b => b.agentId === agent.id)
            const isEditing = editing === agent.id
            const pct = budget && budget.allocated > 0n
              ? Number((budget.spent * 100n) / budget.allocated) : 0

            return (
              <motion.div key={agent.id} layout className="panel p-5">
                <div className="flex items-start gap-4">
                  {/* Avatar + info */}
                  <div className="text-2xl flex-shrink-0">{agent.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-[#8abaa0] font-medium">{agent.name}</span>
                      <span className={`dot dot-${agent.status}`} />
                      <span className="tag">{agent.category}</span>
                    </div>
                    <div className="text-[11px] font-mono text-[#4a6a5a] mb-2">{agent.description}</div>
                    <div className="text-[10px] font-mono text-[#2a4a3a]">
                      PRICE: <span className="arc-text">{formatUSDC(agent.pricePerCall)} USDC/call</span>
                    </div>
                  </div>

                  {/* Budget info */}
                  <div className="text-right flex-shrink-0 min-w-[140px]">
                    {budget ? (
                      <>
                        <div className="text-[10px] text-[#4a6a5a] mb-0.5">ALLOCATED</div>
                        <div className="font-mono font-bold arc-text">{formatUSDC(budget.allocated)}</div>
                        <div className="text-[10px] font-mono text-[#4a6a5a]">
                          {budget.callsUsed}/{budget.maxCalls} CALLS
                        </div>
                      </>
                    ) : (
                      <div className="text-[10px] font-mono text-[#2a4a3a]">NO BUDGET SET</div>
                    )}
                  </div>
                </div>

                {/* Progress */}
                {budget && (
                  <div className="mt-3 space-y-1">
                    <div className="progress-track h-1">
                      <div className="progress-fill h-full" style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-[#2a4a3a]">
                      <span>SPENT: {formatUSDC(budget.spent)} USDC</span>
                      <span>REMAINING: {formatUSDC(budget.remaining)} USDC</span>
                    </div>
                  </div>
                )}

                {/* Edit form */}
                <AnimatePresence>
                  {isEditing && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }} className="mt-4 pt-4 border-t border-[#00ffa310]">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <div className="text-[10px] font-mono text-[#4a6a5a] mb-1">
                            BUDGET AMOUNT (USDC) — MAX CALLS: {amounts[agent.id]
                              ? Math.floor(parseFloat(amounts[agent.id] || '0') * 1e6 / Number(agent.pricePerCall))
                              : 0}
                          </div>
                          <input
                            value={amounts[agent.id] || ''}
                            onChange={e => setAmounts(p => ({ ...p, [agent.id]: e.target.value }))}
                            type="number" min="0" step="0.001" placeholder="0.000"
                            className="input-field w-full px-3 py-2"
                            autoFocus
                          />
                        </div>
                        <div className="flex flex-col gap-2 pt-5">
                          <button onClick={() => handleSet(agent.id)}
                            className="arc-btn px-4 py-2">SET</button>
                          <button onClick={() => setEditing(null)}
                            className="ghost-btn px-4 py-2">CANCEL</button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                {!isEditing && (
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => {
                      setEditing(agent.id)
                      if (budget) setAmounts(p => ({ ...p, [agent.id]: (Number(budget.allocated) / 1e6).toFixed(6) }))
                    }}
                      className="arc-btn px-3 py-1.5 flex items-center gap-1.5">
                      <Plus size={11} />
                      {budget ? 'EDIT BUDGET' : 'SET BUDGET'}
                    </button>
                    {budget && (
                      <button onClick={() => { removeBudget(agent.id); toast.success('Budget removed') }}
                        className="ghost-btn px-3 py-1.5 flex items-center gap-1.5">
                        <Trash2 size={11} /> REMOVE
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
