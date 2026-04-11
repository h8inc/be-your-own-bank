import { useState } from "react";

/*
  ╔═══════════════════════════════════════════════════════════════╗
  ║  BTC Bank — Self-custodial Bitcoin banking                    ║
  ║  Theme: Sovereign Stack                                       ║
  ║  Liquid network · Simplicity contracts                        ║
  ║                                                               ║
  ║  Design: Revolut-grade fintech for bitcoiners.                ║
  ║  Dark, warm, monospace numbers, single amber accent.          ║
  ║  No gradients on cards. No centered hero blocks.              ║
  ║  Information-dense. Precision over decoration.                ║
  ╚═══════════════════════════════════════════════════════════════╝
*/

const BTC_PRICE = 84500;
const EUR_RATE = 0.92;

// ─── Sovereign Stack Tokens ───
const c = {
  bg:             "#0C0C0E",
  surface:        "#141416",
  surfaceRaised:  "#1C1C1F",
  border:         "#2A2A2D",
  borderSubtle:   "#1E1E21",
  accent:         "#E8890C",
  accentDim:      "#E8890C18",
  accentSoft:     "#E8890C44",
  positive:       "#4ADE80",
  positiveDim:    "#4ADE8012",
  negative:       "#F87171",
  negativeDim:    "#F8717112",
  info:           "#60A5FA",
  infoDim:        "#60A5FA12",
  text:           "#E8E6E1",
  sub:            "#9B9A95",
  mute:           "#6B6A66",
};

const f = {
  mono: "'SF Mono','JetBrains Mono','Fira Code','Consolas',monospace",
  sans: "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif",
  display: "'SF Pro Display',-apple-system,BlinkMacSystemFont,system-ui,sans-serif",
};

// ─── Primitives ───
const Label = ({ children, s }) => (
  <div style={{ fontSize: 10, fontWeight: 500, color: c.mute, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: f.sans, ...s }}>{children}</div>
);

const Num = ({ children, large, color, s }) => (
  <div style={{ fontSize: large ? 34 : 20, fontWeight: 600, color: color || c.text, fontFamily: f.mono, letterSpacing: "-0.03em", lineHeight: 1.15, ...s }}>{children}</div>
);

const Row = ({ label, value, color, accent }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "7px 0", borderBottom: `1px solid ${c.borderSubtle}` }}>
    <span style={{ fontSize: 12, color: c.sub, fontFamily: f.sans }}>{label}</span>
    <span style={{ fontSize: 12, color: color || c.text, fontWeight: accent ? 600 : 400, fontFamily: f.mono }}>{value}</span>
  </div>
);

const Card = ({ children, onClick, glow, s }) => (
  <div onClick={onClick} style={{
    background: c.surface, border: `1px solid ${glow || c.border}`,
    borderRadius: 6, padding: 16, cursor: onClick ? "pointer" : "default",
    transition: "border-color 0.2s", ...s,
  }}>{children}</div>
);

const Btn = ({ children, onClick, primary, ghost, danger, disabled, compact, s }) => {
  const bg = disabled ? c.border : danger ? c.negativeDim : primary ? c.accent : "transparent";
  const fg = disabled ? c.mute : danger ? c.negative : primary ? "#0C0C0E" : ghost ? c.sub : c.accent;
  const bd = primary || disabled ? "none" : danger ? `1px solid ${c.negative}33` : `1px solid ${c.border}`;
  return (
    <button onClick={disabled ? undefined : onClick} style={{
      width: compact ? "auto" : "100%", padding: compact ? "8px 16px" : "14px 0",
      borderRadius: 6, border: bd, background: bg, color: fg,
      fontWeight: 600, fontSize: compact ? 12 : 14, cursor: disabled ? "default" : "pointer",
      fontFamily: f.sans, letterSpacing: "0.01em", transition: "all 0.15s", ...s,
    }}>{children}</button>
  );
};

const Back = ({ onClick, label }) => (
  <button onClick={onClick} style={{
    background: "none", border: "none", color: c.mute, cursor: "pointer",
    marginBottom: 20, fontSize: 13, fontFamily: f.sans, padding: 0,
    display: "flex", alignItems: "center", gap: 6, transition: "color 0.15s",
  }}>
    <span style={{ fontSize: 18, lineHeight: 1, fontWeight: 300 }}>‹</span> {label || "Back"}
  </button>
);

const Badge = ({ text, color }) => (
  <span style={{
    fontSize: 9, fontWeight: 600, color: color || c.mute,
    background: (color || c.mute) + "18", padding: "3px 8px", borderRadius: 3,
    fontFamily: f.sans, letterSpacing: "0.05em", textTransform: "uppercase",
  }}>{text}</span>
);

const Divider = () => <div style={{ height: 1, background: c.borderSubtle, margin: "12px 0" }} />;

function StatusBar() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 24px 6px", fontSize: 12, color: c.mute, fontFamily: f.sans, fontWeight: 500 }}>
      <span>9:41</span>
      <div style={{ display: "flex", gap: 6, fontSize: 10, alignItems: "center" }}>
        <span>5G</span>
        <svg width="16" height="10" viewBox="0 0 16 10"><rect x="0" y="4" width="3" height="6" rx="0.5" fill={c.mute}/><rect x="4.5" y="2" width="3" height="8" rx="0.5" fill={c.mute}/><rect x="9" y="0" width="3" height="10" rx="0.5" fill={c.mute}/><rect x="13.5" y="2" width="2.5" height="8" rx="0.5" fill={c.border}/></svg>
        <svg width="20" height="10" viewBox="0 0 20 10"><rect x="0" y="0" width="17" height="10" rx="1.5" stroke={c.mute} strokeWidth="1" fill="none"/><rect x="1.5" y="1.5" width="12" height="7" rx="0.5" fill={c.positive}/><rect x="18" y="3" width="2" height="4" rx="0.5" fill={c.mute}/></svg>
      </div>
    </div>
  );
}

