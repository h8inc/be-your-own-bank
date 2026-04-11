import React from "react";
import { c, f, EUR_RATE } from "../lib/theme";
import { Label, Num, Card, Btn, Badge } from "../components/Primitives";

interface Props {
  hasCard: boolean;
  setHasCard: (v: boolean) => void;
  cardBal: number;
  resetCard: () => void;
  go: (s: string) => void;
}

export const CardScreen: React.FC<Props> = ({ hasCard, setHasCard, cardBal, resetCard, go }) => {
  if (!hasCard) {
    return (
      <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
        <div style={{ marginBottom: 28, marginTop: 4 }}>
          <div style={{ width: 32, height: 2, background: c.accent, borderRadius: 1, marginBottom: 16 }} />
          <div style={{ fontSize: 22, fontWeight: 300, color: c.text, fontFamily: f.display, lineHeight: 1.3 }}>
            Spend stablecoins.<br />Keep your Bitcoin.
          </div>
        </div>
        <div style={{
          background: c.surface, borderRadius: 8, padding: "24px 20px",
          marginBottom: 24, border: `1px solid ${c.border}`, position: "relative", overflow: "hidden",
        }}>
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
          <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.5 }}>Card partner verifies your identity. Your vault and BTC stay private.</div>
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
