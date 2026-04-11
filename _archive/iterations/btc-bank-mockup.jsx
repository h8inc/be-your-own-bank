import { useState } from "react";

const COLORS = {
  bg: "#0A0A0F",
  card: "#141420",
  cardHover: "#1A1A2E",
  border: "#2A2A3E",
  orange: "#F7931A",
  orangeDim: "#F7931A33",
  green: "#22C55E",
  greenDim: "#22C55E22",
  red: "#EF4444",
  redDim: "#EF444422",
  blue: "#3B82F6",
  blueDim: "#3B82F622",
  text: "#F0F0F5",
  textDim: "#8888AA",
  textMid: "#BBBBDD",
  white: "#FFFFFF",
};

const btcPrice = 70500;

function Icon({ name, size = 20, color = COLORS.textDim }) {
  const icons = {
    vault: "🔒", savings: "💰", borrow: "📊", card: "💳", home: "⬡",
    arrow: "→", back: "←", btc: "₿", shield: "🛡️", alert: "⚠️",
    check: "✓", clock: "⏱", up: "↑", down: "↓", swap: "⇄",
    settings: "⚙", info: "ⓘ", plus: "+", chart: "📈", send: "↗",
    receive: "↙", repay: "↩", eye: "👁", lock: "🔐",
  };
  return <span style={{ fontSize: size, lineHeight: 1 }}>{icons[name] || "•"}</span>;
}

function StatusBar() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 20px", fontSize: 12, color: COLORS.textDim }}>
      <span>9:41</span>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <span style={{ fontSize: 10 }}>5G</span>
        <span style={{ fontSize: 10 }}>■■■</span>
        <span style={{ fontSize: 10 }}>🔋</span>
      </div>
    </div>
  );
}

