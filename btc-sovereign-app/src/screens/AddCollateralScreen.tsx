import React, { useState } from "react";
import { c } from "../lib/theme";
import { BTC_PRICE } from "../lib/constants";
import { Label, Num, Row, Card, Btn, Back } from "../components/ui";

interface Props {
  vaultBal: number;
  activeLoan: any;
  setActiveLoan: (l: any) => void;
  setVaultBal: (fn: (v: number) => number) => void;
  go: (s: string) => void;
}

export const AddCollateralScreen: React.FC<Props> = ({ vaultBal, activeLoan, setActiveLoan, setVaultBal, go }) => {
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
          <span style={{ fontSize: 10, color: c.mute, fontFamily: "monospace" }}>{vaultBal.toFixed(4)} avail.</span>
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
        setActiveLoan((prev: any) => ({ ...prev, collateralBTC: prev.collateralBTC + addAmt }));
        go("lending");
      }}>Lock +{addAmt.toFixed(4)} BTC</Btn>
    </div>
  );
};
