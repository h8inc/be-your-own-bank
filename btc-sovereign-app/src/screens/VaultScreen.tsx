import React from "react";
import { c, f } from "../lib/theme";
import { BTC_PRICE, EUR_RATE } from "../lib/constants";
import { Label, Num, Row, Card, Btn, Back } from "../components/ui";

interface Props {
  vaultBal: number;
  activeLoan: any;
  go: (s: string) => void;
}

export const VaultScreen: React.FC<Props> = ({ vaultBal, activeLoan, go }) => (
  <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
    <Back onClick={() => go("home")} />
    <div style={{ marginBottom: 24 }}>
      <Label s={{ marginBottom: 6 }}>Savings</Label>
      <Num large>{vaultBal.toFixed(4)} <span style={{ fontSize: 16, color: c.accent }}>BTC</span></Num>
      <div style={{ fontSize: 14, color: c.mute, fontFamily: f.mono, marginTop: 4 }}>
        €{(vaultBal * BTC_PRICE * EUR_RATE).toLocaleString("en", { maximumFractionDigits: 0 })}
      </div>
      {activeLoan && <div style={{ fontSize: 12, color: c.accent, marginTop: 6, fontFamily: f.mono }}>+ {activeLoan.collateralBTC.toFixed(4)} locked as collateral</div>}
      <div style={{ width: 40, height: 2, background: c.accent, borderRadius: 1, marginTop: 14 }} />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
      <Btn onClick={() => go("deposit")}>Deposit</Btn>
      <Btn ghost s={{ border: `1px solid ${c.border}` }}>Withdraw</Btn>
    </div>
    <Card s={{ marginBottom: 12 }}>
      <Label s={{ marginBottom: 10 }}>Security</Label>
      <Row label="Withdrawal delay" value="24h" />
      <Row label="2-of-3 backup keys" value="90d recovery" />
      <Row label="10% of balance" value="Daily limit" />
      <Row label="Privacy" value="Balances hidden on-chain" />
    </Card>
    <Card>
      <Label s={{ marginBottom: 8 }}>Your BTC, your rules</Label>
      <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.6 }}>
        Your keys, your complete control. No third party. No surprises. Time-locks and backup keys mean you'll always have access to your BTC.
      </div>
    </Card>
  </div>
);
