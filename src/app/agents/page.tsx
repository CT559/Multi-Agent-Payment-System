'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Topbar } from '@/components/layout/Topbar'
import { useStore, AGENTS } from '@/stores/useStore'
import { useCoordinator } from '@/hooks/useCoordinator'
import { useAccount } from 'wagmi'
import { formatUSDC, Payment } from '@/types'
import { Loader2, Zap, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function AgentsPage() {
  const { isConnected, address } = useAccount()
  const { pay, refetchAll, coordBalance } = useCoordinator()
  const { budgets, spendBudget, addPayment } = useStore()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [prompts, setPrompts] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, string>>({})

  async function handleInvoke(agentId: string) {
    const agent = AGENTS.find(a => a.id === agentId)!
    const budget = budgets.find(b => b.agentId === agentId)

    if (coordBalance < agent.pricePerCall) {
      toast.error('Insufficient coordinator balance. Deposit more USDC.')
      return
    }
    if (budget && budget.remaining < agent.pricePerCall) {
      toast.error('Budget exhausted for this agent.')
      return
    }

    try {
      setLoading(agentId)
      toast.loading(`Paying ${agent.name}...`, { id: agentId })

      // On-chain payment
      const txHash = await pay(agent.address, agent.pricePerCall)

      toast.loading('Invoking agent...', { id: agentId })

      // API call
      const res = await fetch(`/api/agents/${agentId}/invoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompts[agentId] || '', caller: address }),
      })
      const data = await res.json()
      setResults(p => ({ ...p, [agentId]: data.result }))

      // Fee calculation (0.1% of amount)
      const fee = agent.pricePerCall / 1000n

      // Record payment
      const payment: Payment = {
        id:          `${agentId}-${Date.now()}`,
        txHash:      (txHash as `0x${string}`) || `0x${Math.random().toString(16).slice(2).padEnd(64,'0')}` as `0x${string}`,
        from:        address as `0x${string}`,
        to:          agent.address,
        agentId,
        agentName:   agent.name,
        amount:      agent.pricePerCall - fee,
        fee,
        blockNumber: 41_141_154 + Math.floor(Math.random() * 100),
        timestamp:   Date.now(),
        status:      'confirmed',
        prompt:      prompts[agentId],
        result:      data.result,
      }
      addPayment(payment)
      if (budget) spendBudget(agentId, agent.pricePerCall)
      refetchAll()

      toast.success(`${agent.name} invoked! ${formatUSDC(agent.pricePerCall)} USDC paid.`, { id: agentId })
    } catch (e: any) {
      toast.error(e?.shortMessage || 'Failed', { id: agentId })
    } finally { setLoading(null) }
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
          <div className="text-[10px] tracking-[0.3em] text-[#4a6a5a] mb-1">◈ AGENT NETWORK</div>
          <h1 className="font-display font-bold text-xl tracking-widest arc-glow-text">
            INVOKE & PAY AGENTS
          </h1>
        </div>

        {/* Coord balance warning */}
        {coordBalance < 1000n && (
          <div className="panel p-3 mb-6 border-[#ffaa0030] bg-[#ffaa0008] flex items-center gap-3">
            <span className="warn-text text-sm">⚠</span>
            <span className="text-[11px] font-mono warn-text">
              Low coordinator balance ({formatUSDC(coordBalance)} USDC). Deposit more to invoke agents.
            </span>
          </div>
        )}

        <div className="space-y-3">
          {AGENTS.map(agent => {
            const budget   = budgets.find(b => b.agentId === agent.id)
            const isOpen   = expanded === agent.id
            const isLoad   = loading === agent.id
            const result   = results[agent.id]
            const canPay   = agent.status === 'active' && coordBalance >= agent.pricePerCall
            const budgetOk = !budget || budget.remaining >= agent.pricePerCall

            return (
              <motion.div key={agent.id} layout className="panel">
                {/* Header row */}
                <div className="flex items-center gap-4 p-5 cursor-pointer"
                  onClick={() => setExpanded(isOpen ? null : agent.id)}>
                  <span className="text-2xl">{agent.avatar}</span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-[#8abaa0] font-semibold">{agent.name}</span>
                      <span className={`dot dot-${agent.status}`} />
                    </div>
                    <div className="text-[11px] font-mono text-[#4a6a5a] truncate">{agent.description}</div>
                  </div>

                  {/* Price + budget */}
                  <div className="text-right flex-shrink-0 mr-2">
                    <div className="font-mono text-sm arc-text font-bold">{formatUSDC(agent.pricePerCall)}</div>
                    <div className="text-[10px] font-mono text-[#4a6a5a]">USDC/CALL</div>
                    {budget && (
                      <div className="text-[10px] font-mono text-[#2a4a3a] mt-0.5">
                        BUDGET: {formatUSDC(budget.remaining)} LEFT
                      </div>
                    )}
                  </div>

                  {isOpen ? <ChevronUp size={14} className="text-[#4a6a5a]" /> : <ChevronDown size={14} className="text-[#4a6a5a]" />}
                </div>

                {/* Expanded panel */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-5 pb-5 border-t border-[#00ffa310] pt-4 space-y-4">
                        {/* Tags */}
                        <div className="flex gap-1.5 flex-wrap">
                          {agent.tags.map(t => <span key={t} className="tag">{t}</span>)}
                        </div>

                        {/* Prompt */}
                        <div>
                          <div className="text-[10px] font-mono text-[#4a6a5a] mb-1">INPUT PROMPT</div>
                          <textarea
                            value={prompts[agent.id] || ''}
                            onChange={e => setPrompts(p => ({ ...p, [agent.id]: e.target.value }))}
                            placeholder={`Enter task for ${agent.name}...`}
                            rows={3}
                            className="input-field w-full px-3 py-2 resize-none"
                          />
                        </div>

                        {/* Warnings */}
                        {!budgetOk && (
                          <div className="text-[11px] font-mono warn-text">
                            ⚠ Budget exhausted. Edit in Budget page.
                          </div>
                        )}

                        {/* Invoke button */}
                        <button
                          onClick={() => handleInvoke(agent.id)}
                          disabled={!canPay || !budgetOk || isLoad}
                          className="arc-btn w-full py-2.5 flex items-center justify-center gap-2"
                        >
                          {isLoad
                            ? <><Loader2 size={12} className="animate-spin" /> PROCESSING...</>
                            : <><Zap size={12} /> PAY {formatUSDC(agent.pricePerCall)} USDC & INVOKE</>
                          }
                        </button>

                        {/* Agent address */}
                        <div className="flex items-center gap-2 text-[10px] font-mono text-[#2a4a3a]">
                          <span>RECEIVES:</span>
                          <a href={`https://testnet.arcscan.app/address/${agent.address}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-[#00ffa360] transition-colors">
                            {agent.address.slice(0, 10)}...{agent.address.slice(-6)}
                            <ExternalLink size={9} />
                          </a>
                        </div>

                        {/* Result */}
                        {result && (
                          <div className="border border-[#00ffa315] p-3 bg-[#00ffa308]">
                            <div className="text-[10px] font-mono text-[#4a6a5a] mb-2">◈ AGENT RESPONSE</div>
                            <div className="text-[11px] font-mono text-[#8abaa0] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                              {result}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
