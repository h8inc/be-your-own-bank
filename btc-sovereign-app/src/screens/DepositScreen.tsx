import React, { useState } from "react";
import { c, f } from "../lib/theme";
import { BTC_PRICE, EUR_RATE } from "../lib/constants";
import { Label, Num, Row, Card, Btn, Back, Badge } from "../components/ui";

interface Props {
  setVaultBal: (fn: (v: number) => number) => void;
  go: (s: string) => void;
}

export const DepositScreen: React.FC<Props> = ({ setVaultBal, go }) => {
  const [method, setMethod] = useState<string | null>(null);
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
          <Row label="Privacy" value="Balances hidden on-chain" />
          <Row label="Recovery" value="2-of-3 · 90d" />
        </Card>
        <Btn primary onClick={() => { setVaultBal(prev => prev + amount); go("home"); }}>Done</Btn>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
      <Back onClick={() => go("home")} />
      <Label s={{ marginBottom: 6 }}>Deposit BTC</Label>
      <div style={{ fontSize: 13, color: c.mute, marginBottom: 24 }}>Add Bitcoin to your savings</div>
      {step === 0 && (
        <>
          <Label s={{ marginBottom: 8 }}>Method</Label>
          {[
            { id: "instant", name: "Instant", sub: "~30 seconds · 0.1% fee", tag: "Recommended", tc: c.positive },
            { id: "lightning", name: "Lightning", sub: "~1 minute · 0.05% fee", tag: "Fast", tc: c.info },
            { id: "pegin", name: "Standard transfer", sub: "Free · takes ~17 hours", tag: "Free", tc: c.accent },
          ].map(m => (
            <button key={m.id} onClick={() => setMethod(m.id)} style={{
              width: "100%", background: method === m.id ? c.surfaceRaised : c.surface,
              border: `1px solid ${method === m.id ? c.accent : c.border}`,
              borderRadius: 6, padding: "12px 16px", cursor: "pointer", textAlign: "left" as const,
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
            <Label s={{ marginBottom: 10 }}>Savings config</Label>
            <Row label="Withdrawal delay" value="24h" />
            <Row label="Recovery keys" value="2-of-3 · 90d" />
            <Row label="Privacy" value="Balances hidden on-chain" />
          </Card>
          <Btn primary onClick={() => setStep(2)}>Deposit</Btn>
        </>
      )}
    </div>
  );
};
