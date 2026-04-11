import { useState } from "react";

const C = {
  bg: "#0A0A0F", card: "#141420", cardAlt: "#1A1A2E", border: "#2A2A3E",
  orange: "#F7931A", orangeDim: "#F7931A22",
  green: "#22C55E", greenDim: "#22C55E22",
  red: "#EF4444", redDim: "#EF444422",
  blue: "#3B82F6", blueDim: "#3B82F622",
  text: "#F0F0F5", dim: "#8888AA", mid: "#BBBBDD", white: "#FFFFFF",
};
const BTC_PRICE = 70500;
const EUR_RATE = 0.92;

function StatusBar() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 20px", fontSize: 12, color: C.dim }}>
      <span>9:41</span>
      <div style={{ display: "flex", gap: 6, fontSize: 10 }}><span>5G</span><span>■■■</span><span>🔋</span></div>
    </div>
  );
}

function NavBar({ active, go }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-around", padding: "10px 0 22px", borderTop: `1px solid ${C.border}`, background: C.bg }}>
      {[
        { id: "home", label: "Home", icon: "⬡" },
        { id: "lending", label: "Lending", icon: "📊" },
        { id: "card", label: "Card", icon: "💳" },
        { id: "settings", label: "More", icon: "⚙" },
      ].map(t => (
        <button key={t.id} onClick={() => go(t.id)} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          color: active === t.id ? C.orange : C.dim,
        }}>
          <span style={{ fontSize: 20 }}>{t.icon}</span>
          <span style={{ fontSize: 10, fontWeight: active === t.id ? 700 : 400 }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

function Pill({ text, color }) {
  return <span style={{ fontSize: 10, color, background: color + "22", padding: "3px 8px", borderRadius: 10 }}>{text}</span>;
}

function InfoRow({ label, value, valueColor, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
      <span style={{ fontSize: 12, color: C.dim }}>{label}</span>
      <span style={{ fontSize: 12, color: valueColor || C.mid, fontWeight: bold ? 700 : 400, textAlign: "right", maxWidth: "58%" }}>{value}</span>
    </div>
  );
}

function Section({ title, children, style: s }) {
  return (
    <div style={{ background: C.card, borderRadius: 16, padding: 18, marginBottom: 14, border: `1px solid ${C.border}`, ...s }}>
      {title && <div style={{ fontSize: 11, fontWeight: 600, color: C.mid, marginBottom: 12, letterSpacing: 0.5 }}>{title}</div>}
      {children}
    </div>
  );
}

// ──────── HOME ────────
function HomeScreen({ go, vault, loan, cardBal }) {
  const netBtc = vault;
  const netEur = netBtc * BTC_PRICE * EUR_RATE;
  const available = vault * BTC_PRICE * 0.30 - loan;

  return (
    <div style={{ padding: "0 20px", flex: 1, overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 12, color: C.dim }}>Your Bitcoin Wealth</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>Overview</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <Pill text="🔒 Private" color={C.green} />
          <Pill text="Liquid" color={C.blue} />
        </div>
      </div>

      {/* Net Worth Card */}
      <div style={{
        background: "linear-gradient(135deg, #141420, #1E1E35)", borderRadius: 20,
        padding: 24, marginBottom: 16, border: `1px solid ${C.border}`,
      }}>
        <div style={{ fontSize: 11, color: C.dim, letterSpacing: 1, marginBottom: 8 }}>NET WORTH</div>
        <div style={{ fontSize: 36, fontWeight: 800, color: C.white }}>
          {netBtc.toFixed(4)} <span style={{ fontSize: 18, color: C.orange }}>BTC</span>
        </div>
        <div style={{ fontSize: 15, color: C.dim }}>≈ €{netEur.toLocaleString("en", { maximumFractionDigits: 0 })}</div>
      </div>

      {/* Three cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <button onClick={() => go("lending")} style={{
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
          padding: 14, cursor: "pointer", textAlign: "left",
        }}>
          <div style={{ fontSize: 10, color: C.dim, marginBottom: 6 }}>COLLATERAL</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.text }}>{vault.toFixed(4)} BTC</div>
          <div style={{ fontSize: 11, color: C.dim }}>in Simplicity vault</div>
        </button>
        <button onClick={() => go("lending")} style={{
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
          padding: 14, cursor: "pointer", textAlign: "left",
        }}>
          <div style={{ fontSize: 10, color: C.dim, marginBottom: 6 }}>AVAILABLE CREDIT</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: available > 0 ? C.green : C.orange }}>
            €{Math.max(0, available * EUR_RATE).toLocaleString("en", { maximumFractionDigits: 0 })}
          </div>
          <div style={{ fontSize: 11, color: C.dim }}>at 30% LTV</div>
        </button>
      </div>

      <button onClick={() => go("card")} style={{
        width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
        padding: 14, cursor: "pointer", textAlign: "left", marginBottom: 16,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 10, color: C.dim, marginBottom: 4 }}>SPENDING CARD</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.text }}>€{(cardBal * EUR_RATE).toLocaleString("en", { maximumFractionDigits: 0 })}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, color: C.green }}>3% cashback</div>
          <div style={{ fontSize: 11, color: C.dim }}>Mastercard →</div>
        </div>
      </button>

      {/* Why vault exists */}
      <Section title="WHY A VAULT, NOT A WALLET?">
        <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.6 }}>
          A Jade wallet stores your bitcoin. A vault <span style={{ color: C.orange }}>programs</span> it. 
          Your vault is a Simplicity smart contract that:
        </div>
        <div style={{ marginTop: 10 }}>
          {[
            ["🔐", "Locks BTC as collateral so you can borrow against it"],
            ["⏱", "Enforces time-locks on large withdrawals (anti-theft)"],
            ["🔑", "Enables 2-of-3 multi-sig recovery if you lose a key"],
            ["📏", "Sets spending limits (max 10%/day without co-sign)"],
            ["🔒", "Hides your balance on-chain (confidential transactions)"],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
              <span style={{ fontSize: 12, minWidth: 18 }}>{icon}</span>
              <span style={{ fontSize: 11, color: C.mid, lineHeight: 1.4 }}>{text}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: C.orange, marginTop: 10, fontWeight: 600 }}>
          Without a vault, there's no lending. The vault IS the collateral engine.
        </div>
      </Section>
    </div>
  );
}

// ──────── LENDING ────────
function LendingScreen({ vault, loan, go, onBorrow, onRepay }) {
  const [view, setView] = useState(loan > 0 ? "overview" : "borrow");
  const [ltv, setLtv] = useState(25);
  const [borrowAmt, setBorrowAmt] = useState(0);
  
  const maxBorrow = vault * BTC_PRICE * (ltv / 100) - loan;
  const currentLtv = loan > 0 ? (loan / (vault * BTC_PRICE)) * 100 : 0;
  const liqPrice = loan > 0 ? loan / (vault * 0.75) : 0;
  const marginPrice = loan > 0 ? loan / (vault * 0.60) : 0;
  const btcLocked = loan > 0 ? loan / BTC_PRICE / (currentLtv / 100) : 0;
  const dropToLiq = loan > 0 ? ((1 - liqPrice / BTC_PRICE) * 100) : 0;
  const dropToMargin = loan > 0 ? ((1 - marginPrice / BTC_PRICE) * 100) : 0;
  const monthlyInterest = loan * 0.035 / 12;

  const riskColor = ltv <= 25 ? C.green : ltv <= 35 ? C.orange : C.red;

  // Repay sub-view
  const [repayAmt, setRepayAmt] = useState(Math.round(monthlyInterest + loan * 0.05));

  if (view === "repay" && loan > 0) {
    return (
      <div style={{ padding: "0 20px", flex: 1, overflowY: "auto" }}>
        <button onClick={() => setView("overview")} style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", marginBottom: 16, fontSize: 14 }}>← Back to loans</button>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 20 }}>Repay Loan</div>

        <Section title="OUTSTANDING">
          <div style={{ fontSize: 28, fontWeight: 800, color: C.white, marginBottom: 12 }}>${loan.toLocaleString("en", { maximumFractionDigits: 0 })}</div>
          <InfoRow label="Monthly interest" value={`$${monthlyInterest.toFixed(2)}`} />
          <InfoRow label="Minimum payment" value={`$${monthlyInterest.toFixed(2)} (interest only)`} />
          <InfoRow label="Collateral locked" value={`${btcLocked.toFixed(4)} BTC`} />
        </Section>

        <Section title="PAYMENT AMOUNT">
          <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
            {[
              { l: "Interest only", v: Math.round(monthlyInterest) },
              { l: "Int + 5%", v: Math.round(monthlyInterest + loan * 0.05) },
              { l: "Pay 50%", v: Math.round(loan * 0.5) },
              { l: "Full payoff", v: loan },
            ].map(o => (
              <button key={o.l} onClick={() => setRepayAmt(o.v)} style={{
                flex: "1 1 45%", padding: "8px 4px", borderRadius: 8, fontSize: 10,
                border: `1px solid ${repayAmt === o.v ? C.orange : C.border}`,
                background: repayAmt === o.v ? C.orangeDim : "transparent",
                color: repayAmt === o.v ? C.orange : C.dim, cursor: "pointer",
              }}>{o.l}</button>
            ))}
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.white, marginBottom: 6 }}>${repayAmt.toLocaleString("en", { maximumFractionDigits: 0 })}</div>
          <div style={{ fontSize: 11, color: C.dim }}>
            {repayAmt >= loan ? "Full repayment — all collateral unlocked" :
             repayAmt <= monthlyInterest ? "Interest only — balance unchanged" :
             `Reduces to $${(loan - repayAmt).toLocaleString("en", { maximumFractionDigits: 0 })} · unlocks ${((repayAmt / loan) * btcLocked).toFixed(4)} BTC`}
          </div>
        </Section>

        <div style={{ background: C.blueDim, borderRadius: 12, padding: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: C.blue, fontWeight: 600, marginBottom: 4 }}>ⓘ Missed payments</div>
          <div style={{ fontSize: 11, color: C.dim, lineHeight: 1.5 }}>
            No penalty fees. Interest accrues on full balance. Your LTV creeps up — auto-liquidation triggers at 75% LTV. 
            Add more collateral anytime to lower LTV and buy breathing room.
          </div>
        </div>

        <button onClick={() => { onRepay(repayAmt); setView("overview"); }} style={{
          width: "100%", padding: 14, borderRadius: 12, border: "none",
          background: C.orange, color: C.bg, fontWeight: 700, fontSize: 15, cursor: "pointer",
        }}>Repay ${repayAmt.toLocaleString("en", { maximumFractionDigits: 0 })}</button>
      </div>
    );
  }

  // Borrow sub-view
  if (view === "borrow") {
    return (
      <div style={{ padding: "0 20px", flex: 1, overflowY: "auto" }}>
        {loan > 0 && <button onClick={() => setView("overview")} style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", marginBottom: 16, fontSize: 14 }}>← Back to loans</button>}
        <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 4 }}>New Loan</div>
        <div style={{ fontSize: 12, color: C.dim, marginBottom: 20 }}>
          You have <span style={{ color: C.orange }}>{vault.toFixed(4)} BTC</span> in your vault · BTC price: ${BTC_PRICE.toLocaleString()}
        </div>

        <Section title="LOAN-TO-VALUE RATIO">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: riskColor }}>{ltv}%</span>
            <Pill text={ltv <= 25 ? "🛡️ Conservative" : ltv <= 35 ? "⚠️ Moderate" : "🔴 Aggressive"} color={riskColor} />
          </div>
          <input type="range" min={10} max={40} value={ltv} onChange={e => { setLtv(+e.target.value); setBorrowAmt(0); }}
            style={{ width: "100%", accentColor: riskColor, marginBottom: 8 }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.dim }}>
            <span>10%</span><span>25% recommended</span><span>40% max</span>
          </div>
        </Section>

        <Section title="RISK EDUCATION">
          <div style={{ background: riskColor + "15", borderRadius: 10, padding: 12 }}>
            <InfoRow label="BTC must drop" value={`${Math.round(100 - (ltv / 0.75))}% to liquidate`} valueColor={riskColor} bold />
            <InfoRow label="Liquidation price" value={`$${Math.round(BTC_PRICE * (1 - (100 - ltv / 0.75) / 100)).toLocaleString()}`} valueColor={riskColor} />
            <InfoRow label="12-month survival prob." value={`~${ltv <= 25 ? 96 : ltv <= 30 ? 91 : ltv <= 35 ? 84 : 72}%`} valueColor={riskColor} bold />
            <div style={{ fontSize: 10, color: C.dim, lineHeight: 1.5, marginTop: 6 }}>
              Based on historical BTC volatility. At {ltv}% LTV, bitcoin would need to lose {Math.round(100 - (ltv / 0.75))}% of its value before your position is liquidated. Lower LTV = more buffer.
            </div>
          </div>
        </Section>

        <Section title="BORROW AMOUNT">
          <div style={{ fontSize: 11, color: C.dim, marginBottom: 8 }}>Max available: ${Math.max(0, maxBorrow).toLocaleString("en", { maximumFractionDigits: 0 })}</div>
          <input type="range" min={0} max={Math.max(0, maxBorrow)} value={borrowAmt} onChange={e => setBorrowAmt(+e.target.value)}
            style={{ width: "100%", accentColor: C.orange, marginBottom: 8 }} />
          <div style={{ fontSize: 28, fontWeight: 800, color: C.white, marginBottom: 4 }}>
            ${borrowAmt.toLocaleString("en", { maximumFractionDigits: 0 })} <span style={{ fontSize: 13, color: C.dim }}>USDT</span>
          </div>
          <div style={{ fontSize: 12, color: C.dim, marginBottom: 12 }}>≈ €{(borrowAmt * EUR_RATE).toLocaleString("en", { maximumFractionDigits: 0 })}</div>
          
          <InfoRow label="Collateral locked" value={`${(borrowAmt / BTC_PRICE / (ltv / 100)).toFixed(4)} BTC`} />
          <InfoRow label="Interest rate" value="3.5% APR" />
          <InfoRow label="Monthly cost" value={`$${(borrowAmt * 0.035 / 12).toFixed(2)}`} />
          <InfoRow label="Card cashback (3%)" value={`-$${(borrowAmt * 0.03 / 12).toFixed(2)}/mo if spent`} valueColor={C.green} />
          <InfoRow label="Effective cost after cashback" value={`~0.5% APR`} valueColor={C.green} bold />
          <InfoRow label="Taxable event?" value="✓ No — borrowing is not a sale" valueColor={C.green} bold />
        </Section>

        <button onClick={() => { if (borrowAmt > 0) { onBorrow(borrowAmt); setView("overview"); } }} style={{
          width: "100%", padding: 14, borderRadius: 12, border: "none",
          background: borrowAmt > 0 ? C.orange : C.border, color: C.bg, fontWeight: 700,
          fontSize: 15, cursor: borrowAmt > 0 ? "pointer" : "default",
        }}>Borrow ${borrowAmt.toLocaleString("en", { maximumFractionDigits: 0 })}</button>
      </div>
    );
  }

  // Overview (default when loan exists)
  return (
    <div style={{ padding: "0 20px", flex: 1, overflowY: "auto" }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 4 }}>Lending</div>
      <div style={{ fontSize: 12, color: C.dim, marginBottom: 20 }}>Borrow against your BTC · Never sell</div>

      {/* Two main action buttons */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button onClick={() => setView("borrow")} style={{
          flex: 1, padding: "14px 0", borderRadius: 12, border: "none",
          background: C.orange, color: C.bg, fontWeight: 700, fontSize: 14, cursor: "pointer",
        }}>+ Borrow More</button>
        <button onClick={() => { setRepayAmt(Math.round(monthlyInterest + loan * 0.05)); setView("repay"); }} style={{
          flex: 1, padding: "14px 0", borderRadius: 12, border: `1px solid ${C.orange}`,
          background: "transparent", color: C.orange, fontWeight: 700, fontSize: 14, cursor: "pointer",
        }}>↩ Repay</button>
      </div>

      {/* Active Loan Detail Card */}
      {loan > 0 && (
        <Section title="ACTIVE LOAN" style={{ border: `1px solid ${C.orange}44` }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.white, marginBottom: 4 }}>
            ${loan.toLocaleString("en", { maximumFractionDigits: 0 })} <span style={{ fontSize: 13, color: C.dim }}>USDT</span>
          </div>
          <div style={{ fontSize: 13, color: C.dim, marginBottom: 16 }}>≈ €{(loan * EUR_RATE).toLocaleString("en", { maximumFractionDigits: 0 })}</div>

          <div style={{ height: 1, background: C.border, marginBottom: 12 }} />
          
          <div style={{ fontSize: 11, fontWeight: 600, color: C.mid, marginBottom: 8 }}>COLLATERAL</div>
          <InfoRow label="BTC locked" value={`${btcLocked.toFixed(4)} BTC`} valueColor={C.orange} bold />
          <InfoRow label="Collateral value" value={`$${(btcLocked * BTC_PRICE).toLocaleString("en", { maximumFractionDigits: 0 })}`} />
          <InfoRow label="BTC price now" value={`$${BTC_PRICE.toLocaleString()}`} bold />

          <div style={{ height: 1, background: C.border, margin: "10px 0" }} />
          
          <div style={{ fontSize: 11, fontWeight: 600, color: C.mid, marginBottom: 8 }}>RISK METRICS</div>
          <InfoRow label="Current LTV" value={`${currentLtv.toFixed(1)}%`} valueColor={currentLtv < 30 ? C.green : C.orange} bold />
          <InfoRow label="Margin call at" value={`$${marginPrice.toLocaleString("en", { maximumFractionDigits: 0 })} (BTC drops ${dropToMargin.toFixed(0)}%)`} valueColor={C.orange} />
          <InfoRow label="Liquidation at" value={`$${liqPrice.toLocaleString("en", { maximumFractionDigits: 0 })} (BTC drops ${dropToLiq.toFixed(0)}%)`} valueColor={C.red} />
          
          <div style={{
            marginTop: 10, height: 8, background: C.border, borderRadius: 4,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", left: 0, top: 0, height: "100%", borderRadius: 4,
              width: `${Math.min(100, (currentLtv / 75) * 100)}%`,
              background: currentLtv < 30 ? C.green : currentLtv < 50 ? C.orange : C.red,
              transition: "width 0.3s",
            }} />
            <div style={{ position: "absolute", left: "80%", top: -4, height: 16, width: 1, background: C.orange }} />
            <div style={{ position: "absolute", left: "100%", top: -4, height: 16, width: 1, background: C.red }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.dim, marginTop: 4 }}>
            <span>0%</span><span style={{ color: C.orange }}>margin 60%</span><span style={{ color: C.red }}>liq 75%</span>
          </div>

          <div style={{ height: 1, background: C.border, margin: "12px 0" }} />
          
          <div style={{ fontSize: 11, fontWeight: 600, color: C.mid, marginBottom: 8 }}>COST</div>
          <InfoRow label="Interest rate" value="3.5% APR" />
          <InfoRow label="Monthly interest" value={`$${monthlyInterest.toFixed(2)}`} />
          <InfoRow label="Card cashback earned" value={`-$${(monthlyInterest * 0.85).toFixed(2)}/mo (est.)`} valueColor={C.green} />
          <InfoRow label="Net monthly cost" value={`~$${(monthlyInterest * 0.15).toFixed(2)}`} valueColor={C.green} bold />
        </Section>
      )}

      {/* Cashback Economics */}
      <Section title="THE MATH: WHY THIS BEATS SELLING">
        <div style={{ fontSize: 11, color: C.dim, lineHeight: 1.6, marginBottom: 10 }}>
          Borrowing at 3.5% APR. Card gives 3% cashback on spend. If you spend what you borrow:
        </div>
        {[
          ["Borrow cost", "3.5% APR", C.red],
          ["Cashback offset", "-3.0%", C.green],
          ["Net cost", "~0.5% APR", C.green],
          ["BTC avg annual appreciation", "+30-50%", C.orange],
          ["Your real return", "You keep BTC upside minus 0.5%", C.orange],
        ].map(([k, v, col]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: C.dim }}>{k}</span>
            <span style={{ fontSize: 11, color: col, fontWeight: 600 }}>{v}</span>
          </div>
        ))}
        <div style={{ background: C.greenDim, borderRadius: 8, padding: 10, marginTop: 8 }}>
          <div style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>
            You get paid to not sell your Bitcoin.
          </div>
        </div>
      </Section>
    </div>
  );
}