function NavBar({ active, onNavigate }) {
  const items = [
    { id: "home", icon: "home", label: "Home" },
    { id: "savings", icon: "vault", label: "Vault" },
    { id: "borrow", icon: "borrow", label: "Borrow" },
    { id: "card", icon: "card", label: "Card" },
  ];
  return (
    <div style={{
      display: "flex", justifyContent: "space-around", padding: "12px 0 24px",
      borderTop: `1px solid ${COLORS.border}`, background: COLORS.bg,
    }}>
      {items.map(item => (
        <button key={item.id} onClick={() => onNavigate(item.id)} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          color: active === item.id ? COLORS.orange : COLORS.textDim,
          transition: "color 0.2s",
        }}>
          <Icon name={item.icon} size={22} />
          <span style={{ fontSize: 10, fontWeight: active === item.id ? 700 : 400 }}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

function HomeScreen({ onNavigate, vaultBalance, loanBalance, cardBalance }) {
  const totalBtc = vaultBalance;
  const totalEur = totalBtc * btcPrice * 0.92;
  return (
    <div style={{ padding: "0 20px", flex: 1, overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 2 }}>Good morning</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.text }}>Your Wealth</div>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: 18, background: COLORS.orangeDim,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="settings" size={16} />
        </div>
      </div>

      <div style={{
        background: `linear-gradient(135deg, ${COLORS.card} 0%, #1E1E35 100%)`,
        borderRadius: 20, padding: 24, marginBottom: 20,
        border: `1px solid ${COLORS.border}`,
      }}>
        <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 8, letterSpacing: 1 }}>NET WORTH</div>
        <div style={{ fontSize: 36, fontWeight: 800, color: COLORS.white, marginBottom: 4 }}>
          {totalBtc.toFixed(4)} <span style={{ fontSize: 18, color: COLORS.orange }}>BTC</span>
        </div>
        <div style={{ fontSize: 16, color: COLORS.textDim }}>≈ €{totalEur.toLocaleString("en", { maximumFractionDigits: 0 })}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <span style={{
            fontSize: 11, color: COLORS.green, background: COLORS.greenDim,
            padding: "4px 10px", borderRadius: 20,
          }}>🔒 Confidential</span>
          <span style={{
            fontSize: 11, color: COLORS.blue, background: COLORS.blueDim,
            padding: "4px 10px", borderRadius: 20,
          }}>Liquid Network</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <button onClick={() => onNavigate("savings")} style={{
          background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16,
          padding: 16, cursor: "pointer", textAlign: "left",
        }}>
          <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 8 }}>VAULT</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>{vaultBalance.toFixed(4)}</div>
          <div style={{ fontSize: 12, color: COLORS.orange }}>BTC</div>
        </button>
        <button onClick={() => onNavigate("borrow")} style={{
          background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16,
          padding: 16, cursor: "pointer", textAlign: "left",
        }}>
          <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 8 }}>CREDIT LINE</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>€{(loanBalance * 0.92).toLocaleString("en", { maximumFractionDigits: 0 })}</div>
          <div style={{ fontSize: 12, color: loanBalance > 0 ? COLORS.orange : COLORS.green }}>{loanBalance > 0 ? "Active loan" : "Available"}</div>
        </button>
      </div>

      <button onClick={() => onNavigate("card")} style={{
        background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16,
        padding: 16, cursor: "pointer", textAlign: "left", width: "100%", marginBottom: 20,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 4 }}>SPENDING CARD</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>€{(cardBalance * 0.92).toLocaleString("en", { maximumFractionDigits: 0 })}</div>
        </div>
        <div style={{ fontSize: 12, color: COLORS.textDim }}>Mastercard →</div>
      </button>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMid, marginBottom: 12 }}>Quick Actions</div>
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { icon: "receive", label: "Deposit", screen: "deposit" },
            { icon: "swap", label: "Borrow", screen: "borrow" },
            { icon: "send", label: "Send", screen: "home" },
            { icon: "repay", label: "Repay", screen: "repay" },
          ].map(a => (
            <button key={a.label} onClick={() => onNavigate(a.screen)} style={{
              flex: 1, background: COLORS.card, border: `1px solid ${COLORS.border}`,
              borderRadius: 12, padding: "12px 4px", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            }}>
              <Icon name={a.icon} size={18} />
              <span style={{ fontSize: 10, color: COLORS.textDim }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DepositScreen({ onBack, onDeposit }) {
  const [method, setMethod] = useState(null);
  const [amount, setAmount] = useState("0.5");
  const [step, setStep] = useState(0);

  if (step === 2) {
    return (
      <div style={{ padding: "0 20px", flex: 1 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: COLORS.textDim, cursor: "pointer", marginBottom: 20, fontSize: 14 }}>← Back</button>
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>Vault Created</div>
          <div style={{ fontSize: 14, color: COLORS.textDim, marginBottom: 8 }}>{amount} BTC deposited into your Simplicity vault</div>
          <div style={{ fontSize: 12, color: COLORS.green, background: COLORS.greenDim, display: "inline-block", padding: "6px 14px", borderRadius: 20, marginBottom: 24 }}>
            🔒 Time-lock: 24h · Multi-sig recovery enabled
          </div>
          <div style={{ background: COLORS.card, borderRadius: 12, padding: 16, textAlign: "left", marginTop: 16, border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 8 }}>VAULT DETAILS</div>
            <div style={{ fontSize: 13, color: COLORS.textMid, marginBottom: 6 }}>Contract: Simplicity vault with HTLC time-lock</div>
            <div style={{ fontSize: 13, color: COLORS.textMid, marginBottom: 6 }}>Privacy: Confidential transaction (amount hidden)</div>
            <div style={{ fontSize: 13, color: COLORS.textMid, marginBottom: 6 }}>Recovery: 2-of-3 multi-sig after 90 days</div>
            <div style={{ fontSize: 13, color: COLORS.textMid }}>Network: Liquid (L-BTC)</div>
          </div>
          <button onClick={() => { onDeposit(parseFloat(amount)); onBack(); }} style={{
            width: "100%", padding: 16, borderRadius: 12, border: "none",
            background: COLORS.orange, color: COLORS.bg, fontWeight: 700,
            fontSize: 16, cursor: "pointer", marginTop: 24,
          }}>Done</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 20px", flex: 1 }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: COLORS.textDim, cursor: "pointer", marginBottom: 20, fontSize: 14 }}>← Back</button>
      <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>Deposit BTC</div>
      <div style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 24 }}>Your BTC will be secured in a Simplicity vault on Liquid. You control the keys.</div>

      {step === 0 && (
        <>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMid, marginBottom: 12 }}>How would you like to deposit?</div>
          {[
            { id: "instant", title: "Instant Swap", desc: "BTC → L-BTC via SideSwap (~30 sec)", fee: "0.1% fee", badge: "Recommended", badgeColor: COLORS.green },
            { id: "lightning", title: "Lightning → Liquid", desc: "Send via Lightning, receive L-BTC", fee: "0.05% fee", badge: "Fast", badgeColor: COLORS.blue },
            { id: "pegin", title: "Direct Peg-in", desc: "Send BTC on-chain to Liquid federation", fee: "No fee", badge: "~17 hours", badgeColor: COLORS.orange },
          ].map(m => (
            <button key={m.id} onClick={() => { setMethod(m.id); }} style={{
              width: "100%", background: method === m.id ? COLORS.cardHover : COLORS.card,
              border: `1px solid ${method === m.id ? COLORS.orange : COLORS.border}`,
              borderRadius: 14, padding: 16, cursor: "pointer", textAlign: "left",
              marginBottom: 10, transition: "all 0.2s",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: COLORS.text }}>{m.title}</span>
                <span style={{ fontSize: 10, color: m.badgeColor, background: m.badgeColor + "22", padding: "3px 8px", borderRadius: 10 }}>{m.badge}</span>
              </div>
              <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 2 }}>{m.desc}</div>
              <div style={{ fontSize: 11, color: COLORS.textMid }}>{m.fee}</div>
            </button>
          ))}
          {method && (
            <button onClick={() => setStep(1)} style={{
              width: "100%", padding: 16, borderRadius: 12, border: "none",
              background: COLORS.orange, color: COLORS.bg, fontWeight: 700,
              fontSize: 16, cursor: "pointer", marginTop: 12,
            }}>Continue</button>
          )}
        </>
      )}

      {step === 1 && (
        <>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMid, marginBottom: 12 }}>Amount to deposit</div>
          <div style={{
            background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14,
            padding: 20, marginBottom: 16,
          }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
              <input value={amount} onChange={e => setAmount(e.target.value)} style={{
                background: "none", border: "none", color: COLORS.white, fontSize: 32,
                fontWeight: 800, width: 120, outline: "none",
              }} />
              <span style={{ fontSize: 16, color: COLORS.orange, fontWeight: 600 }}>BTC</span>
            </div>
            <div style={{ fontSize: 14, color: COLORS.textDim }}>≈ €{(parseFloat(amount || 0) * btcPrice * 0.92).toLocaleString("en", { maximumFractionDigits: 0 })}</div>
          </div>

          <div style={{ background: COLORS.card, borderRadius: 14, padding: 16, marginBottom: 16, border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMid, marginBottom: 12 }}>VAULT CONFIGURATION</div>
            {[
              ["Time-lock", "24 hours (withdrawals delayed)"],
              ["Recovery", "2-of-3 multi-sig after 90 days"],
              ["Contract", "Simplicity on Liquid mainnet"],
              ["Privacy", "Confidential (amount hidden on-chain)"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: COLORS.textDim }}>{k}</span>
                <span style={{ fontSize: 12, color: COLORS.textMid }}>{v}</span>
              </div>
            ))}
          </div>

          <button onClick={() => setStep(2)} style={{
            width: "100%", padding: 16, borderRadius: 12, border: "none",
            background: COLORS.orange, color: COLORS.bg, fontWeight: 700,
            fontSize: 16, cursor: "pointer",
          }}>Create Vault & Deposit</button>
        </>
      )}
    </div>
  );
}

