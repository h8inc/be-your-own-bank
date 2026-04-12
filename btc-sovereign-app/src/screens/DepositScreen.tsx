import React, { useState } from "react";
import { c, f } from "../lib/theme";
import { ASSETS, EUR_RATE } from "../lib/constants";
import type { Holding } from "../lib/constants";
import { Label, Num, Row, Card, Btn, Back } from "../components/ui";

interface Props {
  holdings: Holding[];
  setHoldings: (fn: (h: Holding[]) => Holding[]) => void;
  go: (s: string) => void;
}

export const DepositScreen: React.FC<Props> = ({ setHoldings, go }) => {
  const [step, setStep] = useState(0); // 0: asset select, 1: address + amount, 2: confirmed
  const [selectedAsset, setSelectedAsset] = useState<string>("ETH");
  const [depositAmount, setDepositAmount] = useState(1);

  const asset = ASSETS[selectedAsset];

  if (step === 2) {
    return (
      <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
        <div style={{ marginTop: 48, marginBottom: 32 }}>
          <div style={{ width: 20, height: 20, borderRadius: 10, background: c.positiveDim, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 11, color: c.positive, fontFamily: f.mono }}>✓</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 400, color: c.text, fontFamily: f.display }}>Deposit confirmed</div>
          <div style={{ fontSize: 13, color: c.mute, marginTop: 4, fontFamily: f.mono }}>
            {depositAmount.toLocaleString("en", { maximumFractionDigits: 4 })} {selectedAsset} received
          </div>
        </div>
        <Card s={{ marginBottom: 20 }}>
          <Row label="Amount" value={`${depositAmount} ${selectedAsset}`} />
          <Row label="Status" value="In your wallet" color={c.positive} accent />
          <Row label="Next" value="Shield to Railgun for privacy (optional)" />
        </Card>
        <Btn primary onClick={() => {
          setHoldings(prev => {
            const idx = prev.findIndex(h => h.assetId === selectedAsset);
            if (idx >= 0) {
              const updated = [...prev];
              updated[idx] = { ...updated[idx], amount: updated[idx].amount + depositAmount };
              return updated;
            }
            return prev;
          });
          go("home");
        }}>Done</Btn>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
      <Back onClick={() => go("home")} />
      <Label s={{ marginBottom: 6 }}>Deposit</Label>
      <div style={{ fontSize: 13, color: c.mute, marginBottom: 24 }}>Add assets to your wallet</div>

      {step === 0 && (
        <>
          <Label s={{ marginBottom: 8 }}>Select asset</Label>
          {["ETH", "BTC", "SOL", "USDC", "USDT"].map(assetId => {
            const a = ASSETS[assetId];
            return (
              <button key={assetId} onClick={() => {
                setSelectedAsset(assetId);
                setStep(1);
              }} style={{
                width: "100%", background: c.surface,
                border: `1px solid ${c.border}`,
                borderRadius: 6, padding: "12px 16px", cursor: "pointer", textAlign: "left" as const,
                marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center",
                transition: "all 0.15s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: a.color }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: c.text }}>{a.name}</div>
                    <div style={{ fontSize: 10, color: c.mute }}>Price: ${a.priceUsd.toLocaleString()}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </>
      )}

      {step === 1 && (
        <>
          <Card s={{ marginBottom: 12 }}>
            <Label s={{ marginBottom: 10 }}>Your public address</Label>
            <div style={{
              background: c.bg, border: `1px solid ${c.border}`, borderRadius: 6,
              padding: "10px 12px", fontFamily: f.mono, fontSize: 10, color: c.sub,
              wordBreak: "break-all", lineHeight: 1.5, marginBottom: 10,
            }}>
              0x742d35Cc6634C0532925a3b844Bc9e7595f42E0a
            </div>
            <div style={{ fontSize: 10, color: c.mute, lineHeight: 1.5 }}>
              Send {asset.name} from an exchange or another wallet to this address. Deposits appear in a few moments.
            </div>
          </Card>

          <Card s={{ marginBottom: 12 }}>
            <Label s={{ marginBottom: 10 }}>Amount</Label>
            <input type="range" min={0.01} max={100} step={0.01} value={depositAmount}
              onChange={e => setDepositAmount(Number(e.target.value))}
              style={{ width: "100%", accentColor: c.accent, marginBottom: 12, height: 2 }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <Num>{depositAmount.toLocaleString("en", { maximumFractionDigits: 4 })} <span style={{ fontSize: 13, color: c.mute }}>{selectedAsset}</span></Num>
              <span style={{ fontSize: 12, color: c.mute, fontFamily: f.mono }}>≈ €{(depositAmount * asset.priceUsd * EUR_RATE).toLocaleString("en", { maximumFractionDigits: 0 })}</span>
            </div>
          </Card>

          <Card s={{ marginBottom: 16 }}>
            <Label s={{ marginBottom: 10 }}>After deposit arrives</Label>
            <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.6, marginBottom: 12 }}>
              Once confirmed, you can shield it into Railgun for privacy.
            </div>
            <Row label="Network" value="Ethereum mainnet" />
            <Row label="Fees" value="Variable (gas)" />
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Btn onClick={() => setStep(0)} s={{ border: `1px solid ${c.border}` }}>Back</Btn>
            <Btn primary onClick={() => setStep(2)}>Deposited</Btn>
          </div>
        </>
      )}
    </div>
  );
};
