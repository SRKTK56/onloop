# ONLOOP — Base Grant Application

## Project Overview

**Project Name:** ONLOOP  
**Website:** https://onloop-one.vercel.app  
**GitHub:** https://github.com/SRKTK56/onloop (public)  
**Farcaster:** @onloop  
**Category:** Social / Public Goods  
**Stage:** MVP (Shipped — Live on Base Mainnet)  
**Funding Requested:** 5 ETH (Builder Grants — retroactive for shipped projects)  
**Wallet Address (grant receipt):** onloop.base.eth (`0x67e596177787328d2C17f75eEb233127d85Bd69e`)  
**Application:** https://paragraph.com/@grants.base.eth/calling-based-builders

---

## One-Line Description

ONLOOP is a pay-it-forward protocol on Base that turns non-monetary acts of kindness into verifiable on-chain events, rewarding participants with ON tokens and NFTs.

---

## Problem Statement

Blockchain has transformed financial transactions — but human kindness remains invisible on-chain.

Every day, people help each other without money changing hands: taking someone's photo, helping with a business plan, cooking a meal, teaching a skill. These acts create real social value, yet they leave no verifiable trace. There is no protocol for:

- Recording non-monetary kindness on-chain
- Incentivizing pay-it-forward chains of goodwill
- Rewarding participants who extend chains of kindness back to their origin

Most blockchain applications target financial transactions. ONLOOP targets something deeper: **the human act of giving**.

---

## Solution

ONLOOP is a pay-it-forward protocol with three core mechanics:

### 1. Kindness Chains (On-Chain)
When User A performs a kindness for User B, the act is recorded on-chain via the `OnChain` smart contract. User B commits to "pay it forward" to User C — extending the chain. Every link in the chain is permanently stored on Base.

### 2. ON Token Rewards
Participants earn `ON` (恩, meaning "grace/debt of gratitude" in Japanese) tokens for:
- Giving or receiving kindness: +1–5 ON
- Loop completion (chain returns to origin): N×20 ON bonus
- NFT holders: up to ×2 reward multiplier

### 3. ONLOOP NFT Collection
500 pixel-art NFTs across 8 rarity tiers (Village → Space), minted on Base Mainnet at ~$0.70 each. NFTs serve as:
- Proof of participation in ONLOOP
- Reward multipliers (Common ×1.1 → Legendary ×2.0)
- Profile identity within the app

---

## How ONLOOP Benefits the Base Ecosystem

### Direct On-Chain Activity
Every kindness action on ONLOOP generates **one or more Base transactions**:
- Creating a chain node → `OnChain.recordNode()` transaction
- Confirming a kindness → `OnChain.confirmNode()` + `OnToken.mint()` transactions
- Minting an NFT → `OnLoopNFT.mint()` transaction

As ONLOOP grows, so does Base transaction volume from genuine human social activity.

### Novel Use Case
ONLOOP brings a use case Base has never seen: **verifiable social good on-chain**. Unlike DeFi or gaming, it attracts users who are motivated by community and values rather than speculation — expanding Base's demographic reach.

### Coinbase Wallet Native
ONLOOP is built around Coinbase Wallet (`preference: "all"`) and Base Names (onloop.base.eth). It demonstrates Base's capability as a platform for real-world social applications.

### Onboarding Non-Crypto Users
The pay-it-forward mechanic is intuitive to non-crypto users. The menu-browsing experience requires no wallet — reducing friction for Web2 users entering Base for the first time.

---

## Technical Architecture

### Smart Contracts (Base Mainnet — all verified)

| Contract | Address | Purpose |
|----------|---------|---------|
| `OnToken` (ERC-20) | `0x84e54ce64d13220365f5d1cb4a6fcc5bf35c6ac3` | ON token (max 900,000 supply) |
| `OnChain` | `0x568db29ef6999e9c2815cbf2d103ebb26d0a9a71` | Permanent chain-of-kindness recorder |
| `OnLoopNFT` (ERC-721) | `0x760D3dd3e0DB6B593215F0E694D53765d3780D7D` | 500-piece pixel-art NFT collection |

### App Stack
- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Web3:** wagmi v2, viem, Coinbase Wallet connector
- **Database:** Neon (serverless PostgreSQL) + Drizzle ORM
- **Storage:** Vercel Blob (images), IPFS/Pinata (NFT images)
- **Deployment:** Vercel (onloop-one.vercel.app)

### On-Chain Data Flow
```
User confirms kindness
    ↓
DB updated (off-chain record)
    ↓  [async]
OnChain.confirmNode()  →  Base TX #1 (chain record)
OnToken.mint()         →  Base TX #2 (reward)
```

---

## Traction & Metrics

| Metric | Value |
|--------|-------|
| App launched | May 2026 |
| Smart contracts deployed | 3 (Base Mainnet) |
| NFT collection size | 500 pieces |
| NFT mint price | 0.0003 ETH (~$0.70) |
| Kindness menu registrations | 10 (demo phase) |
| Target MAU (post-grant) | 500 |

