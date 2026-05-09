import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Agent, BudgetAllocation, Payment } from '@/types'

// ── Seed agents ───────────────────────────────────────────────────────────────
export const AGENTS: Agent[] = [
  {
    id: 'agent-alpha',
    name: 'Alpha Analyst',
    description: 'Processes structured data, generates statistical summaries and anomaly reports.',
    address: '0x7b1E18906aE4A138BC8A92b0C4dD2038810015ca',
    pricePerCall: 10_000n,   // 0.01 USDC
    totalCalls: 1_420,
    totalEarned: 14_200_000n,
    status: 'active',
    category: 'Data Analysis',
    avatar: '🧠',
    tags: ['csv', 'json', 'statistics'],
  },
  {
    id: 'agent-beta',
    name: 'Beta Writer',
    description: 'Generates long-form content, product descriptions, and marketing copy.',
    address: '0xfdE5A29b33B50990e13c0E18F4BF6b9EacF76b85',
    pricePerCall: 5_000n,    // 0.005 USDC
    totalCalls: 3_870,
    totalEarned: 19_350_000n,
    status: 'active',
    category: 'Content',
    avatar: '✍️',
    tags: ['blog', 'seo', 'copywriting'],
  },
  {
    id: 'agent-gamma',
    name: 'Gamma Translator',
    description: 'Real-time translation across 50+ language pairs with domain awareness.',
    address: '0x3600000000000000000000000000000000000000',
    pricePerCall: 2_000n,    // 0.002 USDC
    totalCalls: 8_230,
    totalEarned: 16_460_000n,
    status: 'active',
    category: 'Translation',
    avatar: '🌐',
    tags: ['nlp', 'i18n', 'multilingual'],
  },
  {
    id: 'agent-delta',
    name: 'Delta Coder',
    description: 'Code review, security audits, and refactoring suggestions for 20+ languages.',
    address: '0x1804c8AB1F12E6bbf3894d4083f33e07309d1f38',
    pricePerCall: 20_000n,   // 0.02 USDC
    totalCalls: 540,
    totalEarned: 10_800_000n,
    status: 'paused',
    category: 'Code Review',
    avatar: '🔍',
    tags: ['solidity', 'python', 'audit'],
  },
]

// ── Store ─────────────────────────────────────────────────────────────────────
interface Store {
  budgets:     BudgetAllocation[]
  payments:    Payment[]
  // actions
  setBudget:   (agentId: string, allocated: bigint) => void
  removeBudget:(agentId: string) => void
  spendBudget: (agentId: string, amount: bigint) => void
  addPayment:  (p: Payment) => void
  clearPayments: () => void
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      budgets:  [],
      payments: [],

      setBudget(agentId, allocated) {
        const agent = AGENTS.find(a => a.id === agentId)
        if (!agent) return
        const maxCalls = Number(allocated / agent.pricePerCall)
        set(s => {
          const existing = s.budgets.find(b => b.agentId === agentId)
          if (existing) {
            return { budgets: s.budgets.map(b =>
              b.agentId === agentId
                ? { ...b, allocated, remaining: allocated - b.spent, maxCalls }
                : b
            )}
          }
          return { budgets: [...s.budgets, { agentId, allocated, spent: 0n, remaining: allocated, maxCalls, callsUsed: 0 }] }
        })
      },

      removeBudget(agentId) {
        set(s => ({ budgets: s.budgets.filter(b => b.agentId !== agentId) }))
      },

      spendBudget(agentId, amount) {
        set(s => ({
          budgets: s.budgets.map(b =>
            b.agentId === agentId
              ? { ...b, spent: b.spent + amount, remaining: b.remaining - amount, callsUsed: b.callsUsed + 1 }
              : b
          ),
        }))
      },

      addPayment(p) {
        set(s => ({ payments: [p, ...s.payments].slice(0, 200) }))
      },

      clearPayments() { set({ payments: [] }) },
    }),
    {
      name: 'nanopay-store',
      // BigInt serialization
      serialize:   (state) => JSON.stringify(state, (_, v) => typeof v === 'bigint' ? `__bigint__${v}` : v),
      deserialize: (str)   => JSON.parse(str, (_, v) =>
        typeof v === 'string' && v.startsWith('__bigint__') ? BigInt(v.slice(10)) : v
      ),
    }
  )
)
