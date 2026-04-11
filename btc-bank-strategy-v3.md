# Self-Custodial Bitcoin Bank on Liquid / Simplicity

## Full Product Strategy & Feasibility Assessment
## v3 — April 2026

**Pre-employment conception.** This document and the associated prototype predate any employment relationship with Blockstream. Paper trail exists via LinkedIn conversations with Blockstream's recruiter, Head of Business Development (Enterprise), and two engineers (LinkedIn + Telegram). The product concept — borrow against BTC, spend via card, self-custodial — is not Blockstream-specific. The Liquid/Simplicity implementation is one execution path.

---

## 1. The Product

A mobile app and Bitcoin financial planning tool. Two components:

**Component 1: Bitcoin Wealth Planner (top of funnel, free)**
Monte Carlo simulation tool for BTC holders. Shows projected wealth over 10-20 years, probability distributions, and financial independence scenarios. Free, web-based, no signup required. Naturally leads users to: "want to access this wealth without selling?"

**Component 2: Self-Custodial Lending + Spending App (monetisation)**
Users lock BTC in Simplicity vaults on Liquid → borrow stablecoins (L-USDT) against their collateral via on-chain lending contracts → spend stablecoins via a Visa/Mastercard debit card (white-label card partner). Users never sell BTC, never trigger capital gains tax (borrowing is a loan, not a disposal — same principle as mortgages, margin loans, and every BTC-backed lending platform operating globally today). On-chain balances are hidden via Liquid's confidential transactions.

The company builds software. The protocol handles lending. The card partner handles fiat. No banking license, no VASP, no EMI required.

