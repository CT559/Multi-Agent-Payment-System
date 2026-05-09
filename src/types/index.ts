// ── Chain / Contract ──────────────────────────────────────────────────────────
export const COORDINATOR_ADDRESS = '0xfdE5A29b33B50990e13c0E18F4BF6b9EacF76b85' as `0x${string}`
export const USDC_ADDRESS        = '0x3600000000000000000000000000000000000000' as `0x${string}`
export const USDC_DECIMALS       = 6
export const CHAIN_ID            = 5042002

export function formatUSDC(raw: bigint, decimals = 6): string {
  const n = Number(raw) / 10 ** decimals
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })
}

export function parseUSDC(amount: string): bigint {
  return BigInt(Math.round(parseFloat(amount || '0') * 10 ** USDC_DECIMALS))
}

// ── Agent ─────────────────────────────────────────────────────────────────────
export type AgentStatus = 'active' | 'paused' | 'idle' | 'error'

export interface Agent {
  id:           string
  name:         string
  description:  string
  address:      `0x${string}`    // wallet that receives payments
  pricePerCall: bigint           // USDC (6 dec)
  totalCalls:   number
  totalEarned:  bigint
  status:       AgentStatus
  category:     string
  avatar:       string
  tags:         string[]
}

// ── Budget allocation ─────────────────────────────────────────────────────────
export interface BudgetAllocation {
  agentId:   string
  allocated: bigint              // USDC allocated to this agent
  spent:     bigint              // USDC spent so far
  remaining: bigint
  maxCalls:  number              // derived from allocated / pricePerCall
  callsUsed: number
}

// ── Payment / Tx ──────────────────────────────────────────────────────────────
export type TxStatus = 'pending' | 'confirmed' | 'failed'

export interface Payment {
  id:          string
  txHash:      `0x${string}`
  from:        `0x${string}`
  to:          `0x${string}`
  agentId:     string
  agentName:   string
  amount:      bigint            // net (after fee)
  fee:         bigint
  blockNumber: number
  timestamp:   number
  status:      TxStatus
  prompt?:     string
  result?:     string
}

// ── Store slices ──────────────────────────────────────────────────────────────
export interface AgentStore {
  agents:       Agent[]
  budgets:      BudgetAllocation[]
  payments:     Payment[]
  addPayment:   (p: Payment) => void
  setBudget:    (agentId: string, allocated: bigint) => void
  spendBudget:  (agentId: string, amount: bigint) => void
}