// ──────── CARD ────────
function CardScreen({ cardBal, go, hasCard, setHasCard }) {
  if (!hasCard) {
    return (
      <div style={{ padding: "0 20px", flex: 1, overflowY: "auto" }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 4 }}>Spending Card</div>
        <div style={{ fontSize: 12, color: C.dim, marginBottom: 24 }}>Spend your borrowed stablecoins, not your BTC.</div>

        {/* Hero card visual */}
        <div style={{
          background: "linear-gradient(135deg, #1a1a2e, #2d1f4e)",
          borderRadius: 20, padding: 28, marginBottom: 24, border: `1px solid ${C.border}`,
          position: "relative",
        }}>
          <div style={{ fontSize: 11, color: C.dim, letterSpacing: 2, marginBottom: 40 }}>SELF-CUSTODIAL NEOBANK</div>
          <div style={{ fontSize: 17, letterSpacing: 4, color: C.mid, marginBottom: 10 }}>•••• •••• •••• ••••</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <span style={{ fontSize: 12, color: C.dim }}>YOUR NAME</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.orange }}>Mastercard</span>
          </div>
          <div style={{ position: "absolute", top: 16, right: 20 }}>
            <Pill text="Up to 3% cashback" color={C.green} />
          </div>
        </div>

        {/* Value prop */}
        <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 6 }}>The fastest way to spend crypto</div>
        <div style={{ fontSize: 13, color: C.dim, marginBottom: 20, lineHeight: 1.5 }}>
          Your Mastercard converts stablecoins to local currency at checkout. 
          Up to 3% cashback on every purchase. 150M+ merchants worldwide.
        </div>

        {/* Steps */}
        <Section title="HOW IT WORKS">
          {[
            ["1", "Borrow stablecoins against your BTC vault", "No selling, no tax"],
            ["2", "Stablecoins auto-fund your card wallet", "One tap"],
            ["3", "Tap to pay anywhere Mastercard accepted", "Instant conversion to EUR/BGN"],
            ["4", "Earn 3% cashback on every purchase", "Credited as USDT"],
          ].map(([n, t, sub]) => (
            <div key={n} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
              <div style={{
                minWidth: 28, height: 28, borderRadius: 14, background: C.orangeDim,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: C.orange,
              }}>{n}</div>
              <div>
                <div style={{ fontSize: 13, color: C.text }}>{t}</div>
                <div style={{ fontSize: 11, color: C.dim }}>{sub}</div>
              </div>
            </div>
          ))}
        </Section>

        {/* KYC notice */}
        <div style={{ background: C.orangeDim, borderRadius: 12, padding: 14, marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: C.orange, fontWeight: 600, marginBottom: 4 }}>⚠️ Identity verification required</div>
          <div style={{ fontSize: 11, color: C.dim, lineHeight: 1.5 }}>
            Card issuance requires KYC (name, address, email) through Baanx / Crypto Life. 
            This is <span style={{ color: C.orange }}>only for the card</span> — your vault, collateral, 
            and BTC holdings stay private and non-custodial. The card provider never sees your total wealth.
          </div>
        </div>

        <button onClick={() => setHasCard(true)} style={{
          width: "100%", padding: 14, borderRadius: 12, border: "none",
          background: C.orange, color: C.bg, fontWeight: 700, fontSize: 15, cursor: "pointer",
        }}>Get Your Card →</button>
        <div style={{ textAlign: "center", fontSize: 11, color: C.dim, marginTop: 8 }}>
          Opens Crypto Life KYC in-app · Takes ~3 minutes
        </div>
      </div>
    );
  }

  // Card active state
  return (
    <div style={{ padding: "0 20px", flex: 1, overflowY: "auto" }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 4 }}>Spending Card</div>
      <div style={{ fontSize: 12, color: C.dim, marginBottom: 20 }}>Mastercard · Baanx</div>

      <div style={{
        background: `linear-gradient(135deg, ${C.orangeDim}, #1a1a2e)`,
        borderRadius: 20, padding: 22, marginBottom: 16, border: `1px solid ${C.orange}44`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: C.dim, letterSpacing: 1, marginBottom: 6 }}>BALANCE</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: C.white }}>€{(cardBal * EUR_RATE).toLocaleString("en", { maximumFractionDigits: 0 })}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: C.dim, marginBottom: 6 }}>CASHBACK EARNED</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.green }}>€47.20</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => go("lending")} style={{
            flex: 1, padding: "10px 0", borderRadius: 10, border: `1px solid ${C.orange}`,
            background: "transparent", color: C.orange, fontWeight: 600, fontSize: 12, cursor: "pointer",
          }}>+ Top Up</button>
          <button style={{
            flex: 1, padding: "10px 0", borderRadius: 10, border: `1px solid ${C.border}`,
            background: "transparent", color: C.mid, fontWeight: 600, fontSize: 12, cursor: "pointer",
          }}>Freeze</button>
          <button style={{
            flex: 1, padding: "10px 0", borderRadius: 10, border: `1px solid ${C.border}`,
            background: "transparent", color: C.mid, fontWeight: 600, fontSize: 12, cursor: "pointer",
          }}>Details</button>
        </div>
      </div>

      <div style={{ fontSize: 12, fontWeight: 600, color: C.mid, marginBottom: 10 }}>RECENT</div>
      {[
        { name: "Lidl Plovdiv", amount: -42.30, date: "Today 14:23", cb: 1.27 },
        { name: "Shell Trakia", amount: -85.00, date: "Yesterday 09:15", cb: 2.55 },
        { name: "Netflix", amount: -15.99, date: "Mar 28", cb: 0.48 },
        { name: "Amazon.de", amount: -129.00, date: "Mar 26", cb: 3.87 },
        { name: "Top-up from loan", amount: 500, date: "Mar 25", cb: 0 },
      ].map((tx, i) => (
        <div key={i} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "12px 0", borderBottom: `1px solid ${C.border}`,
        }}>
          <div>
            <div style={{ fontSize: 13, color: C.text }}>{tx.name}</div>
            <div style={{ fontSize: 10, color: C.dim }}>{tx.date}{tx.cb > 0 ? ` · +€${tx.cb.toFixed(2)} cashback` : ""}</div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: tx.amount > 0 ? C.green : C.text }}>
            {tx.amount > 0 ? "+" : ""}€{Math.abs(tx.amount).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ──────── DEPOSIT ────────
function DepositScreen({ go, onDeposit }) {
  const [method, setMethod] = useState(null);
  const [amount, setAmount] = useState("0.5");
  const [step, setStep] = useState(0);

  if (step === 2) {
    return (
      <div style={{ padding: "0 20px", flex: 1, textAlign: "center", paddingTop: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8 }}>Vault funded</div>
        <div style={{ fontSize: 13, color: C.dim, marginBottom: 20 }}>{amount} BTC deposited into your Simplicity vault</div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 24 }}>
          <Pill text="🔒 Time-lock: 24h" color={C.green} />
          <Pill text="🔑 2-of-3 recovery" color={C.blue} />
        </div>
        <Section title="VAULT CONTRACT">
          <InfoRow label="Type" value="Simplicity programmable vault" />
          <InfoRow label="Privacy" value="Confidential (hidden on-chain)" />
          <InfoRow label="Recovery" value="2-of-3 multi-sig after 90 days" />
          <InfoRow label="Spending limit" value="10%/day without co-sign" />
        </Section>
        <button onClick={() => { onDeposit(parseFloat(amount)); go("home"); }} style={{
          width: "100%", padding: 14, borderRadius: 12, border: "none",
          background: C.orange, color: C.bg, fontWeight: 700, fontSize: 15, cursor: "pointer",
        }}>Done</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 20px", flex: 1 }}>
      <button onClick={() => go("home")} style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", marginBottom: 16, fontSize: 14 }}>← Back</button>
      <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 4 }}>Deposit BTC</div>
      <div style={{ fontSize: 12, color: C.dim, marginBottom: 20 }}>Fund your vault to unlock borrowing.</div>

      {step === 0 && <>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.mid, marginBottom: 10 }}>Select method</div>
        {[
          { id: "instant", t: "Instant Swap", d: "BTC → L-BTC via SideSwap · ~30 sec", f: "0.1% fee", b: "Recommended", bc: C.green },
          { id: "ln", t: "Lightning → Liquid", d: "Send via Lightning, receive L-BTC", f: "0.05% fee", b: "Fast", bc: C.blue },
          { id: "peg", t: "Direct Peg-in", d: "On-chain to Liquid federation", f: "Free", b: "~17 hours", bc: C.orange },
        ].map(m => (
          <button key={m.id} onClick={() => setMethod(m.id)} style={{
            width: "100%", background: method === m.id ? C.cardAlt : C.card,
            border: `1px solid ${method === m.id ? C.orange : C.border}`,
            borderRadius: 14, padding: 14, cursor: "pointer", textAlign: "left", marginBottom: 8,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{m.t}</span>
              <Pill text={m.b} color={m.bc} />
            </div>
            <div style={{ fontSize: 11, color: C.dim }}>{m.d} · {m.f}</div>
          </button>
        ))}
        {method && <button onClick={() => setStep(1)} style={{
          width: "100%", padding: 14, borderRadius: 12, border: "none",
          background: C.orange, color: C.bg, fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 8,
        }}>Continue</button>}
      </>}

      {step === 1 && <>
        <Section title="AMOUNT">
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
            <input value={amount} onChange={e => setAmount(e.target.value)} style={{
              background: "none", border: "none", color: C.white, fontSize: 30,
              fontWeight: 800, width: 100, outline: "none",
            }} />
            <span style={{ fontSize: 15, color: C.orange, fontWeight: 600 }}>BTC</span>
          </div>
          <div style={{ fontSize: 13, color: C.dim }}>≈ €{(parseFloat(amount || 0) * BTC_PRICE * EUR_RATE).toLocaleString("en", { maximumFractionDigits: 0 })}</div>
        </Section>
        <Section title="VAULT SETTINGS">
          <InfoRow label="Time-lock" value="24h withdrawal delay" />
          <InfoRow label="Recovery" value="2-of-3 multi-sig (90 day fallback)" />
          <InfoRow label="Contract" value="Simplicity on Liquid mainnet" />
          <InfoRow label="Privacy" value="Confidential (amount hidden)" />
        </Section>
        <button onClick={() => setStep(2)} style={{
          width: "100%", padding: 14, borderRadius: 12, border: "none",
          background: C.orange, color: C.bg, fontWeight: 700, fontSize: 15, cursor: "pointer",
        }}>Create Vault & Deposit</button>
      </>}
    </div>
  );
}