function SavingsScreen({ onNavigate, vaultBalance }) {
  return (
    <div style={{ padding: "0 20px", flex: 1 }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>Your Vault</div>
      <div style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 24 }}>Self-custodial · Simplicity contract on Liquid</div>

      <div style={{
        background: `linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)`,
        borderRadius: 20, padding: 24, marginBottom: 20,
        border: `1px solid ${COLORS.border}`, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 16, right: 16, fontSize: 10, color: COLORS.green, background: COLORS.greenDim, padding: "3px 10px", borderRadius: 10 }}>🔒 Secured</div>
        <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 12, letterSpacing: 1 }}>VAULT BALANCE</div>
        <div style={{ fontSize: 36, fontWeight: 800, color: COLORS.white, marginBottom: 4 }}>
          {vaultBalance.toFixed(4)} <span style={{ fontSize: 18, color: COLORS.orange }}>BTC</span>
        </div>
        <div style={{ fontSize: 16, color: COLORS.textDim, marginBottom: 16 }}>
          ≈ €{(vaultBalance * btcPrice * 0.92).toLocaleString("en", { maximumFractionDigits: 0 })}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => onNavigate("deposit")} style={{
            flex: 1, padding: "10px 0", borderRadius: 10, border: `1px solid ${COLORS.orange}`,
            background: "transparent", color: COLORS.orange, fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}>+ Deposit</button>
          <button style={{
            flex: 1, padding: "10px 0", borderRadius: 10, border: `1px solid ${COLORS.border}`,
            background: "transparent", color: COLORS.textMid, fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}>Withdraw</button>
        </div>
      </div>

      <div style={{ background: COLORS.card, borderRadius: 14, padding: 16, marginBottom: 16, border: `1px solid ${COLORS.border}` }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMid, marginBottom: 14 }}>VAULT DETAILS</div>
        {[
          ["Type", "Simplicity Programmable Vault"],
          ["Time-lock", "24h withdrawal delay"],
          ["Recovery", "2-of-3 multi-sig (90 day fallback)"],
          ["Spending rules", "Max 10% per 24h without co-sign"],
          ["Network", "Liquid (confidential)"],
          ["Yield", "None — your BTC, untouched"],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: COLORS.textDim }}>{k}</span>
            <span style={{ fontSize: 12, color: COLORS.textMid, textAlign: "right", maxWidth: "55%" }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ background: COLORS.card, borderRadius: 14, padding: 16, border: `1px solid ${COLORS.border}` }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMid, marginBottom: 10 }}>WHY NO YIELD?</div>
        <div style={{ fontSize: 12, color: COLORS.textDim, lineHeight: 1.6 }}>
          Your BTC sits in a smart contract you control. Nobody lends it out. Nobody rehypothecates it. 
          That's why platforms that promise BTC yield (Celsius, BlockFi, Voyager) collapsed — they lent your coins and couldn't return them. 
          Your yield is BTC appreciation. Your vault is a fortress, not a casino.
        </div>
      </div>
    </div>
  );
}

