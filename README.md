# NANOPAY // Multi-Agent Payment System — Phase 1

Terminal-aesthetic dApp for autonomous AI agent micropayments on Arc Testnet.

## Architecture

```
User Wallet (MetaMask)
  └─ USDC → NanopayCoordinator (0xfdE5A29b...)
       ├─ Budget Manager (UI) → allocates USDC per agent
       ├─ Agent Alpha   ← executePayment() → 0.01 USDC/call
       ├─ Agent Beta    ← executePayment() → 0.005 USDC/call
       ├─ Agent Gamma   ← executePayment() → 0.002 USDC/call
       └─ Agent Delta   ← executePayment() → 0.02 USDC/call
```

## Phase 1 Features (này)
- ✅ Wallet Connect (RainbowKit + wagmi v2)
- ✅ Deposit USDC → NanopayCoordinator
- ✅ Allocate budget per agent (with call limit tracking)
- ✅ executePayment() = pay() on-chain → invoke agent API
- ✅ Transaction history với real tx hash
- ✅ Budget progress bars (spent/remaining/calls)
- ✅ Withdraw từ coordinator về wallet

## Phase 2 (tiếp theo)
- Real-time event listener (viem watchContractEvent)
- Auto-refresh khi có PaymentSent event
- Cron scheduler cho recurring payments

## Phase 3
- Agent Registry (on-chain)
- Agent marketplace + thuê agents

---

## Deploy Vercel

### 1. Lấy WalletConnect ID
https://cloud.walletconnect.com → New Project → Copy ID

### 2. Push GitHub
```bash
cd nanopay-v2
git init && git add . && git commit -m "feat: nanopay phase 1"
git remote add origin https://github.com/<you>/nanopay-system.git
git push -u origin main
```

### 3. Import Vercel
- https://vercel.com/new → Import repo
- Environment Variables:
  ```
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID = <your_id>
  ```
- Deploy → ~2 min → Done ✅

---

## Chạy local
```bash
npm install
cp .env.example .env.local
# Điền NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
npm run dev
# → http://localhost:3000
```

## Contract
- **NanopayCoordinator:** `0xfdE5A29b33B50990e13c0E18F4BF6b9EacF76b85`
- **USDC (Arc system):**  `0x3600000000000000000000000000000000000000`
- **Chain:** Arc Testnet (ID: 5042002)
- **Explorer:** https://testnet.arcscan.app
