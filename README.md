# ONLOOP（恩ループ）

**Pay-it-forward protocol built on Base blockchain.**

恩送りが繋がり、ループして、みんなに戻ってくる。

[![Built on Base](https://img.shields.io/badge/Built%20on-Base-0052FF?style=flat&logo=ethereum)](https://base.org)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## What is ONLOOP?

ONLOOP is a social protocol where acts of kindness — not money — flow between people and are recorded permanently on the Base blockchain.

**No financial exchange. Just goodwill.**

- A photographer offers to take someone's portrait
- A strategist helps a small sake brewery launch a new product
- A cook makes a meal for a neighbor

Each act of kindness creates an **onchain chain**. The longer the chain grows, the more ON tokens everyone earns. When the chain loops back to its origin, a **loop completion bonus** is distributed to all participants.

---

## How It Works

```
A → gives kindness → B → passes it forward → C → ... → loops back → A
                                                          🎉 Loop Complete!
```

### ON Token Rewards

| Role | Reward per hop |
|------|---------------|
| 🌱 Origin (chain starter) | +5 ON |
| 🔗 Relay (passed it forward) | +2 ON |
| 🤝 New recipient | +1 ON |

**Loop completion bonus**: Everyone earns `N × 5 ON` (origin earns `N × 10 ON`) where N = loop size.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 + TypeScript + Tailwind v4 |
| UI Components | shadcn/ui (@base-ui/react) |
| Blockchain | Base (Sepolia testnet → Mainnet) |
| Wallet | OnchainKit + wagmi v2 + Coinbase Smart Wallet |
| Database | Neon (Postgres) + Drizzle ORM |
| Visualization | React Flow |

---

## Features

- **Provider Menu** — Browse approved givers (viewable without a wallet)
- **Kindness Chains** — Send and receive acts of kindness, recorded onchain
- **Chain Visualization** — See your kindness spread as an interactive graph
- **ON Token Rewards** — Earn tokens for every hop in a chain
- **Loop Detection** — Automatic bonus when a chain completes a full circle
- **Admin Panel** — Curated provider approval to maintain quality
- **Smart Wallet Support** — No seed phrase required for new users

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) database
- A [Coinbase Developer Platform](https://portal.cdp.coinbase.com/) API key

### Installation

```bash
git clone https://github.com/SRKTK56/onloop.git
cd onloop
npm install
cp .env.example .env.local
# Fill in your DATABASE_URL and NEXT_PUBLIC_ONCHAINKIT_API_KEY
npm run db:push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

```env
DATABASE_URL=                        # Neon PostgreSQL connection string
NEXT_PUBLIC_ONCHAINKIT_API_KEY=      # Coinbase Developer Platform API key
ADMIN_SECRET=                        # Secret for /admin routes
NEXT_PUBLIC_USE_MAINNET=false        # Set "true" for Base mainnet
```

---

## Why Base?

- **Near-zero gas fees** — Makes micropayment-style reward distribution viable
- **Coinbase Smart Wallet** — Onboards non-crypto users with no seed phrase
- **Consumer-first** — Aligns with Base's mission to bring 1B users onchain
- **EAS support** — Future: Ethereum Attestation Service for verified kindness

---

## Roadmap

- [x] MVP: Provider menu, chain recording, ON token rewards
- [ ] Base Mainnet deployment + Coinbase Smart Wallet
- [ ] EAS integration for onchain kindness verification
- [ ] ON token as ERC-20 smart contract
- [ ] Loop detection with smart contract reward distribution
- [ ] Mobile PWA

---

## Contributing

Built with ❤️ in Japan. Open an issue or PR — contributions welcome.

---

## License

MIT
