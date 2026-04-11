import React from "react";
import { c, f } from "../lib/theme";
import { BTC_PRICE } from "../lib/constants";
import { Label, Num, Row, Card, Btn, Back } from "../components/ui";

interface Props {
  activeLoan: any;
  setActiveLoan: (l: any) => void;
  setVaultBal: (fn: (v: number) => number) => void;
  setCardBal: (n: number) => void;
  go: (s: string) => void;
}

export const RepayScreen: React.FC<Props> = ({ activeLoan, setActiveLoan, setVaultBal, setCardBal, go }) => {
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
        <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.5 }}>Principal + interest to lender. Your {activeLoan.collateralBTC.toFixed(4)} BTC unlocked immediately.</div>
      </Card>
      <Card glow={c.negative + "33"} s={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: c.negative, fontWeight: 600, marginBottom: 4 }}>Miss the deadline</div>
        <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.5 }}>Lender claims {activeLoan.collateralBTC.toFixed(4)} BTC. No extensions. Automatic enforcement.</div>
      </Card>
      <Btn primary onClick={() => { setVaultBal(prev => prev + activeLoan.collateralBTC); setActiveLoan(null); setCardBal(0); go("home"); }}>
        Repay ${Math.round(totalDue).toLocaleString()}
      </Btn>
    </div>
  );
};
