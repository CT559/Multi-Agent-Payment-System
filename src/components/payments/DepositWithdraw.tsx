'use client'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useCoordinator } from '@/hooks/useCoordinator'
import { parseUSDC } from '@/types'
import { toast } from 'sonner'

type Mode = 'deposit' | 'withdraw'

export function DepositWithdraw() {
  const [mode, setMode] = useState<Mode>('deposit')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const { deposit, withdraw, refetchAll, coordBalance, usdcBalance } = useCoordinator()

  async function handleSubmit() {
    const parsed = parseUSDC(amount)
    if (parsed === 0n) return toast.error('Enter a valid amount')

    if (mode === 'withdraw' && parsed > coordBalance) {
      return toast.error('Insufficient coordinator balance')
    }
    if (mode === 'deposit' && parsed > usdcBalance) {
      return toast.error('Insufficient wallet USDC')
    }

    try {
      setLoading(true)
      if (mode === 'deposit') {
        toast.loading('Depositing...', { id: 'tx' })
        await deposit(parsed)
        toast.success(`Deposited ${amount} USDC`, { id: 'tx' })
      } else {
        toast.loading('Withdrawing...', { id: 'tx' })
        await withdraw(parsed)
        toast.success(`Withdrawn ${amount} USDC`, { id: 'tx' })
      }
      setAmount('')
      refetchAll()
    } catch (e: any) {
      toast.error(e?.shortMessage || 'Transaction failed', { id: 'tx' })
    } finally { setLoading(false) }
  }

  return (
    <div className="panel p-5 space-y-4">
      <span className="text-[10px] tracking-[0.2em] text-[#4a6a5a]">◈ TRANSFER USDC</span>

      {/* Mode toggle */}
      <div className="flex border border-[#00ffa315]">
        {(['deposit', 'withdraw'] as Mode[]).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex-1 py-2 text-[11px] tracking-[0.1em] font-mono transition-colors
              ${mode === m
                ? 'bg-[#00ffa315] text-[#00ffa3]'
                : 'text-[#4a6a5a] hover:text-[#8abaa0]'}`}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Amount */}
      <div className="space-y-1">
        <div className="text-[10px] font-mono text-[#4a6a5a]">AMOUNT (USDC)</div>
        <div className="relative">
          <input
            value={amount} onChange={e => setAmount(e.target.value)}
            type="number" min="0" step="0.001" placeholder="0.000000"
            className="input-field w-full px-3 py-2.5 pr-16"
          />
          <button onClick={() => {
            const max = mode === 'deposit' ? usdcBalance : coordBalance
            setAmount((Number(max) / 1e6).toFixed(6))
          }} className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[#4a6a5a] hover:text-[#00ffa3] transition-colors px-1">
            MAX
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="text-[10px] font-mono text-[#2a4a3a] space-y-0.5">
        {mode === 'deposit' ? (
          <>
            <div>→ Funds locked in NanopayCoordinator</div>
            <div>→ Used for agent payments automatically</div>
          </>
        ) : (
          <>
            <div>→ Withdraws from coordinator to wallet</div>
            <div>→ Unused budget returned</div>
          </>
        )}
      </div>

      <button onClick={handleSubmit} disabled={!amount || loading}
        className="arc-btn w-full py-2.5 flex items-center justify-center gap-2 disabled:opacity-40">
        {loading && <Loader2 size={12} className="animate-spin" />}
        {loading ? 'PROCESSING...' : mode === 'deposit' ? '↓ DEPOSIT TO COORDINATOR' : '↑ WITHDRAW TO WALLET'}
      </button>
    </div>
  )
}