---

## Team

**Founder:** Shinchi Takahiro  
**Role:** Solo developer / Product designer  
**Background:** Product builder focused on social good applications, building on Base since 2026  
**Location:** Japan  
**Base Name:** onloop.base.eth  
**Farcaster:** @onloop  
**Email:** shinchi.takahiro24@gmail.com  

*ONLOOP was designed, developed, and deployed entirely solo — from smart contract architecture to pixel-art NFT generation to full-stack web application. Three smart contracts live on Base Mainnet, a 500-piece NFT collection is minted, and the full app is production-ready.*

---

## Roadmap

### Phase 1 — Current (MVP Live)
- [x] Core pay-it-forward flow
- [x] ON token (ERC-20) on Base Mainnet
- [x] OnChain permanent record contract
- [x] 500-piece NFT collection (Base Mainnet)
- [x] NFT reward multiplier system
- [x] Admin dashboard with revenue management

### Phase 2 — With Grant ($15,000 target)
*(Q2–Q3 2026)*

**Smart Contract Enhancement ($4,000)**
- Smart contract security audit (third-party)
- Loop completion detection fully on-chain
- ON token governance features (voting, staking)

**Growth & Community ($5,000)**
- Japan launch marketing campaign
- Community management (Discord/Twitter/Farcaster)
- First 100 real users acquisition
- Base ecosystem event participation

**Product Expansion ($4,000)**
- Mobile-optimized PWA
- Farcaster Frame integration (viral sharing)
- Multi-language support (EN/JA)
- Advanced chain visualization

**Legal & Compliance ($2,000)**
- Legal consultation (Japanese Payment Services Act compliance for ON token)
- Terms of service and privacy policy

### Phase 3 — Scale
*(Q4 2026+)*
- 1,000+ MAU
- ON token on-chain governance live
- Expanded NFT collection (Series 2)
- Base ecosystem partnership

---

## Budget Breakdown

| Category | Amount | Details |
|----------|--------|---------|
| Smart contract audit | $4,000 | Third-party security review of 3 contracts |
| Marketing & community | $5,000 | Launch campaign, community management, events |
| Product development | $4,000 | PWA, Farcaster integration, mobile UX |
| Legal & compliance | $2,000 | Payment Services Act consultation (Japan) |
| **Total** | **$15,000** | |

---

## Farcaster Integration Strategy

ONLOOP is already present on Farcaster as **@onloop**, and Farcaster is central to our growth strategy.

### Why Farcaster × ONLOOP is a natural fit

Pay-it-forward is inherently social and viral. Farcaster provides the ideal distribution layer:

- **Frames** — Each kindness chain can be shared as a Farcaster Frame, allowing users to join chains directly from their feed without leaving Farcaster
- **Viral mechanics** — "I received kindness from @user and I'm paying it forward — join my chain" is a natural cast
- **Aligned community** — Farcaster's early adopter community values social good and open protocols, matching ONLOOP's ethos

### Planned Farcaster integration (with grant funding)
1. **Farcaster Frame for chain sharing** — Share your kindness chain as an interactive Frame; others can join directly
2. **Cast on loop completion** — Automatic cast when a pay-it-forward loop completes (with participant tags)
3. **Channel: /onloop** — Dedicated Farcaster channel for community coordination

This makes ONLOOP one of the first applications to combine **social good + Farcaster Frames + Base transactions** into a single user flow.

---

## Why Base?

ONLOOP was designed from day one to be a Base-native application. We chose Base because:

1. **Low gas fees** — Critical for a social app where each kindness is a transaction (~$0.001/tx on Base)
2. **Coinbase Wallet** — Japan has strong Coinbase adoption; native wallet lowers onboarding friction
3. **Base Names** — `onloop.base.eth` reflects our identity as a Base-first project
4. **Farcaster alignment** — Base's ecosystem investment in Farcaster aligns with our social distribution strategy
5. **OP Stack values** — Base's commitment to impact aligns with ONLOOP's social good mission
6. **English + Japanese market** — Base's global reach matches our bilingual app

ONLOOP is not "deployed on Base" — it is **built for Base**. Every feature, from NFT minting to chain recording to Farcaster Frame sharing, is designed to generate authentic Base network activity.

---

## Links

| Resource | URL |
|----------|-----|
| Live App | https://onloop-one.vercel.app |
| Farcaster | https://warpcast.com/onloop |
| GitHub (public) | https://github.com/SRKTK56/onloop |
| ON Token (Basescan) | https://basescan.org/address/0x84e54ce64d13220365f5d1cb4a6fcc5bf35c6ac3 |
| OnChain Contract | https://basescan.org/address/0x568db29ef6999e9c2815cbf2d103ebb26d0a9a71 |
| NFT Contract | https://basescan.org/address/0x760D3dd3e0DB6B593215F0E694D53765d3780D7D |

---

## Contact

**Email:** shinchi.takahiro24@gmail.com  
**Base Name:** onloop.base.eth  
**Farcaster:** @onloop