function BorrowScreen({ vaultBalance, loanBalance, onBorrow }) {
  const [ltv, setLtv] = useState(25);
  const maxBorrow = vaultBalance * btcPrice * (ltv / 100);
  const [borrowAmount, setBorrowAmount] = useState(maxBorrow * 0.5);
  const currentLtv = loanBalance > 0 ? (loanBalance / (vaultBalance * btcPrice)) * 100 : 0;

  const liquidationPrice = loanBalance > 0 ? (loanBalance / (vaultBalance * 0.75)) : 0;
  const marginCallPrice = loanBalance > 0 ? (loanBalance / (vaultBalance * 0.60)) : 0;

  const riskColor = ltv <= 25 ? COLORS.green : ltv <= 35 ? COLORS.orange : COLORS.red;
  const riskLabel = ltv <= 25 ? "Conservative" : ltv <= 35 ? "Moderate" : "Aggressive";

  const probSafe12m = ltv <= 25 ? 96 : ltv <= 30 ? 91 : ltv <= 35 ? 84 : 72;

  return (
    <div style={{ padding: "0 20px", flex: 1, overflowY: "auto" }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>Borrow</div>
      <div style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 24 }}>Borrow stablecoins against your BTC. Never sell.</div>

      {loanBalance > 0 && (
        <div style={{
          background: COLORS.card, borderRadius: 16, padding: 20, marginBottom: 20,
          border: `1px solid ${COLORS.border}`,
        }}>
          <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 8, letterSpacing: 1 }}>ACTIVE LOAN</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.white, marginBottom: 4 }}>
            ${loanBalance.toLocaleString("en", { maximumFractionDigits: 0 })} <span style={{ fontSize: 14, color: COLORS.textDim }}>USDT</span>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
            <div>
              <div style={{ fontSize: 10, color: COLORS.textDim }}>Current LTV</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: currentLtv < 30 ? COLORS.green : COLORS.orange }}>{currentLtv.toFixed(1)}%</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: COLORS.textDim }}>APR</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.textMid }}>3.2%</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: COLORS.textDim }}>Margin call at</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.orange }}>${marginCallPrice.toLocaleString("en", { maximumFractionDigits: 0 })}</div>
            </div>
          </div>
        </div>
      )}

      <div style={{
        background: COLORS.card, borderRadius: 16, padding: 20, marginBottom: 16,
        border: `1px solid ${COLORS.border}`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMid }}>LOAN-TO-VALUE RATIO</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: riskColor }}>{ltv}% · {riskLabel}</div>
        </div>

        <input type="range" min={10} max={40} value={ltv} onChange={e => { setLtv(+e.target.value); setBorrowAmount(vaultBalance * btcPrice * (+e.target.value / 100) * 0.5); }}
          style={{ width: "100%", accentColor: riskColor, marginBottom: 12 }} />

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: COLORS.textDim, marginBottom: 16 }}>
          <span>10% Safe</span><span>25% Conservative</span><span>40% Max</span>
        </div>

        <div style={{ background: riskColor + "15", borderRadius: 10, padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: riskColor, fontWeight: 600, marginBottom: 4 }}>
            {ltv <= 25 ? "🛡️ Low risk" : ltv <= 35 ? "⚠️ Moderate risk" : "🔴 Higher risk"}
          </div>
          <div style={{ fontSize: 11, color: COLORS.textDim, lineHeight: 1.5 }}>
            {ltv <= 25
              ? `BTC would need to drop 75% before liquidation. Based on historical data, ~${probSafe12m}% probability your position survives 12 months without margin call.`
              : ltv <= 35
              ? `BTC would need to drop ~${Math.round(100 - (ltv / 0.75))}% before liquidation. ~${probSafe12m}% probability of surviving 12 months without margin call.`
              : `Higher liquidation risk. BTC drop of ~${Math.round(100 - (ltv / 0.75))}% triggers liquidation. Only ~${probSafe12m}% probability of surviving 12 months.`}
          </div>
        </div>
      </div>

      <div style={{
        background: COLORS.card, borderRadius: 16, padding: 20, marginBottom: 16,
        border: `1px solid ${COLORS.border}`,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMid, marginBottom: 12 }}>BORROW AMOUNT</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 32, fontWeight: 800, color: COLORS.white }}>${borrowAmount.toLocaleString("en", { maximumFractionDigits: 0 })}</span>
          <span style={{ fontSize: 14, color: COLORS.textDim }}>USDT</span>
        </div>
        <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 12 }}>
          ≈ €{(borrowAmount * 0.92).toLocaleString("en", { maximumFractionDigits: 0 })} · Max: ${maxBorrow.toLocaleString("en", { maximumFractionDigits: 0 })}
        </div>
        <input type="range" min={0} max={maxBorrow} value={borrowAmount} onChange={e => setBorrowAmount(+e.target.value)}
          style={{ width: "100%", accentColor: COLORS.orange }} />

        <div style={{ background: COLORS.card, borderRadius: 10, padding: 12, marginTop: 12, border: `1px solid ${COLORS.border}` }}>
          {[
            ["Collateral locked", `${(borrowAmount / btcPrice / (ltv / 100)).toFixed(4)} BTC`],
            ["Interest rate", "3.2% APR (variable)"],
            ["Monthly cost", `$${(borrowAmount * 0.032 / 12).toFixed(2)}`],
            ["Liquidation price", `$${(borrowAmount / ((borrowAmount / btcPrice / (ltv / 100)) * 0.75)).toLocaleString("en", { maximumFractionDigits: 0 })}`],
            ["No taxable event", "✓ Borrowing is not a sale"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: COLORS.textDim }}>{k}</span>
              <span style={{ fontSize: 11, color: k.includes("tax") ? COLORS.green : COLORS.textMid, fontWeight: k.includes("tax") ? 600 : 400 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => onBorrow(borrowAmount)} style={{
        width: "100%", padding: 16, borderRadius: 12, border: "none",
        background: COLORS.orange, color: COLORS.bg, fontWeight: 700,
        fontSize: 16, cursor: "pointer", marginBottom: 16,
      }}>Borrow ${borrowAmount.toLocaleString("en", { maximumFractionDigits: 0 })}</button>
    </div>
  );
}