**Key validation:**
- A lending contract demo already exists on Liquid testnet (https://t.me/simplicity_community/1046)
- Simplex, a Rust-based development framework for Simplicity contracts, launched March 2026
- Simplicity is live on Liquid mainnet since July 2025
- ~100 developers trained through Blockstream bootcamps

---

## 2. Market & Positioning

### 2.1 Target User: Bitcoin Holders Who Refuse Ethereum

This is NOT "Aave but on Bitcoin." The target is NOT the DeFi degen who already uses Aave comfortably.

The target is the Bitcoin holder who:
- Holds BTC in self-custody and believes in the Bitcoin ethos
- Refuses to wrap BTC into WBTC and trust BitGo as custodian
- Doesn't want positions publicly visible on Ethereum
- Would rather earn less yield than trust a CeFi platform after Celsius/BlockFi/Voyager
- Currently has ZERO DeFi options they'd actually use

This is a specific, underserved, ideologically motivated segment — and it's large.

### 2.2 Market Size

| Metric | Value | Source |
|--------|-------|--------|
| Global Bitcoin holders | ~480-500M | Crypto.com / Chainalysis 2026 |
| Individual holders | 65.9% of supply = ~13.83M BTC | River Research, Aug 2025 |
| Wallets holding 0.1+ BTC | ~30M+ | Glassnode |
| Self-custody aware users | 71% of crypto users | CoinLaw 2025 |
| Migrating custodial to non-custodial | 33% of new registrations | CoinLaw 2025 |

**Retail SAM:** Self-custody-minded holders with 0.1+ BTC who'd borrow against holdings instead of selling. Estimated 2-5M people globally.

**Institutional opportunity (Phase 2+):** 84+ public companies hold 1,185,265 BTC with $82.1B NAV (The Block, March 2026). 170-190 publicly traded firms held Bitcoin as of late 2025. Corporate treasuries need privacy (competitors shouldn't see positions), formal verification (boards/auditors want mathematical proof), and no wrapping risk. BSTR (Bitcoin Standard Treasury Company) — Adam Back's own publicly traded treasury — holds 30,000+ BTC valued at $3B+. Blockstream's first institutional customer could be themselves.

### 2.3 Competitive Positioning

| Player | Model | What they lack |
|--------|-------|---------------|
| Xapo | Custodial Bitcoin bank, $1K/yr | Not self-custodial. MPC keys held by Xapo. |
| Ledn | Custodial BTC lending | No spending card. Custodial. |
| Nexo | CeFi lending + card | Custodial. Rehypothecates your assets. Celsius risk model. |
| Aave | Decentralised lending on Ethereum | Requires WBTC (BitGo custody). Public positions. MEV exposure. |
| MetaMask Card | Self-custodial spending | No lending. EVM-only. No Bitcoin. |
| **This product** | **Self-custodial, Liquid/Simplicity** | **First DeFi that Bitcoin maximalists would actually trust.** |

**Genuine edges:**
- **No wrapping:** L-BTC via Liquid federation, not BitGo-custodied WBTC
- **Privacy:** Confidential transactions hide balances — no whale watching, no MEV, no front-running liquidations
- **No re-entrancy:** UTXO model eliminates the entire class of exploits that cost hundreds of millions on Ethereum
- **Formal verification:** Simplicity contracts provable in Coq, not just "audited by humans"
- **No gas exposure:** Liquid fees ~$0.01 vs Ethereum $50-200 during congestion

**What's NOT an edge (be honest):**
- Liquid is a federated sidechain (65 functionaries), not Bitcoin PoW security
- Simplicity is new and unproven with real money at scale
- Liquidity is thin compared to Ethereum DeFi

---

## 3. Architecture

### 3.1 P2P Lending Protocol (Open Source, Production-Ready on Testnet)

The lending protocol exists: github.com/BlockstreamResearch/simplicity-lending (MIT/Apache-2.0).
Testnet demo live at: demolending.distributedlab.com

**v1 mechanics (no oracle needed):**
- Borrower creates offer: collateral amount, loan duration, interest they'll pay, principal they want
- Lender accepts → principal sent to borrower, collateral locked in Simplicity contract
- Borrower repays principal + interest before expiry → collateral returned
- Borrower fails to repay by expiry → lender claims collateral
- No continuous LTV monitoring. No price oracle. Fixed-term, fixed-conditions. Borrower and lender negotiate terms directly.

**What this means vs. Aave:**
- Aave: open-ended loans, real-time oracle, auto-liquidation on price drop. More flexible, more complex, needs oracle infrastructure.
- This: fixed-term loans, no oracle, time-based liquidation only. Simpler, more predictable, borrower doesn't get liquidated mid-term by a flash crash. Lender takes more risk if BTC crashes and borrower walks away.

**v2 (future):** Rolling/perpetual loans would require a price oracle. Approaches being explored: federated oracle via Liquid federation members, periodic settlement, optimistic liquidation proofs.

No pool to fund. No liquidity to bootstrap. No cold-start problem beyond seeding initial offers.

### 3.2 Two-Sided Marketplace

The app serves BOTH borrowers and lenders. Same app, different modes.

**Borrower (primary user):**
- Has BTC, wants spending money without selling
- Locks BTC as collateral → receives stablecoins → spends via card
- PAYS interest (e.g., 3.5% APR)

**Lender (other side):**
- Has stablecoins, wants yield
- Deposits stablecoins → matched with borrowers
- EARNS interest (e.g., 2.5% APR)

Protocol takes the spread + origination fee.

### 3.3 App Information Architecture

**Tab 1: Home** — net worth overview, vault balance, credit status, card balance, quick actions

**Tab 2: Lending** — two sub-views:
- "I want to borrow" → vault (BTC collateral), LTV slider with risk education, borrow amount, interest rate, repay/rebalance
- "I want to earn" → stablecoin deposit, current APY, utilisation rate, withdrawal

**Tab 3: Card** — setup (KYC via card partner), spending, transactions, cashback, freeze/manage

**Tab 4: Settings** — vault config, recovery keys, network settings

### 3.4 Wallet Connection (Self-Custody First)

The app does NOT hold BTC. It's a window into the Liquid network. Users connect their own wallet.

**Two modes, user chooses:**

**Connect hardware wallet (primary, recommended for self-custody users):**
- User connects Jade, Ledger, or Trezor to the app
- When the app needs to lock BTC in a lending contract, it sends the transaction to the hardware wallet for signing
- User confirms on the device → transaction broadcasts to Liquid
- Keys never touch the app. Maximum security. This is how the Bitcoin self-custody community already works.
- Jade is Blockstream's own hardware wallet and supports Liquid natively — natural integration point.

**Built-in hot wallet (convenience option for smaller amounts):**
- App generates a seed phrase on first launch
- User backs up the seed → keys stored encrypted on phone
- Faster UX (no external device needed for every action)
- Less secure — phone can be compromised. Suitable for spending amounts, not life savings.

**The user flow for deposits:**

1. Connect wallet (Jade/Ledger) or create built-in wallet
2. "Deposit BTC" → app shows a Liquid address (or offers instant swap from mainchain BTC via SideSwap/Boltz)
3. User sends BTC from wherever they keep it → arrives as L-BTC on Liquid
4. L-BTC shows in app as "Your Balance"
5. To borrow → app constructs lending contract transaction → hardware wallet signs → L-BTC locked as collateral → L-USDT received
6. To spend → send L-USDT to card, or send directly to any Liquid address (peer-to-peer, no card needed)
7. To withdraw → peg-out from Liquid back to mainchain BTC (or instant swap)

**The app is a full Liquid wallet.** Card is optional. Users can send/receive L-BTC or L-USDT to any Liquid address directly — peer-to-peer transfers, no card required.

**Key question for protocol dev call:** "When a user locks BTC in a lending contract — is that a standard Liquid transaction that any wallet SDK (LWK) can construct? Or does it need custom covenant construction from the lending protocol's Rust crates?" This determines build complexity.

### 3.5 Stack

```
Monte Carlo BTC Planner (Web, free)
         |
         v
PWA / React Web App — you build this
         |
    ┌────┴────┐
    v         v
Jade/Ledger   Built-in
(hardware)    hot wallet
    └────┬────┘
         v
Card API (Rain / ChainUp / Striga) — card partner handles
         |
         v
Simplicity Lending Protocol (open source, MIT/Apache-2.0)
github.com/BlockstreamResearch/simplicity-lending
         |
         v
Liquid Network (L-BTC, L-USDT, Confidential Txs)
         |
         v
Bitcoin Mainchain (BTC locked in federation multisig)
```

### 3.5 Card Integration (Vendor-Agnostic)

| Provider | Model | Coverage |
|----------|-------|----------|
| Rain | Full-stack Visa issuer | Global, $3B+ annualised |
| ChainUp | White-label, aggregated issuers | 180+ countries, no setup fees |
| Striga | White-label BaaS | EU/UK |
| Gnosis Pay | Self-custodial card | EU, Visa |

Cashback reality: EU interchange capped at 0.2-0.3%. US ~1.8%. Realistic cashback: 0.5-1% funded from product margin.

---

## 4. Revenue Model (Small Business)

### 4.1 Streams

**Origination fee (primary):** 0.5% of loan principal each time a loan opens. Users taking 2-3 loans/year compounds this.

**Lending spread:** Borrower pays 4% APR, lender receives 3%, protocol keeps 1%.

**Card interchange:** 0.2-1.5% rev-share depending on jurisdiction.

**Premium subscription:** EUR15/month. Higher LTV tiers, multi-sig vaults, priority alerts, analytics. 15% conversion.

### 4.2 Tiered Interest Rates

| LTV | Borrower pays | Lender receives | Protocol keeps | BTC drop to liquidation |
|-----|--------------|----------------|---------------|------------------------|
| 10-20% | 2.0% APR | 1.2% | 0.8% | 75-87% |
| 20-30% | 3.5% APR | 2.5% | 1.0% | 57-75% |
| 30-40% | 5.0% APR | 3.5% | 1.5% | 42-57% |

### 4.3 Projections (Conservative)

| Users | Origination | Spread | Card | Premium | Total |
|-------|------------|--------|------|---------|-------|
| 500 (Y1) | EUR16K | EUR8K | EUR5K | EUR13K | **~EUR42K** |
| 2,000 (Y2) | EUR97K | EUR48K | EUR27K | EUR54K | **~EUR226K** |
| 5,000 (Y3-4) | EUR364K | EUR145K | EUR78K | EUR135K | **~EUR722K** |
| 10,000 (Y5) | EUR874K | EUR290K | EUR194K | EUR270K | **~EUR1.6M** |

Year 1-2: Validation. Not self-sustaining. Side project.
Year 3: Self-sustaining. 3-4 people.
Year 5: EUR1.6M. 8-10 people. Profitable. Founder steps back from day-to-day.

---

## 5. Technical Challenges (Real Ones Only)

### 5.1 🟡 Price Oracle (NOT needed for v1)

v1 lending protocol uses fixed-term loans with time-based liquidation. No oracle required. This is already built and working on testnet. Oracle becomes critical only for v2 (perpetual/rolling loans with real-time LTV monitoring). Not a launch blocker.

### 5.2 HIGH: Lending Contract Maturity

Testnet demo exists. Gap to production: audit, weight optimisation, edge cases, formal verification, mainnet deployment. Simplex framework (March 2026) improves tooling significantly.

### 5.3 MEDIUM: Peg-in Latency

BTC to L-BTC takes ~17 hours. Solutions exist: instant swap (SideSwap/Boltz, ~0.1% fee), Lightning submarine swaps, or UX framing as one-time onboarding.

### 5.4 SOLVED: Card Integration

Multiple white-label providers. API integration. Proven by MetaMask, Ledger, Nexo.

### 5.5 SOLVED: Privacy

Liquid confidential transactions hide amounts and asset types by default. Genuine competitive advantage.

---

## 6. Legal

### 6.1 The Company Builds Software

| Function | Who handles it | License needed by us? |
|----------|---------------|----------------------|
| Smart contracts | Protocol on Liquid | No |
| Mobile app | Software company | No |
| Card issuance, KYC, fiat | White-label card partner | No — they hold licenses |
| Lending matching | Protocol on Liquid | No |
| BTC to L-BTC | SideSwap, Boltz, exchanges | No |

No VASP. No banking license. No EMI. Same model as Uniswap Labs, MetaMask.

**Incorporation:** Anywhere tax-efficient. Legal cost: EUR5-10K for incorporation + ToS.

### 6.2 Tax Treatment

A loan is not a sale. Mortgages, margin loans, and every BTC-backed lending platform (Nexo, Ledn, Aave, Xapo) operate on this principle across 100+ countries globally. Only taxable event: collateral liquidation (which IS a disposal).

### 6.3 Corporate Structure

Single for-profit company. No foundation needed at MVP. Consider foundation for protocol governance only when genuinely needed (Year 3+).

---

## 7. Distribution

### 7.1 Funnel

```
Monte Carlo BTC Planner (free, web, no signup)
    |
    v
"Access this wealth without selling?"
    |
    v
Signup via Nostr pubkey or Lightning payment (1,000 sats)
    |
    v
Waitlist / early access
    |
    v
Lending app
```

No email. Bitcoiners want privacy. Nostr = no identity. Lightning payment = spam filter + commitment test. 5,000 signups at 1,000 sats = ~$3,500 revenue + proven demand.

### 7.2 Channels

- Blockstream ecosystem: 100+ Local chapters, Jade users, bootcamp alumni
- Bitcoin media: Simply Bitcoin, BTC Sessions, Bitcoin Magazine
- Bitcoin conferences: Plan B, BTC++, Bitcoin Amsterdam
- Simplicity community: Telegram, IRC, GitHub
- Open source: contracts are auditable — code is marketing

---

## 8. Phased Roadmap

### Phase 0: Validate (4-6 weeks, EUR0)
- Publish Monte Carlo planner as standalone web tool
- Landing page with Nostr/Lightning waitlist
- Share in Bitcoin communities
- **Gate:** 2,000+ signups

### Phase 1: Build UX Layer (2-3 months, solo, EUR0)
- PWA (React web app, installable, no app store)
- Wallet connection: Jade/Ledger hardware wallet + built-in hot wallet option
- Vault UI, lending UI, card placeholder
- Liquid Wallet Kit (LWK) integration
- No lending contract integration yet — build the experience
- **You, solo. Frontend only.**

### Phase 2: Integrate Lending (3-6 months, EUR30-50K)
- Partner with Simplicity developer (community/bootcamp alumni)
- Connect UX to lending contract on Liquid testnet
- P2P matching interface
- Oracle mechanism
- **You + 1 Simplicity dev (part-time)**

### Phase 3: Mainnet + Card (3-4 months, EUR50-100K)
- Contract audit and mainnet deployment
- White-label card API integration
- First real loans and card transactions
- **You + 1-2 devs**

### Total Pre-Revenue Investment: EUR85-160K

Much lower because: P2P matching eliminates pool bootstrapping, you build frontend yourself, part-time community dev is cheaper than a full team.

---

## 9. Open Technical Questions

### Lending Protocol Integration
- Q1: When a user locks BTC in a lending contract — is that a standard Liquid transaction that LWK can construct? Or does it need custom covenant construction from the lending protocol's Rust crates?
- Q2: The testnet lending protocol — what's the gap to mainnet deployment? Audit status?
- Q3: Can the lending contract work with hardware wallet signing (Jade/Ledger)? Or does the transaction construction require the CLI tool?

### Wallet & UX
- Q4: How does Jade connect to third-party apps on Liquid? Bluetooth, USB, QR-based air-gapped signing?
- Q5: Does Liquid Wallet Kit (LWK) support hardware wallet integration out of the box?
- Q6: Can the app construct Simplicity contract transactions via LWK, or does it need the lending protocol's Rust crates compiled to WASM?

### Oracle (v2, not blocking v1)
- Q7: For perpetual loans without expiry — has anyone explored price feed mechanisms in Simplicity?
- Q8: Could Liquid federation members serve as a federated price oracle?
- Q9: Minimum viable oracle — 3-of-5 multisig price attestation?

### P2P Architecture
- Q10: Individual UTXO contracts per lender-borrower pair — any scaling concerns at thousands of active loans?
- Q11: Could the simplicity-dex AMM inform a future pool model?

### Confidential Transactions
- Q12: Can a lending contract verify minimum value thresholds on confidential outputs for collateral requirements?

### Peg-in/Peg-out
- Q13: Instant swap reliability at scale (SideSwap, Boltz)?
- Q14: Open peg-out for non-federation users — timeline?

---

## 10. Risk Matrix

| Risk | Severity | Likelihood | Mitigation |
|------|----------|-----------|------------|
| Lending protocol testnet → mainnet gap | High | Medium | Protocol exists, open source, dev is accessible |
| P2P matching too slow | High | Medium | Seed initial offers yourself; Bitcoin communities |
| Hardware wallet integration complexity | Medium | Medium | Jade supports Liquid natively; LWK SDK exists |
| Dev talent concentrated at Blockstream | High | High today | Bootcamps, Simplex framework, code is open source |
| Federation risk | Medium | Very low | 11-of-15 multisig, distributed |
| Peg-in friction (17hr wait) | Medium | High | Instant swap services (SideSwap, Boltz) |
| Competition from Ethereum DeFi | Medium | High | Different value prop — ideological, not technical |
| Oracle needed for v2 perpetual loans | Medium | Medium | v1 works without oracle; v2 is a future problem |

---

## 11. The Long Game

**Year 1-2:** Side project. You + 1 dev. Planner live, app prototype, testnet lending. Validate. <EUR50K.

**Year 3-4:** Full-time. 3-4 people. Mainnet, card, first revenue. ~EUR700K. Self-sustaining.

**Year 5:** 8-10 people. 10,000+ users. ~EUR1.6M. Institutional lending as growth. Founder steps back.

**If Simplicity activates on Bitcoin mainnet (5-10+ years):** Everything migrates to L1. First-mover advantage is permanent.

---

## 12. One-Line Pitch

> The first DeFi that Bitcoin maximalists would actually trust. Borrow against your BTC, spend via card, never sell — self-custodial, private, on Bitcoin's own rails.

---

*Conceived and documented April 2026, prior to any employment agreement. All market data from public sources (River Research, Glassnode, CoinLaw, The Block, CoinMarketCap, Blockstream blog).*
