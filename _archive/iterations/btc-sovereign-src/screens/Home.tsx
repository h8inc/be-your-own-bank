import React from "react";
import { c, f, BTC_PRICE, EUR_RATE } from "../lib/theme";
import { Label, Num, Card } from "../components/Primitives";

interface Props {
  vaultBal: number;
  cardBal: number;
  activeLoan: any;
  hasCard: boolean;
  go: (s: string) => void;
}

export const HomeScreen: React.FC<Props> = ({ vaultBal, cardBal, activeLoan, hasCard, go }) => {
  const lockedBtc = activeLoan ? activeLoan.collateralBTC : 0;
  const netBtc = vaultBal + lockedBtc;
  const netEur = netBtc * BTC_PRICE * EUR_RATE;

  return (
    <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
      {/* Hero */}
      <div style={{ marginBottom: 28, marginTop: 4 }}>
        <div style={{ marginBottom: 12 }}>
          <Label>Net worth</Label>
        </div>
        <Num large>{netBtc.toFixed(4)} <span style={{ fontSize: 16, color: c.accent }}>BTC</span></Num>
        <div style={{ fontSize: 15, color: c.sub, fontFamily: f.mono, marginTop: 6, letterSpacing: "-0.01em" }}>
          €{netEur.toLocaleString("en", { maximumFractionDigits: 0 })}
        </div>
        <div style={{ width: 40, height: 2, background: c.accent, borderRadius: 1, marginTop: 14 }} />
      </div>

      {/* Vault + Credit */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
        <Card onClick={() => go("vault")}>
          <Label s={{ marginBottom: 8 }}>Savings</Label>
          <Num>{vaultBal.toFixed(4)}</Num>
          <div style={{ fontSize: 11, color: c.mute, marginTop: 4 }}>BTC · available</div>
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

      {/* Card */}
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

      {/* Actions */}
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
};