function CardScreen({ cardBalance, onNavigate }) {
  const [setup, setSetup] = useState(cardBalance > 0);
  
  if (!setup) {
    return (
      <div style={{ padding: "0 20px", flex: 1 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>Spending Card</div>
        <div style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 32 }}>Spend your borrowed stablecoins anywhere Mastercard is accepted.</div>

        <div style={{
          background: `linear-gradient(135deg, #1a1a2e, #2d1f4e)`,
          borderRadius: 20, padding: 28, marginBottom: 24,
          border: `1px solid ${COLORS.border}`, position: "relative",
        }}>
          <div style={{ fontSize: 11, color: COLORS.textDim, letterSpacing: 2, marginBottom: 40 }}>SELF-CUSTODIAL</div>
          <div style={{ fontSize: 18, letterSpacing: 4, color: COLORS.textMid, marginBottom: 12 }}>•••• •••• •••• ••••</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: COLORS.textDim }}>YOUR NAME</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.orange }}>Mastercard</span>
          </div>
        </div>

        <div style={{ background: COLORS.card, borderRadius: 14, padding: 16, marginBottom: 20, border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMid, marginBottom: 12 }}>HOW IT WORKS</div>
          {[
            ["1.", "You borrow stablecoins against your BTC vault"],
            ["2.", "Stablecoins fund your card spending wallet"],
            ["3.", "At checkout, Baanx converts to local currency"],
            ["4.", "Merchant receives EUR/USD via Mastercard"],
            ["5.", "Your BTC stays untouched in your vault"],
          ].map(([n, t]) => (
            <div key={n} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: COLORS.orange, fontWeight: 700, minWidth: 20 }}>{n}</span>
              <span style={{ fontSize: 12, color: COLORS.textDim }}>{t}</span>
            </div>
          ))}
        </div>

        <div style={{ background: COLORS.orangeDim, borderRadius: 12, padding: 14, marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: COLORS.orange, fontWeight: 600, marginBottom: 4 }}>⚠️ KYC Required for Card</div>
          <div style={{ fontSize: 11, color: COLORS.textDim, lineHeight: 1.5 }}>
            Card issuance requires identity verification (name, address, email) through our card partner Baanx. 
            This is separate from your vault — your BTC holdings remain private and non-custodial.
          </div>
        </div>

        <button onClick={() => setSetup(true)} style={{
          width: "100%", padding: 16, borderRadius: 12, border: "none",
          background: COLORS.orange, color: COLORS.bg, fontWeight: 700,
          fontSize: 16, cursor: "pointer",
        }}>Set Up Card</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 20px", flex: 1 }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>Spending Card</div>
      <div style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 24 }}>Powered by Baanx · Mastercard</div>

      <div style={{
        background: `linear-gradient(135deg, #F7931A22, #1a1a2e)`,
        borderRadius: 20, padding: 24, marginBottom: 20,
        border: `1px solid ${COLORS.orange}44`,
      }}>
        <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 12, letterSpacing: 1 }}>CARD BALANCE</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.white }}>
          €{(cardBalance * 0.92).toLocaleString("en", { maximumFractionDigits: 0 })}
        </div>
        <div style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 16 }}>{cardBalance.toLocaleString("en", { maximumFractionDigits: 0 })} USDT</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => onNavigate("borrow")} style={{
            flex: 1, padding: "10px 0", borderRadius: 10, border: `1px solid ${COLORS.orange}`,
            background: "transparent", color: COLORS.orange, fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}>+ Top Up from Loan</button>
          <button style={{
            flex: 1, padding: "10px 0", borderRadius: 10, border: `1px solid ${COLORS.border}`,
            background: "transparent", color: COLORS.textMid, fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}>Freeze Card</button>
        </div>
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMid, marginBottom: 12 }}>RECENT TRANSACTIONS</div>
      {[
        { name: "Lidl Plovdiv", amount: -42.30, date: "Today, 14:23" },
        { name: "Shell Petrol", amount: -85.00, date: "Yesterday, 09:15" },
        { name: "Netflix", amount: -15.99, date: "Mar 28" },
        { name: "Top-up from loan", amount: 500, date: "Mar 25" },
      ].map((tx, i) => (
        <div key={i} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "14px 0", borderBottom: `1px solid ${COLORS.border}`,
        }}>
          <div>
            <div style={{ fontSize: 14, color: COLORS.text }}>{tx.name}</div>
            <div style={{ fontSize: 11, color: COLORS.textDim }}>{tx.date}</div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: tx.amount > 0 ? COLORS.green : COLORS.text }}>
            {tx.amount > 0 ? "+" : ""}€{Math.abs(tx.amount).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}