function NavBar({ active, go }) {
  const tabs = [
    { id: "home", label: "Home", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 8l7-5 7 5v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg> },
    { id: "lending", label: "Earn", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M10 6v8M7 10l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { id: "card", label: "Card", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 8h16" stroke="currentColor" strokeWidth="1.5"/></svg> },
    { id: "settings", label: "More", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="5" cy="10" r="1.5" fill="currentColor"/><circle cx="10" cy="10" r="1.5" fill="currentColor"/><circle cx="15" cy="10" r="1.5" fill="currentColor"/></svg> },
  ];
  return (
    <div style={{ display: "flex", justifyContent: "space-around", padding: "6px 0 20px", borderTop: `1px solid ${c.borderSubtle}`, background: c.bg, fontFamily: f.sans }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => go(t.id)} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          color: active === t.id ? c.accent : c.mute, opacity: active === t.id ? 1 : 0.5,
          transition: "all 0.2s",
        }}>
          {t.icon}
          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.06em" }}>{t.label.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════
export default function BTCBankApp() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletType, setWalletType] = useState(null);
  const [vaultBal, setVaultBal] = useState(1.2450);
  const [screen, setScreen] = useState("home");
  const [hasCard, setHasCard] = useState(false);
  const [activeLoan, setActiveLoan] = useState(null);
  const [cardBal, setCardBal] = useState(0);

  const go = (s) => setScreen(s);
  const netBtc = vaultBal + (activeLoan ? activeLoan.collateralBTC : 0);
  const netEur = netBtc * BTC_PRICE * EUR_RATE;

  const resetAll = () => { setWalletConnected(false); setWalletType(null); setVaultBal(1.2450); setScreen("home"); setHasCard(false); setActiveLoan(null); setCardBal(0); };
  const resetCard = () => { setHasCard(false); setCardBal(0); };

  const Shell = ({ children }) => (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#060607", fontFamily: f.sans }}>
      <div style={{
        width: 390, height: 844, background: c.bg, borderRadius: 44,
        border: `1px solid ${c.border}`,
        boxShadow: "0 0 0 1px rgba(255,255,255,0.02), 0 40px 80px rgba(0,0,0,0.6)",
        overflow: "hidden", display: "flex", flexDirection: "column",
      }}>{children}</div>
    </div>
  );

  // ───────────────────────────────────
  // ONBOARDING
  // ───────────────────────────────────
  if (!walletConnected) {
    return (
      <Shell>
        <StatusBar />
        <div style={{ flex: 1, padding: "0 24px", overflowY: "auto" }}>
          {!walletType ? (
            <>
              {/* Brand moment */}
              <div style={{ marginTop: 64, marginBottom: 56 }}>
                {/* Amber line — like a cursor or a signal */}
                <div style={{ width: 32, height: 3, background: c.accent, borderRadius: 1, marginBottom: 20 }} />
                <div style={{ fontSize: 32, fontWeight: 300, color: c.text, lineHeight: 1.25, fontFamily: f.display, letterSpacing: "-0.02em" }}>
                  Borrow. Earn.<br />Spend.
                </div>
                <div style={{ fontSize: 14, color: c.sub, marginTop: 14, lineHeight: 1.6 }}>
                  No hypothecation. Fully trustless.<br />Built on Bitcoin, for Bitcoiners.
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  <Badge text="Liquid" color={c.info} />
                  <Badge text="Simplicity" color={c.mute} />
                  <Badge text="No hypothecation" color={c.positive} />
                </div>
              </div>

              <Label s={{ marginBottom: 12 }}>Connect wallet</Label>

              {[
                { id: "jade", name: "Blockstream Jade", sub: "Bluetooth · Native Liquid", tag: "Recommended", tc: c.positive },
                { id: "ledger", name: "Ledger", sub: "USB · Liquid sidechain app", tag: "Supported", tc: c.info },
                { id: "hot", name: "Hot wallet", sub: "Keys on device · Fast", tag: "Convenience", tc: c.accent },
              ].map(w => (
                <button key={w.id} onClick={() => setWalletType(w.id)} style={{
                  width: "100%", background: c.surface, border: `1px solid ${c.border}`,
                  borderRadius: 6, padding: "14px 16px", cursor: "pointer", textAlign: "left",
                  marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center",
                  transition: "border-color 0.2s",
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: c.text, marginBottom: 2 }}>{w.name}</div>
                    <div style={{ fontSize: 11, color: c.mute }}>{w.sub}</div>
                  </div>
                  <Badge text={w.tag} color={w.tc} />
                </button>
              ))}

              <div style={{ marginTop: 24, fontSize: 11, color: c.mute, lineHeight: 1.6, paddingBottom: 20 }}>
                Your keys never touch this app. It reads balances via Liquid Wallet Kit and constructs transactions for your hardware wallet to sign.
              </div>
            </>
          ) : (
            <>
              <div style={{ marginTop: 24 }}>
                <Back onClick={() => setWalletType(null)} label="Choose different wallet" />
              </div>

              <Label s={{ marginBottom: 16 }}>
                {walletType === "hot" ? "Creating wallet" : `Connecting ${walletType === "jade" ? "Jade" : "Ledger"}`}
              </Label>

              <div style={{ marginBottom: 24 }}>
                {[
                  walletType === "hot" ? "Seed phrase generated" : "Device detected",
                  "Deriving Liquid addresses",
                  "Scanning network via LWK",
                  "Balances loaded",
                ].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center" }}>
                    <div style={{ width: 18, height: 18, borderRadius: 9, background: c.positiveDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 10, color: c.positive, fontFamily: f.mono }}>✓</span>
                    </div>
                    <span style={{ fontSize: 13, color: c.sub }}>{step}</span>
                  </div>
                ))}
              </div>

              {walletType === "hot" && (
                <Card glow={c.accentSoft} s={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: c.accent, fontWeight: 600, marginBottom: 6 }}>Back up your seed phrase</div>
                  <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.5 }}>
                    12 words. Write them down. Store offline. Lose this backup and your funds are gone.
                  </div>
                </Card>
              )}

              <Card s={{ marginBottom: 24 }}>
                <Label s={{ marginBottom: 10 }}>Balances found</Label>
                <Row label="L-BTC" value={`${vaultBal.toFixed(4)} BTC`} color={c.accent} accent />
                <Row label="L-USDT" value="0.00 USDT" />
                <Row label="Total" value={`€${(vaultBal * BTC_PRICE * EUR_RATE).toLocaleString("en", { maximumFractionDigits: 0 })}`} color={c.positive} accent />
              </Card>

              <Btn primary onClick={() => setWalletConnected(true)}>Continue</Btn>
            </>
          )}
        </div>
      </Shell>
    );
  }

  // ───────────────────────────────────
  // HOME
  // ───────────────────────────────────
  const HomeScreen = () => (
    <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
      {/* Hero: Net worth — the most important number */}
      <div style={{ marginBottom: 28, marginTop: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <Label s={{ marginBottom: 0 }}>Net worth</Label>
          <div style={{ display: "flex", gap: 6 }}>
            <Badge text="Private" color={c.positive} />
            <Badge text="Liquid" color={c.info} />
          </div>
        </div>
        <Num large>{netBtc.toFixed(4)} <span style={{ fontSize: 16, color: c.accent }}>BTC</span></Num>
        <div style={{ fontSize: 15, color: c.sub, fontFamily: f.mono, marginTop: 6, letterSpacing: "-0.01em" }}>
          €{netEur.toLocaleString("en", { maximumFractionDigits: 0 })}
        </div>
        {/* Thin accent bar — visual rhythm */}
        <div style={{ width: 40, height: 2, background: c.accent, borderRadius: 1, marginTop: 14 }} />
      </div>

      {/* Vault + Credit grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
        <Card onClick={() => go("vault")}>
          <Label s={{ marginBottom: 8 }}>Vault</Label>
          <Num>{vaultBal.toFixed(4)}</Num>
          <div style={{ fontSize: 11, color: c.mute, marginTop: 4 }}>BTC · unlocked</div>
        </Card>
        <Card onClick={() => go("lending")}>
          <Label s={{ marginBottom: 8 }}>{activeLoan ? "Loan" : "Credit"}</Label>
          <Num color={activeLoan ? c.accent : c.positive}>
            {activeLoan
              ? `$${activeLoan.principalUSD.toLocaleString()}`
              : `€${(vaultBal * BTC_PRICE * 0.30 * EUR_RATE).toLocaleString("en", { maximumFractionDigits: 0 })}`}
          </Num>
          <div style={{ fontSize: 11, color: c.mute, marginTop: 4 }}>
            {activeLoan ? `Due ${activeLoan.expiryDate}` : "at 30% LTV"}
          </div>
        </Card>
      </div>

      {/* Card — premium feel */}
      <Card onClick={() => go("card")} s={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Label s={{ marginBottom: 6 }}>Card</Label>
          <Num>€{(cardBal * EUR_RATE).toLocaleString("en", { maximumFractionDigits: 0 })}</Num>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {hasCard && <Badge text="Active" color={c.positive} />}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke={c.mute} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </Card>

      {/* Actions — tight grid */}
      <Label s={{ marginBottom: 8 }}>Actions</Label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6 }}>
        {[
          { icon: "↙", label: "Deposit", s: "deposit" },
          { icon: "₿", label: "Borrow", s: "lending" },
          { icon: "↗", label: "Send", s: "home" },
          { icon: "↩", label: "Repay", s: activeLoan ? "repay" : "lending" },
        ].map(a => (
          <button key={a.label} onClick={() => go(a.s)} style={{
            background: c.surface, border: `1px solid ${c.border}`, borderRadius: 6,
            padding: "14px 0", cursor: "pointer", display: "flex", flexDirection: "column",
            alignItems: "center", gap: 5, transition: "border-color 0.2s",
          }}>
            <span style={{ fontSize: 16, color: c.sub, fontFamily: f.mono }}>{a.icon}</span>
            <span style={{ fontSize: 9, color: c.mute, fontWeight: 500, letterSpacing: "0.05em", fontFamily: f.sans }}>{a.label.toUpperCase()}</span>
          </button>
        ))}
      </div>

      {activeLoan && (
        <Card glow={c.accentSoft} s={{ marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
            <span style={{ fontSize: 12, color: c.accent, fontWeight: 600 }}>Active loan</span>
            <span style={{ fontSize: 11, color: c.mute, fontFamily: f.mono }}>due {activeLoan.expiryDate}</span>
          </div>
          <div style={{ fontSize: 11, color: c.mute, marginTop: 4 }}>
            ${activeLoan.principalUSD.toLocaleString()} · {activeLoan.collateralBTC.toFixed(4)} BTC locked · {activeLoan.interestRate}% APR
          </div>
        </Card>
      )}
    </div>
  );

  // ───────────────────────────────────
  // LENDING
  // ───────────────────────────────────
  const LendingScreen = () => {
    const [mode, setMode] = useState("borrow"); // 'borrow' | 'earn'
    const [collBtc, setCollBtc] = useState(Math.min(0.5, vaultBal));
    const [durDays, setDurDays] = useState(90);
    const [rate, setRate] = useState(3.5);
    const [matching, setMatching] = useState(false);
    const [matchProgress, setMatchProgress] = useState(0);
    const [matchedLender, setMatchedLender] = useState(null);

    const principal = collBtc * BTC_PRICE * 0.30;
    const totalRepay = principal * (1 + rate / 100 * (durDays / 365));
    const interest = totalRepay - principal;

    // Simulated P2P orderbook for lender view
    const openOffers = [
      { id: 1, borrower: "bc1q...7xk4", collateral: 0.8200, principal: 20280, rate: 4.2, duration: 90, ltv: 24, posted: "2 min ago" },
      { id: 2, borrower: "bc1q...m3pf", collateral: 2.1000, principal: 53550, rate: 3.8, duration: 180, ltv: 30, posted: "8 min ago" },
      { id: 3, borrower: "bc1q...9dw2", collateral: 0.3500, principal: 8873, rate: 5.1, duration: 30, ltv: 30, posted: "14 min ago" },
      { id: 4, borrower: "bc1q...kf71", collateral: 1.5000, principal: 38025, rate: 3.5, duration: 365, ltv: 30, posted: "22 min ago" },
      { id: 5, borrower: "bc1q...a8x3", collateral: 0.5000, principal: 12675, rate: 4.8, duration: 90, ltv: 30, posted: "31 min ago" },
    ];

    const startMatching = () => {
      setMatching(true);
      setMatchProgress(0);
      // Simulate matching steps
      const steps = [
        { delay: 400, progress: 15, label: "Broadcasting offer to Liquid..." },
        { delay: 1200, progress: 30, label: "Scanning P2P orderbook..." },
        { delay: 2000, progress: 55, label: "3 potential lenders found..." },
        { delay: 2800, progress: 75, label: "Negotiating terms..." },
        { delay: 3600, progress: 90, label: "Lender accepted..." },
        { delay: 4200, progress: 100, label: "Matched!" },
      ];
      steps.forEach(({ delay, progress }) => {
        setTimeout(() => setMatchProgress(progress), delay);
      });
      setTimeout(() => {
        setMatchedLender({ address: "bc1q...f8m2", reputation: 47, totalLent: "$2.4M" });
      }, 4200);
    };

    const confirmMatch = () => {
      const exp = new Date(); exp.setDate(exp.getDate() + durDays);
      setActiveLoan({
        collateralBTC: collBtc, principalUSD: Math.round(principal), interestRate: rate, durationDays: durDays,
        startDate: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
        expiryDate: exp.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      });
      setVaultBal(prev => prev - collBtc);
      setCardBal(Math.round(principal));
      setMatching(false);
      setMatchedLender(null);
      go("home");
    };

    // ── Mode toggle (Borrow / Lend)
    const ModeToggle = () => (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, marginBottom: 20, background: c.surface, borderRadius: 6, border: `1px solid ${c.border}`, padding: 3 }}>
        {["borrow", "earn"].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding: "10px 0", borderRadius: 4, fontSize: 12, fontWeight: 600,
            border: "none", cursor: "pointer", fontFamily: f.sans, letterSpacing: "0.02em",
            background: mode === m ? c.surfaceRaised : "transparent",
            color: mode === m ? c.text : c.mute, transition: "all 0.15s",
          }}>{m === "borrow" ? "Borrow" : "Earn"}</button>
        ))}
      </div>
    );

    // ── Active loan view
    if (activeLoan) {
      const totalDue = activeLoan.principalUSD * (1 + activeLoan.interestRate / 100 * (activeLoan.durationDays / 365));
      const ltv = (activeLoan.principalUSD / (activeLoan.collateralBTC * BTC_PRICE)) * 100;
      return (
        <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
          <div style={{ marginBottom: 24, marginTop: 4 }}>
            <Label s={{ marginBottom: 6 }}>Active contract</Label>
            <Num large>${activeLoan.principalUSD.toLocaleString()}</Num>
            <div style={{ fontSize: 13, color: c.mute, fontFamily: f.mono, marginTop: 4 }}>
              ≈ €{(activeLoan.principalUSD * EUR_RATE).toLocaleString("en", { maximumFractionDigits: 0 })} · Due {activeLoan.expiryDate}
            </div>
            <div style={{ width: 40, height: 2, background: c.accent, borderRadius: 1, marginTop: 14 }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
            <Btn primary onClick={() => go("repay")}>Repay</Btn>
            <Btn onClick={() => go("add-collateral")}>+ Collateral</Btn>
          </div>

          <Card s={{ marginBottom: 12 }}>
            <Label s={{ marginBottom: 10 }}>Terms</Label>
            <Row label="Started" value={activeLoan.startDate} />
            <Row label="Expires" value={activeLoan.expiryDate} color={c.accent} accent />
            <Row label="Duration" value={`${activeLoan.durationDays}d`} />
            <Row label="Rate" value={`${activeLoan.interestRate}% APR`} />
            <Row label="Interest" value={`$${Math.round(totalDue - activeLoan.principalUSD).toLocaleString()}`} />
            <Row label="Total due" value={`$${Math.round(totalDue).toLocaleString()}`} color={c.accent} accent />
          </Card>

          <Card s={{ marginBottom: 12 }}>
            <Label s={{ marginBottom: 10 }}>Collateral</Label>
            <Row label="Locked" value={`${activeLoan.collateralBTC.toFixed(4)} BTC`} color={c.accent} accent />
            <Row label="Value" value={`$${(activeLoan.collateralBTC * BTC_PRICE).toLocaleString("en", { maximumFractionDigits: 0 })}`} />
            <Row label="LTV" value={`${ltv.toFixed(1)}%`} color={c.positive} accent />
          </Card>

          <Card>
            <Label s={{ marginBottom: 8 }}>Contract mechanics</Label>
            <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.6, marginBottom: 10 }}>
              Fixed-date. No monitoring. No margin calls. No oracle.
            </div>
            {[
              ["Repay on time", "BTC returned", c.positive],
              ["Miss deadline", "Lender claims collateral", c.negative],
              ["Add collateral", "Improve safety margin", c.info],
            ].map(([a, b, col], i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5, fontSize: 11 }}>
                <span style={{ color: col, fontWeight: 600, minWidth: 110, fontFamily: f.sans }}>{a}</span>
                <span style={{ color: c.mute }}>{b}</span>
              </div>
            ))}
          </Card>
        </div>
      );
    }

    // ── Matching screen (after offer submitted)
    if (matching) {
      const steps = [
        { at: 0, label: "Broadcasting offer to Liquid network", icon: "⟡" },
        { at: 15, label: "Scanning P2P orderbook", icon: "⟡" },
        { at: 30, label: "3 potential lenders found", icon: "⟡" },
        { at: 55, label: "Negotiating best terms", icon: "⟡" },
        { at: 75, label: "Lender accepted your offer", icon: "⟡" },
        { at: 90, label: "Constructing Simplicity contract", icon: "⟡" },
      ];
      return (
        <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
          <div style={{ marginBottom: 28, marginTop: 4 }}>
            <Label s={{ marginBottom: 6 }}>{matchedLender ? "Matched" : "Finding a lender"}</Label>
            <Num large>{matchedLender ? "Lender found" : "Matching..."}</Num>
            <div style={{ width: 40, height: 2, background: matchedLender ? c.positive : c.accent, borderRadius: 1, marginTop: 14 }} />
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ height: 3, background: c.border, borderRadius: 2, overflow: "hidden", marginBottom: 8 }}>
              <div style={{
                height: "100%", borderRadius: 2, transition: "width 0.6s ease-out",
                width: `${matchProgress}%`,
                background: matchedLender ? c.positive : c.accent,
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 10, color: c.mute, fontFamily: f.mono }}>{matchProgress}%</span>
              <span style={{ fontSize: 10, color: matchedLender ? c.positive : c.mute }}>
                {matchedLender ? "Contract ready" : "Searching..."}
              </span>
            </div>
          </div>

          {/* Steps */}
          <Card s={{ marginBottom: 16 }}>
            {steps.map((step, i) => {
              const done = matchProgress >= step.at + 15;
              const active = matchProgress >= step.at && !done;
              return (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < steps.length - 1 ? 10 : 0, alignItems: "center" }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                    background: done ? c.positiveDim : active ? c.accentDim : c.borderSubtle,
                    transition: "all 0.3s",
                  }}>
                    <span style={{ fontSize: 9, color: done ? c.positive : active ? c.accent : c.mute, fontFamily: f.mono }}>
                      {done ? "✓" : active ? "●" : "○"}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: done ? c.sub : active ? c.text : c.mute, transition: "color 0.3s" }}>{step.label}</span>
                </div>
              );
            })}
          </Card>

          {/* Offer summary */}
          <Card s={{ marginBottom: 16 }}>
            <Label s={{ marginBottom: 10 }}>Your offer</Label>
            <Row label="Collateral" value={`${collBtc.toFixed(4)} BTC`} color={c.accent} accent />
            <Row label="Borrowing" value={`$${Math.round(principal).toLocaleString()}`} />
            <Row label="Rate" value={`${rate.toFixed(1)}% APR`} />
            <Row label="Duration" value={`${durDays}d`} />
          </Card>

          {/* Matched lender info */}
          {matchedLender && (
            <>
              <Card glow={c.positive + "44"} s={{ marginBottom: 16 }}>
                <Label s={{ marginBottom: 10 }}>Matched lender</Label>
                <Row label="Address" value={matchedLender.address} color={c.info} />
                <Row label="Contracts completed" value={`${matchedLender.reputation}`} color={c.positive} accent />
                <Row label="Total lent" value={matchedLender.totalLent} />
              </Card>
              <Btn primary onClick={confirmMatch}>Sign & accept — ${Math.round(principal).toLocaleString()}</Btn>
              <div style={{ fontSize: 10, color: c.mute, marginTop: 8 }}>Hardware wallet will sign the Simplicity contract</div>
            </>
          )}

          {!matchedLender && (
            <Btn ghost onClick={() => { setMatching(false); setMatchProgress(0); }} s={{ border: `1px solid ${c.border}` }}>Cancel</Btn>
          )}
        </div>
      );
    }

    // ── EARN / BORROW modes — toggle at top, no layout jump
    return (
      <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
        {/* Toggle is ALWAYS the first element — no jumping */}
        <div style={{ marginTop: 4, marginBottom: 16 }}>
          <ModeToggle />
        </div>

        {mode === "earn" ? (
          <>
            {/* ── EARN: browse open loan requests */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ width: 32, height: 2, background: c.info, borderRadius: 1, marginBottom: 14 }} />
              <div style={{ fontSize: 20, fontWeight: 300, color: c.text, fontFamily: f.display, lineHeight: 1.3 }}>
                Earn yield.<br />No hypothecation.
              </div>
              <div style={{ fontSize: 11, color: c.mute, marginTop: 8 }}>Fund P2P loans · BTC collateral backs every position · Trustless</div>
            </div>

            {/* Market stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
              {[
                { label: "Open offers", value: `${openOffers.length}`, col: c.text },
                { label: "Avg rate", value: "4.1%", col: c.positive },
                { label: "Total vol", value: "$133K", col: c.info },
              ].map(({ label, value, col }) => (
                <Card key={label} s={{ padding: 12 }}>
                  <Label s={{ marginBottom: 6, fontSize: 9 }}>{label}</Label>
                  <div style={{ fontSize: 16, fontWeight: 600, color: col, fontFamily: f.mono }}>{value}</div>
                </Card>
              ))}
            </div>

            <Label s={{ marginBottom: 8 }}>Open loan requests</Label>

            {openOffers.map(offer => (
              <Card key={offer.id} s={{ marginBottom: 8, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: c.info, fontFamily: f.mono }}>{offer.borrower}</span>
                  <Badge text={offer.posted} color={c.mute} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <Num s={{ fontSize: 18 }}>${offer.principal.toLocaleString()}</Num>
                  <span style={{ fontSize: 14, fontWeight: 600, color: c.positive, fontFamily: f.mono }}>{offer.rate}%</span>
                </div>
                <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: c.mute }}>
                    <span style={{ color: c.sub }}>{offer.collateral} BTC</span> collateral
                  </div>
                  <div style={{ fontSize: 10, color: c.mute }}>
                    <span style={{ color: c.sub }}>{offer.duration}d</span> term
                  </div>
                  <div style={{ fontSize: 10, color: c.mute }}>
                    <span style={{ color: c.sub }}>{offer.ltv}%</span> LTV
                  </div>
                </div>
                <Btn compact onClick={() => {}} s={{ width: "100%" }}>
                  Fund this loan — earn {offer.rate}% APR
                </Btn>
              </Card>
            ))}
          </>
        ) : (
          <>
            {/* ── BORROW: create offer */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ width: 32, height: 2, background: c.accent, borderRadius: 1, marginBottom: 14 }} />
              <div style={{ fontSize: 20, fontWeight: 300, color: c.text, fontFamily: f.display, lineHeight: 1.3 }}>
                Lock BTC. Borrow USDT.<br />Repay by a fixed date.
              </div>
              <div style={{ fontSize: 11, color: c.mute, marginTop: 8 }}>No hypothecation · No oracle · No margin calls · Trustless P2P</div>
            </div>

            <Card s={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <Label>Collateral</Label>
                <span style={{ fontSize: 10, color: c.mute, fontFamily: f.mono }}>{vaultBal.toFixed(4)} avail.</span>
              </div>
              <input type="range" min={0} max={Math.floor(vaultBal * 10000)} value={Math.round(collBtc * 10000)}
                onChange={e => setCollBtc(Number(e.target.value) / 10000)}
                style={{ width: "100%", accentColor: c.accent, marginBottom: 12, height: 2 }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <Num>{collBtc.toFixed(4)} <span style={{ fontSize: 13, color: c.mute }}>BTC</span></Num>
                <span style={{ fontSize: 12, color: c.mute, fontFamily: f.mono }}>${(collBtc * BTC_PRICE).toLocaleString("en", { maximumFractionDigits: 0 })}</span>
              </div>
            </Card>

            <Card s={{ marginBottom: 12 }}>
              <Label s={{ marginBottom: 10 }}>Duration</Label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6 }}>
                {[30, 90, 180, 365].map(d => (
                  <button key={d} onClick={() => setDurDays(d)} style={{
                    padding: "10px 0", borderRadius: 4, fontSize: 12, fontWeight: 500,
                    border: `1px solid ${durDays === d ? c.accent : c.border}`,
                    background: durDays === d ? c.accentDim : "transparent",
                    color: durDays === d ? c.accent : c.mute, cursor: "pointer", fontFamily: f.mono,
                    transition: "all 0.15s",
                  }}>{d === 365 ? "1yr" : d === 180 ? "6mo" : `${d}d`}</button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: c.mute, marginTop: 8, fontFamily: f.mono }}>
                Expires {new Date(Date.now() + durDays * 86400000).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </div>
            </Card>

            <Card s={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <Label>Interest rate</Label>
                <span style={{ fontSize: 10, color: c.mute }}>Higher = faster match</span>
              </div>
              <input type="range" min={10} max={80} value={Math.round(rate * 10)}
                onChange={e => setRate(Number(e.target.value) / 10)}
                style={{ width: "100%", accentColor: rate <= 3 ? c.positive : rate <= 5 ? c.accent : c.negative, marginBottom: 12, height: 2 }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <Num color={rate <= 3 ? c.positive : rate <= 5 ? c.accent : c.negative}>
                  {rate.toFixed(1)}% <span style={{ fontSize: 13, color: c.mute }}>APR</span>
                </Num>
                <span style={{ fontSize: 10, color: c.mute, fontFamily: f.mono }}>Market ~3-4%</span>
              </div>
            </Card>

            <Card s={{ marginBottom: 16 }}>
              <Label s={{ marginBottom: 10 }}>Summary</Label>
              <Row label="You lock" value={`${collBtc.toFixed(4)} BTC`} color={c.accent} accent />
              <Row label="You receive" value={`$${Math.round(principal).toLocaleString()} USDT`} color={c.positive} accent />
              <Row label="LTV" value="30%" />
              <Row label="Duration" value={`${durDays}d`} />
              <Row label="Interest" value={`$${Math.round(interest).toLocaleString()}`} />
              <Row label="Total to repay" value={`$${Math.round(totalRepay).toLocaleString()}`} color={c.accent} accent />
              <div style={{ marginTop: 8, fontSize: 11, color: c.positive, fontWeight: 500 }}>✓ Not a taxable event</div>
            </Card>

            <Btn primary disabled={collBtc <= 0} onClick={startMatching}>
              Post offer — ${Math.round(principal).toLocaleString()}
            </Btn>
            <div style={{ fontSize: 10, color: c.mute, marginTop: 8 }}>Offer goes to P2P orderbook · HW wallet signs on match</div>
          </>
        )}
      </div>
    );
  };

  // ───────────────────────────────────
  // REPAY
  // ───────────────────────────────────
  const RepayScreen = () => {
    if (!activeLoan) { go("lending"); return null; }
    const totalDue = activeLoan.principalUSD * (1 + activeLoan.interestRate / 100 * (activeLoan.durationDays / 365));
    return (
      <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
        <Back onClick={() => go("lending")} label="Loan" />
        <div style={{ marginBottom: 24 }}>
          <Label s={{ marginBottom: 6 }}>Repay</Label>
          <Num large>${Math.round(totalDue).toLocaleString()}</Num>
          <div style={{ fontSize: 13, color: c.mute, fontFamily: f.mono, marginTop: 4 }}>Due {activeLoan.expiryDate}</div>
        </div>
        <Card s={{ marginBottom: 12 }}>
          <Row label="Principal" value={`$${activeLoan.principalUSD.toLocaleString()}`} />
          <Row label="Interest" value={`$${Math.round(totalDue - activeLoan.principalUSD).toLocaleString()}`} color={c.accent} />
          <Row label="Collateral returned" value={`${activeLoan.collateralBTC.toFixed(4)} BTC`} color={c.positive} accent />
        </Card>
        <Card glow={c.positive + "33"} s={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: c.positive, fontWeight: 600, marginBottom: 4 }}>On repayment</div>
          <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.5 }}>
            Principal + interest to lender. Your {activeLoan.collateralBTC.toFixed(4)} BTC unlocked immediately.
          </div>
        </Card>
        <Card glow={c.negative + "33"} s={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: c.negative, fontWeight: 600, marginBottom: 4 }}>Miss the deadline</div>
          <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.5 }}>
            Lender claims {activeLoan.collateralBTC.toFixed(4)} BTC. No extensions. On-chain execution.
          </div>
        </Card>
        <Btn primary onClick={() => { setVaultBal(prev => prev + activeLoan.collateralBTC); setActiveLoan(null); setCardBal(0); go("home"); }}>
          Repay ${Math.round(totalDue).toLocaleString()}
        </Btn>
      </div>
    );
  };

  // ───────────────────────────────────
  // ADD COLLATERAL
  // ───────────────────────────────────
  const AddCollateralScreen = () => {
    const [addAmt, setAddAmt] = useState(Math.min(0.1, vaultBal));
    if (!activeLoan) { go("lending"); return null; }
    const newColl = activeLoan.collateralBTC + addAmt;
    const newLtv = (activeLoan.principalUSD / (newColl * BTC_PRICE)) * 100;
    return (
      <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
        <Back onClick={() => go("lending")} label="Loan" />
        <Label s={{ marginBottom: 6 }}>Add collateral</Label>
        <div style={{ fontSize: 13, color: c.mute, marginBottom: 24 }}>More BTC = lower LTV = better safety margin.</div>
        <Card s={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <Label>Amount</Label>
            <span style={{ fontSize: 10, color: c.mute, fontFamily: f.mono }}>{vaultBal.toFixed(4)} avail.</span>
          </div>
          <input type="range" min={0} max={Math.floor(vaultBal * 10000)} value={Math.round(addAmt * 10000)}
            onChange={e => setAddAmt(Number(e.target.value) / 10000)}
            style={{ width: "100%", accentColor: c.accent, marginBottom: 10, height: 2 }} />
          <Num>+{addAmt.toFixed(4)} <span style={{ fontSize: 13, color: c.mute }}>BTC</span></Num>
        </Card>
        <Card s={{ marginBottom: 16 }}>
          <Label s={{ marginBottom: 10 }}>Effect</Label>
          <Row label="Collateral now" value={`${activeLoan.collateralBTC.toFixed(4)} BTC`} />
          <Row label="After" value={`${newColl.toFixed(4)} BTC`} color={c.positive} accent />
          <Row label="LTV now" value={`${((activeLoan.principalUSD / (activeLoan.collateralBTC * BTC_PRICE)) * 100).toFixed(1)}%`} />
          <Row label="LTV after" value={`${newLtv.toFixed(1)}%`} color={c.positive} accent />
        </Card>
        <Btn primary disabled={addAmt <= 0} onClick={() => {
          setVaultBal(prev => prev - addAmt);
          setActiveLoan(prev => ({ ...prev, collateralBTC: prev.collateralBTC + addAmt }));
          go("lending");
        }}>Lock +{addAmt.toFixed(4)} BTC</Btn>
      </div>
    );
  };

  // ───────────────────────────────────
  // CARD
  // ───────────────────────────────────
  const CardScreen = () => {
    if (!hasCard) {
      return (
        <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
          <div style={{ marginBottom: 28, marginTop: 4 }}>
            <div style={{ width: 32, height: 2, background: c.accent, borderRadius: 1, marginBottom: 16 }} />
            <div style={{ fontSize: 22, fontWeight: 300, color: c.text, fontFamily: f.display, lineHeight: 1.3 }}>
              Spend stablecoins.<br />Keep your Bitcoin.
            </div>
          </div>

          {/* Premium card visual */}
          <div style={{
            background: c.surface, borderRadius: 8, padding: "24px 20px",
            marginBottom: 24, border: `1px solid ${c.border}`, position: "relative",
            overflow: "hidden",
          }}>
            {/* Subtle amber corner accent */}
            <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle at top right, ${c.accentDim}, transparent 70%)` }} />
            <div style={{ fontSize: 9, color: c.mute, letterSpacing: "0.15em", fontWeight: 500, marginBottom: 48 }}>SELF-CUSTODIAL</div>
            <div style={{ fontSize: 15, letterSpacing: "0.25em", color: c.sub, marginBottom: 14, fontFamily: f.mono }}>•••• •••• •••• ••••</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <span style={{ fontSize: 11, color: c.mute, letterSpacing: "0.05em" }}>YOUR NAME</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: c.accent, letterSpacing: "0.03em" }}>Mastercard</span>
            </div>
          </div>

          <Card s={{ marginBottom: 12 }}>
            <Label s={{ marginBottom: 12 }}>How it works</Label>
            {[
              ["1", "Borrow stablecoins against BTC", "Fixed-date contract"],
              ["2", "Fund card", "One tap"],
              ["3", "Tap to pay", "EUR/BGN conversion"],
              ["4", "BTC stays locked", "Until you repay"],
            ].map(([n, t, sub]) => (
              <div key={n} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: c.accent, fontWeight: 600, fontFamily: f.mono, minWidth: 14 }}>{n}</span>
                <div>
                  <div style={{ fontSize: 12, color: c.text }}>{t}</div>
                  <div style={{ fontSize: 10, color: c.mute }}>{sub}</div>
                </div>
              </div>
            ))}
          </Card>

          <Card glow={c.accentSoft} s={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: c.accent, fontWeight: 600, marginBottom: 4 }}>KYC required</div>
            <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.5 }}>
              Card partner verifies your identity. Your vault and BTC stay private.
            </div>
          </Card>

          <Btn primary onClick={() => setHasCard(true)}>Get card</Btn>
        </div>
      );
    }

    return (
      <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
        <div style={{ marginBottom: 24, marginTop: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <Label s={{ marginBottom: 6 }}>Card balance</Label>
              <Num large>€{(cardBal * EUR_RATE).toLocaleString("en", { maximumFractionDigits: 0 })}</Num>
            </div>
            <Badge text="Active" color={c.positive} />
          </div>
          <div style={{ width: 40, height: 2, background: c.accent, borderRadius: 1, marginTop: 14 }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 20 }}>
          <Btn compact onClick={() => go("lending")} s={{ width: "100%" }}>Top up</Btn>
          <Btn compact ghost s={{ width: "100%", border: `1px solid ${c.border}` }}>Freeze</Btn>
          <Btn compact ghost onClick={resetCard} s={{ width: "100%", border: `1px solid ${c.border}` }}>Reset</Btn>
        </div>

        <Label s={{ marginBottom: 8 }}>Recent</Label>
        {[
          { name: "Lidl Plovdiv", amount: -42.30, date: "Today 14:23" },
          { name: "Shell Trakia", amount: -85.00, date: "Yesterday 09:15" },
          { name: "Netflix", amount: -15.99, date: "Mar 28" },
          { name: "Amazon.de", amount: -129.00, date: "Mar 26" },
          { name: "Top-up from loan", amount: 500, date: "Mar 25" },
        ].map((tx, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 0", borderBottom: `1px solid ${c.borderSubtle}`,
          }}>
            <div>
              <div style={{ fontSize: 13, color: c.text }}>{tx.name}</div>
              <div style={{ fontSize: 10, color: c.mute }}>{tx.date}</div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: tx.amount > 0 ? c.positive : c.text, fontFamily: f.mono }}>
              {tx.amount > 0 ? "+" : ""}€{Math.abs(tx.amount).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // ───────────────────────────────────
  // DEPOSIT
  // ───────────────────────────────────
  const DepositScreen = () => {
    const [method, setMethod] = useState(null);
    const [step, setStep] = useState(0);
    const [amount, setAmount] = useState(0.5);

    if (step === 2) {
      return (
        <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
          <div style={{ marginTop: 48, marginBottom: 32 }}>
            <div style={{ width: 20, height: 20, borderRadius: 10, background: c.positiveDim, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 11, color: c.positive, fontFamily: f.mono }}>✓</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 400, color: c.text, fontFamily: f.display }}>Deposit confirmed</div>
            <div style={{ fontSize: 13, color: c.mute, marginTop: 4, fontFamily: f.mono }}>{amount.toFixed(4)} BTC → vault</div>
          </div>
          <Card s={{ marginBottom: 20 }}>
            <Row label="Contract" value="Simplicity · HTLC" />
            <Row label="Privacy" value="Confidential" />
            <Row label="Recovery" value="2-of-3 · 90d" />
            <Row label="Network" value="Liquid" />
          </Card>
          <Btn primary onClick={() => { setVaultBal(prev => prev + amount); go("home"); }}>Done</Btn>
        </div>
      );
    }

    return (
      <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
        <Back onClick={() => go("home")} />
        <Label s={{ marginBottom: 6 }}>Deposit BTC</Label>
        <div style={{ fontSize: 13, color: c.mute, marginBottom: 24 }}>Into a Simplicity vault. You hold the keys.</div>

        {step === 0 && (
          <>
            <Label s={{ marginBottom: 8 }}>Method</Label>
            {[
              { id: "instant", name: "Instant swap", sub: "SideSwap · ~30s · 0.1%", tag: "Recommended", tc: c.positive },
              { id: "lightning", name: "Lightning", sub: "Submarine swap · ~1min · 0.05%", tag: "Fast", tc: c.info },
              { id: "pegin", name: "Direct peg-in", sub: "On-chain · no fee", tag: "~17hrs", tc: c.accent },
            ].map(m => (
              <button key={m.id} onClick={() => setMethod(m.id)} style={{
                width: "100%", background: method === m.id ? c.surfaceRaised : c.surface,
                border: `1px solid ${method === m.id ? c.accent : c.border}`,
                borderRadius: 6, padding: "12px 16px", cursor: "pointer", textAlign: "left",
                marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center",
                transition: "all 0.15s",
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: c.text, marginBottom: 2 }}>{m.name}</div>
                  <div style={{ fontSize: 10, color: c.mute }}>{m.sub}</div>
                </div>
                <Badge text={m.tag} color={m.tc} />
              </button>
            ))}
            {method && <Btn primary onClick={() => setStep(1)} s={{ marginTop: 12 }}>Continue</Btn>}
          </>
        )}

        {step === 1 && (
          <>
            <Card s={{ marginBottom: 12 }}>
              <Label s={{ marginBottom: 10 }}>Amount</Label>
              <input type="range" min={1} max={20000} value={Math.round(amount * 10000)}
                onChange={e => setAmount(Number(e.target.value) / 10000)}
                style={{ width: "100%", accentColor: c.accent, marginBottom: 12, height: 2 }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <Num>{amount.toFixed(4)} <span style={{ fontSize: 13, color: c.mute }}>BTC</span></Num>
                <span style={{ fontSize: 12, color: c.mute, fontFamily: f.mono }}>€{(amount * BTC_PRICE * EUR_RATE).toLocaleString("en", { maximumFractionDigits: 0 })}</span>
              </div>
            </Card>
            <Card s={{ marginBottom: 16 }}>
              <Label s={{ marginBottom: 10 }}>Vault config</Label>
              <Row label="Time-lock" value="24h withdrawals" />
              <Row label="Recovery" value="2-of-3 · 90d" />
              <Row label="Contract" value="Simplicity mainnet" />
              <Row label="Privacy" value="Confidential" />
            </Card>
            <Btn primary onClick={() => setStep(2)}>Create vault & deposit</Btn>
          </>
        )}
      </div>
    );
  };

  // ───────────────────────────────────
  // VAULT
  // ───────────────────────────────────
  const VaultScreen = () => (
    <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
      <Back onClick={() => go("home")} />
      <div style={{ marginBottom: 24 }}>
        <Label s={{ marginBottom: 6 }}>Vault</Label>
        <Num large>{vaultBal.toFixed(4)} <span style={{ fontSize: 16, color: c.accent }}>BTC</span></Num>
        <div style={{ fontSize: 14, color: c.mute, fontFamily: f.mono, marginTop: 4 }}>
          €{(vaultBal * BTC_PRICE * EUR_RATE).toLocaleString("en", { maximumFractionDigits: 0 })}
        </div>
        {activeLoan && <div style={{ fontSize: 12, color: c.accent, marginTop: 6, fontFamily: f.mono }}>+ {activeLoan.collateralBTC.toFixed(4)} locked</div>}
        <div style={{ width: 40, height: 2, background: c.accent, borderRadius: 1, marginTop: 14 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        <Btn onClick={() => go("deposit")}>Deposit</Btn>
        <Btn ghost s={{ border: `1px solid ${c.border}` }}>Withdraw</Btn>
      </div>
      <Card s={{ marginBottom: 12 }}>
        <Label s={{ marginBottom: 10 }}>Config</Label>
        <Row label="Type" value="Simplicity vault" />
        <Row label="Time-lock" value="24h delay" />
        <Row label="Recovery" value="2-of-3 · 90d" />
        <Row label="Limit" value="10%/day" />
        <Row label="Network" value="Liquid · confidential" />
      </Card>
      <Card>
        <Label s={{ marginBottom: 8 }}>Why a vault</Label>
        <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.6 }}>
          A wallet stores bitcoin. A vault <span style={{ color: c.accent }}>programs</span> it. Time-locks, multi-sig recovery, spending limits, confidential balances. The vault is the collateral engine.
        </div>
      </Card>
    </div>
  );

  // ───────────────────────────────────
  // SETTINGS
  // ───────────────────────────────────
  const SettingsScreen = () => (
    <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
      <div style={{ marginBottom: 24, marginTop: 4 }}>
        <Label s={{ marginBottom: 6 }}>Settings</Label>
        <div style={{ fontSize: 16, fontWeight: 400, color: c.text, fontFamily: f.display }}>Wallet & configuration</div>
      </div>
      <Card s={{ marginBottom: 12 }}>
        <Label s={{ marginBottom: 10 }}>Wallet</Label>
        <Row label="Type" value={walletType === "jade" ? "Jade" : walletType === "ledger" ? "Ledger" : "Hot wallet"} color={c.positive} accent />
        <Row label="Connection" value={walletType === "hot" ? "Local" : walletType === "jade" ? "BLE" : "USB"} />
        <Row label="Network" value="Liquid mainnet" />
      </Card>
      <Card s={{ marginBottom: 12 }}>
        <Label s={{ marginBottom: 10 }}>Security</Label>
        <Row label="Time-lock" value="24h" />
        <Row label="Recovery" value="2-of-3" color={c.positive} accent />
        <Row label="Limit" value="10%/day" />
        <Row label="Confidential" value="On" color={c.positive} />
      </Card>
      <Card s={{ marginBottom: 12 }}>
        <Label s={{ marginBottom: 10 }}>Network</Label>
        <Row label="Federation" value="65 nodes" />
        <Row label="Blocks" value="~1 min" />
        <Row label="Fees" value="~$0.01" color={c.positive} />
      </Card>
      <Card s={{ marginBottom: 16 }}>
        <Label s={{ marginBottom: 10 }}>App</Label>
        <Row label="Version" value="0.1.0-alpha" />
        <Row label="Protocol" value="Simplicity" />
        <Row label="SDK" value="LWK" />
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <Btn danger onClick={() => { setWalletConnected(false); setWalletType(null); }}>Disconnect</Btn>
        <Btn danger onClick={resetAll}>Reset all</Btn>
      </div>
      <div style={{ fontSize: 10, color: c.mute, marginTop: 8 }}>Reset clears vault, loans, card back to defaults.</div>
    </div>
  );

  // ───────────────────────────────────
  // ROUTER
  // ───────────────────────────────────
  const screens = { home: HomeScreen, lending: LendingScreen, card: CardScreen, settings: SettingsScreen, deposit: DepositScreen, vault: VaultScreen, repay: RepayScreen, "add-collateral": AddCollateralScreen };
  const Screen = screens[screen] || HomeScreen;
  const tabMap = { home: "home", deposit: "home", vault: "home", lending: "lending", repay: "lending", "add-collateral": "lending", card: "card", settings: "settings" };

  return (
    <Shell>
      <StatusBar />
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}><Screen /></div>
      <NavBar active={tabMap[screen] || "home"} go={go} />
    </Shell>
  );
}