// ──────── APP ────────
export default function App() {
  const [screen, setScreen] = useState("home");
  const [vault, setVault] = useState(0.8500);
  const [loan, setLoan] = useState(5000);
  const [cardBal, setCardBal] = useState(2200);
  const [hasCard, setHasCard] = useState(true);

  const nav = screen === "deposit" ? "home" : screen;

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      minHeight: "100vh", background: "#050508", padding: 20,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
    }}>
      <div style={{
        width: 390, height: 844, background: C.bg, borderRadius: 44,
        border: `3px solid #2A2A3E`, overflow: "hidden",
        display: "flex", flexDirection: "column",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
      }}>
        <StatusBar />
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 4 }}>
          {screen === "home" && <HomeScreen go={setScreen} vault={vault} loan={loan} cardBal={cardBal} />}
          {screen === "deposit" && <DepositScreen go={setScreen} onDeposit={a => setVault(v => v + a)} />}
          {screen === "lending" && <LendingScreen vault={vault} loan={loan} go={setScreen}
            onBorrow={a => { setLoan(l => l + a); setCardBal(c => c + a); }}
            onRepay={a => setLoan(l => Math.max(0, l - a))} />}
          {screen === "card" && <CardScreen cardBal={cardBal} go={setScreen} hasCard={hasCard} setHasCard={setHasCard} />}
          {screen === "settings" && <div style={{ padding: "0 20px" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 20 }}>Settings</div>
            <Section title="VAULT MANAGEMENT">
              <InfoRow label="Recovery keys" value="2 of 3 configured" valueColor={C.green} />
              <InfoRow label="Time-lock" value="24 hours" />
              <InfoRow label="Spending limit" value="10% / day" />
            </Section>
            <Section title="NETWORK">
              <InfoRow label="Network" value="Liquid mainnet" />
              <InfoRow label="Node" value="Blockstream (default)" />
              <InfoRow label="Privacy" value="Confidential Txs enabled" valueColor={C.green} />
            </Section>
          </div>}
        </div>
        <NavBar active={nav} go={setScreen} />
      </div>
    </div>
  );
}