function RepayScreen({ loanBalance, onRepay, onBack }) {
  const monthlyInterest = loanBalance * 0.032 / 12;
  const minPayment = monthlyInterest;
  const [payAmount, setPayAmount] = useState(Math.round(monthlyInterest + loanBalance * 0.05));

  return (
    <div style={{ padding: "0 20px", flex: 1 }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: COLORS.textDim, cursor: "pointer", marginBottom: 20, fontSize: 14 }}>← Back</button>
      <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>Repay Loan</div>
      <div style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 24 }}>Pay down your balance to unlock collateral.</div>

      <div style={{ background: COLORS.card, borderRadius: 16, padding: 20, marginBottom: 16, border: `1px solid ${COLORS.border}` }}>
        <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 8 }}>OUTSTANDING BALANCE</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.white, marginBottom: 12 }}>${loanBalance.toLocaleString("en", { maximumFractionDigits: 0 })}</div>
        {[
          ["Interest rate", "3.2% APR"],
          ["Monthly interest", `$${monthlyInterest.toFixed(2)}`],
          ["Minimum payment", `$${minPayment.toFixed(2)} (interest only)`],
          ["Collateral locked", `${(loanBalance / btcPrice / 0.25).toFixed(4)} BTC`],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: COLORS.textDim }}>{k}</span>
            <span style={{ fontSize: 11, color: COLORS.textMid }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ background: COLORS.card, borderRadius: 16, padding: 20, marginBottom: 16, border: `1px solid ${COLORS.border}` }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMid, marginBottom: 12 }}>REPAYMENT</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[
            { label: "Interest only", val: Math.round(minPayment) },
            { label: "Interest + 5%", val: Math.round(minPayment + loanBalance * 0.05) },
            { label: "Pay 50%", val: Math.round(loanBalance * 0.5) },
            { label: "Full", val: loanBalance },
          ].map(opt => (
            <button key={opt.label} onClick={() => setPayAmount(opt.val)} style={{
              flex: 1, padding: "8px 2px", borderRadius: 8, fontSize: 10,
              border: `1px solid ${payAmount === opt.val ? COLORS.orange : COLORS.border}`,
              background: payAmount === opt.val ? COLORS.orangeDim : "transparent",
              color: payAmount === opt.val ? COLORS.orange : COLORS.textDim, cursor: "pointer",
            }}>{opt.label}</button>
          ))}
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.white, marginBottom: 4 }}>${payAmount.toLocaleString("en", { maximumFractionDigits: 0 })}</div>
        <div style={{ fontSize: 11, color: COLORS.textDim }}>
          {payAmount >= loanBalance ? "Full repayment — all collateral unlocked" :
           payAmount <= minPayment ? "Interest only — balance unchanged, collateral stays locked" :
           `Reduces balance to $${(loanBalance - payAmount).toLocaleString("en", { maximumFractionDigits: 0 })} · unlocks ${((payAmount / loanBalance) * (loanBalance / btcPrice / 0.25)).toFixed(4)} BTC`}
        </div>
      </div>

      <div style={{ background: COLORS.blueDim, borderRadius: 12, padding: 14, marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: COLORS.blue, fontWeight: 600, marginBottom: 4 }}>ⓘ Missed payments</div>
        <div style={{ fontSize: 11, color: COLORS.textDim, lineHeight: 1.5 }}>
          If you miss a payment, interest continues accruing on your full balance. 
          There's no penalty fee — but your LTV ratio increases, bringing you closer to liquidation. 
          The contract will auto-liquidate if LTV exceeds 75%. You can always add more collateral to lower your LTV.
        </div>
      </div>

      <button onClick={() => onRepay(payAmount)} style={{
        width: "100%", padding: 16, borderRadius: 12, border: "none",
        background: COLORS.orange, color: COLORS.bg, fontWeight: 700,
        fontSize: 16, cursor: "pointer",
      }}>Repay ${payAmount.toLocaleString("en", { maximumFractionDigits: 0 })}</button>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [vaultBalance, setVaultBalance] = useState(0.8500);
  const [loanBalance, setLoanBalance] = useState(5000);
  const [cardBalance, setCardBalance] = useState(2200);

  const navScreen = screen === "deposit" || screen === "repay" ? "home" : screen;

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      minHeight: "100vh", background: "#050508", padding: 20,
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{
        width: 390, height: 844, background: COLORS.bg, borderRadius: 44,
        border: `3px solid #2A2A3E`, overflow: "hidden",
        display: "flex", flexDirection: "column", position: "relative",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}>
        <StatusBar />
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 8 }}>
          {screen === "home" && <HomeScreen onNavigate={setScreen} vaultBalance={vaultBalance} loanBalance={loanBalance} cardBalance={cardBalance} />}
          {screen === "deposit" && <DepositScreen onBack={() => setScreen("home")} onDeposit={(amt) => setVaultBalance(v => v + amt)} />}
          {screen === "savings" && <SavingsScreen onNavigate={setScreen} vaultBalance={vaultBalance} />}
          {screen === "borrow" && <BorrowScreen vaultBalance={vaultBalance} loanBalance={loanBalance} onBorrow={(amt) => { setLoanBalance(l => l + amt); setCardBalance(c => c + amt); setScreen("home"); }} />}
          {screen === "card" && <CardScreen cardBalance={cardBalance} onNavigate={setScreen} />}
          {screen === "repay" && <RepayScreen loanBalance={loanBalance} onRepay={(amt) => { setLoanBalance(l => Math.max(0, l - amt)); setScreen("home"); }} onBack={() => setScreen("home")} />}
        </div>
        <NavBar active={navScreen} onNavigate={setScreen} />
      </div>
    </div>
  );
}
