import React, { useState } from "react";
import { c, f, BTC_PRICE, EUR_RATE } from "../lib/theme";
import { Label, Num, Row, Card, Btn, Back, Badge } from "../components/Primitives";

/* ─── DEPOSIT ─── */
interface DepositProps {
  setVaultBal: (fn: (v: number) => number) => void;
  go: (s: string) => void;
}

export const DepositScreen: React.FC<DepositProps> = ({ setVaultBal, go }) => {
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
          <div style={{ fontSize: 13, color: c.mute, marginTop: 4, fontFamily: f.mono }}>{amount.toFixed(4)} BTC added to savings</div>
        </div>
        <Card s={{ marginBottom: 20 }}>
          <Row label="Privacy" value="Balances hidden" color={c.positive} />
          <Row label="Recovery" value="2-of-3 backup keys" />
          <Row label="Status" value="Secured" color={c.positive} />
        </Card>
        <Btn primary onClick={() => { setVaultBal(prev => prev + amount); go("home"); }}>Done</Btn>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
      <Back onClick={() => go("home")} />
      <Label s={{ marginBottom: 6 }}>Deposit BTC</Label>
      <div style={{ fontSize: 13, color: c.mute, marginBottom: 24 }}>Add Bitcoin to your savings. You hold the keys.</div>
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
            <Label s={{ marginBottom: 10 }}>Vault config</Label>
            <Row label="Time-lock" value="24h withdrawals" />
            <Row label="Recovery" value="2-of-3 · 90d" />
            <Row label="Privacy" value="Balances hidden" color={c.positive} />
          </Card>
          <Btn primary onClick={() => setStep(2)}>Deposit</Btn>
        </>
      )}
    </div>
  );
};

/* ─── VAULT ─── */
interface VaultProps {
  vaultBal: number;
  activeLoan: any;
  go: (s: string) => void;
}

export const VaultScreen: React.FC<VaultProps> = ({ vaultBal, activeLoan, go }) => (
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
      <Row label="Withdrawal delay" value="24 hours" />
      <Row label="Recovery" value="2-of-3 backup keys" />
      <Row label="Daily limit" value="10% of balance" />
      <Row label="Privacy" value="Balances hidden on-chain" color={c.positive} />
    </Card>
    <Card>
      <Label s={{ marginBottom: 8 }}>Your BTC, your rules</Label>
      <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.6 }}>
        Your savings are protected by time-locks, multi-key recovery, and spending limits. Nobody — including us — can move your Bitcoin without your keys.
      </div>
    </Card>
  </div>
);

/* ─── REPAY ─── */
interface RepayProps {
  activeLoan: any;
  setActiveLoan: (l: any) => void;
  setVaultBal: (fn: (v: number) => number) => void;
  setCardBal: (n: number) => void;
  go: (s: string) => void;
}

export const RepayScreen: React.FC<RepayProps> = ({ activeLoan, setActiveLoan, setVaultBal, setCardBal, go }) => {
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
        <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.5 }}>Lender claims {activeLoan.collateralBTC.toFixed(4)} BTC. No extensions. On-chain execution.</div>
      </Card>
      <Btn primary onClick={() => { setVaultBal(prev => prev + activeLoan.collateralBTC); setActiveLoan(null); setCardBal(0); go("home"); }}>
        Repay ${Math.round(totalDue).toLocaleString()}
      </Btn>
    </div>
  );
};

/* ─── ADD COLLATERAL ─── */
interface AddCollateralProps {
  vaultBal: number;
  activeLoan: any;
  setActiveLoan: (l: any) => void;
  setVaultBal: (fn: (v: number) => number) => void;
  go: (s: string) => void;
}

export const AddCollateralScreen: React.FC<AddCollateralProps> = ({ vaultBal, activeLoan, setActiveLoan, setVaultBal, go }) => {
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
        setActiveLoan((prev: any) => ({ ...prev, collateralBTC: prev.collateralBTC + addAmt }));
        go("lending");
      }}>Lock +{addAmt.toFixed(4)} BTC</Btn>
    </div>
  );
};

/* ─── SETTINGS ─── */
interface SettingsProps {
  walletType: string | null;
  setWalletConnected: (v: boolean) => void;
  setWalletType: (v: string | null) => void;
  resetAll: () => void;
}

export const SettingsScreen: React.FC<SettingsProps> = ({ walletType, setWalletConnected, setWalletType, resetAll }) => {
  const [exportStatus, setExportStatus] = React.useState<string | null>(null);

  const handleExport = (format: string) => {
    setExportStatus(`Generating ${format}...`);
    setTimeout(() => setExportStatus(`${format} ready — saved to Downloads`), 1500);
    setTimeout(() => setExportStatus(null), 4000);
  };

  return (
    <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
      <div style={{ marginBottom: 24, marginTop: 4 }}>
        <Label s={{ marginBottom: 6 }}>Settings</Label>
        <div style={{ fontSize: 16, fontWeight: 400, color: c.text, fontFamily: f.display }}>Account & admin</div>
      </div>
      <Card s={{ marginBottom: 12 }}>
        <Label s={{ marginBottom: 10 }}>Wallet</Label>
        <Row label="Type" value={walletType === "jade" ? "Jade" : walletType === "ledger" ? "Ledger" : "Hot wallet"} color={c.positive} accent />
        <Row label="Connection" value={walletType === "hot" ? "On device" : walletType === "jade" ? "Bluetooth" : "USB"} />
      </Card>
      <Card s={{ marginBottom: 12 }}>
        <Label s={{ marginBottom: 10 }}>Security</Label>
        <Row label="Withdrawal delay" value="24 hours" />
        <Row label="Recovery keys" value="2-of-3" color={c.positive} accent />
        <Row label="Daily limit" value="10% of balance" />
      </Card>
      <Card s={{ marginBottom: 12 }}>
        <Label s={{ marginBottom: 10 }}>Export & reports</Label>
        <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.6, marginBottom: 12 }}>
          Download transaction history, loan statements, and tax reports. Send directly to your accountant.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 8 }}>
          <Btn compact onClick={() => handleExport("CSV")}>Download CSV</Btn>
          <Btn compact onClick={() => handleExport("PDF")}>Download PDF</Btn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <Btn compact onClick={() => handleExport("SVG chart")}>Generate SVG</Btn>
          <Btn compact onClick={() => handleExport("Email")} s={{ background: c.accentDim, color: c.accent, border: "none" }}>Send to accountant</Btn>
        </div>
        {exportStatus && (
          <div style={{ fontSize: 11, color: c.positive, marginTop: 8, fontFamily: f.mono }}>{exportStatus}</div>
        )}
      </Card>
      <Card s={{ marginBottom: 16 }}>
        <Label s={{ marginBottom: 10 }}>App</Label>
        <Row label="Version" value="0.1.0-alpha" />
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <Btn danger onClick={() => { setWalletConnected(false); setWalletType(null); }}>Disconnect</Btn>
        <Btn danger onClick={resetAll}>Reset all</Btn>
      </div>
      <div style={{ fontSize: 10, color: c.mute, marginTop: 8 }}>Reset clears all data back to defaults.</div>
    </div>
  );
};
