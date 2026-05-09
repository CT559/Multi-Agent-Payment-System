'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { formatUSDC, COORDINATOR_ADDRESS, USDC_ADDRESS } from '@/types'
import { useReadContract } from 'wagmi'
import { COORDINATOR_ABI, arcTestnet } from '@/lib/chain'

const NAV = [
  { href: '/dashboard', label: 'DASHBOARD' },
  { href: '/budget',    label: 'BUDGET' },
  { href: '/agents',    label: 'AGENTS' },
  { href: '/history',   label: 'HISTORY' },
]

export function Topbar() {
  const path = usePathname()
  const { address, isConnected } = useAccount()

  const { data: coordBal } = useReadContract({
    address: COORDINATOR_ADDRESS,
    abi: COORDINATOR_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: arcTestnet.id,
    query: { enabled: !!address, refetchInterval: 10_000 },
  })

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#00ffa310] bg-[#03080d]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-6 h-6 border border-[#00ffa350] rotate-45 flex items-center justify-center group-hover:border-[#00ffa3] transition-colors">
              <div className="w-2 h-2 bg-[#00ffa3] rotate-0" />
            </div>
          </div>
          <span className="font-display font-bold text-sm tracking-[0.2em] arc-glow-text">
            NANOPAY
          </span>
          <span className="text-[10px] tracking-widest text-[#00ffa340] font-mono">
            v1.0 // ARC
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-0">
          {NAV.map(({ href, label }) => {
            const active = path.startsWith(href)
            return (
              <Link key={href} href={href}
                className={`px-4 h-14 flex items-center text-[11px] tracking-[0.15em] font-mono transition-colors border-b-2
                  ${active
                    ? 'text-[#00ffa3] border-[#00ffa3]'
                    : 'text-[#4a6a5a] border-transparent hover:text-[#00ffa380] hover:border-[#00ffa320]'
                  }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {isConnected && coordBal !== undefined && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-[#00ffa315] text-[11px] font-mono">
              <span className="dot dot-active" />
              <span className="text-[#4a6a5a]">COORD:</span>
              <span className="arc-text font-semibold">{formatUSDC(coordBal)} USDC</span>
            </div>
          )}
          <ConnectButton showBalance={false} chainStatus="icon" accountStatus="avatar" />
        </div>
      </div>
    </header>
  )
}
