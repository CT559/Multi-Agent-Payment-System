'use client'
import { useReadContract, useWriteContract, useAccount } from 'wagmi'
import { COORDINATOR_ADDRESS, USDC_ADDRESS } from '@/types'
import { COORDINATOR_ABI, ERC20_ABI, arcTestnet } from '@/lib/chain'
import { toast } from 'sonner'

export function useCoordinator() {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()

  // ── Reads ─────────────────────────────────────────────────────────────────
  const { data: coordBalance, refetch: refetchCoord } = useReadContract({
    address: COORDINATOR_ADDRESS,
    abi: COORDINATOR_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: arcTestnet.id,
    query: { enabled: !!address, refetchInterval: 10_000 },
  })

  const { data: usdcBalance, refetch: refetchUsdc } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: arcTestnet.id,
    query: { enabled: !!address, refetchInterval: 10_000 },
  })

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, COORDINATOR_ADDRESS] : undefined,
    chainId: arcTestnet.id,
    query: { enabled: !!address },
  })

  const { data: feeBps } = useReadContract({
    address: COORDINATOR_ADDRESS,
    abi: COORDINATOR_ABI,
    functionName: 'feeBps',
    chainId: arcTestnet.id,
  })

  function refetchAll() { refetchCoord(); refetchUsdc(); refetchAllowance() }

  // ── Writes ────────────────────────────────────────────────────────────────
  async function approve(amount: bigint) {
    return writeContractAsync({
      address: USDC_ADDRESS, abi: ERC20_ABI,
      functionName: 'approve',
      args: [COORDINATOR_ADDRESS, amount],
      chainId: arcTestnet.id,
    })
  }

  async function deposit(amount: bigint) {
    if ((allowance ?? 0n) < amount) {
      toast.loading('Approving USDC...', { id: 'approve' })
      await approve(amount * 100n)
      toast.dismiss('approve')
    }
    return writeContractAsync({
      address: COORDINATOR_ADDRESS, abi: COORDINATOR_ABI,
      functionName: 'deposit',
      args: [amount],
      chainId: arcTestnet.id,
    })
  }

  async function withdraw(amount: bigint) {
    return writeContractAsync({
      address: COORDINATOR_ADDRESS, abi: COORDINATOR_ABI,
      functionName: 'withdraw',
      args: [amount],
      chainId: arcTestnet.id,
    })
  }

  async function pay(recipient: `0x${string}`, amount: bigint) {
    // Auto-deposit if coordinator balance insufficient
    const bal = coordBalance ?? 0n
    if (bal < amount) {
      const needed = amount - bal
      await deposit(needed)
    }
    return writeContractAsync({
      address: COORDINATOR_ADDRESS, abi: COORDINATOR_ABI,
      functionName: 'pay',
      args: [recipient, amount],
      chainId: arcTestnet.id,
    })
  }

  return {
    coordBalance: coordBalance ?? 0n,
    usdcBalance:  usdcBalance  ?? 0n,
    allowance:    allowance    ?? 0n,
    feeBps:       feeBps       ?? 10n,
    refetchAll,
    deposit,
    withdraw,
    pay,
  }
}
