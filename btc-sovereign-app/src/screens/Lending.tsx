import React, { useState } from "react";
import { c, f } from "../lib/theme";
import { ASSETS, EUR_RATE } from "../lib/constants";
import type { Holding } from "../lib/constants";
import { Label, Num, Row, Card, Btn } from "../components/ui";

interface Props {
  holdings: Holding[];
  activeLoan: any;
  setActiveLoan: (l: any) => void;
  setHoldings: (h: Holding[]) => void;
  go: (s: string) => void;
}

export const LendingScreen: React.FC<Props> = ({ holdings, activeLoan, setActiveLoan, go }) => {
  const [mode, setMode] = useState<"borrow" | "earn">("borrow");
  const [selectedCollateral, setSelectedCollateral] = useState<string>("ETH");
  const [collateralAmount, setCollateralAmount] = useState(1);
  const [borrowAmount, setBorrowAmount] = useState(1000);
  const [showReview, setShowReview] = useState(false);
  const [signing, setSigning] = useState(false);

  const collateralAsset = ASSETS[selectedCollateral];
  const collateralValueUsd = collateralAmount * collateralAsset.priceUsd;
  const borrowingPowerUsd = collateralValueUsd * collateralAsset.maxLtv;
  const ltv = borrowingPowerUsd > 0 ? (borrowAmount / borrowingPowerUsd) * 100 : 0;
  const healthFactor = ltv > 0 ? 1 / (ltv / 100) : 0;
  const liquidationPrice = (borrowAmount / (collateralAmount * collateralAsset.liquidationThreshold)) * (collateralAsset.priceUsd / collateralAsset.liquidationThreshold);

  // Aave variable rates (mock)
  const currentAaveRate = 4.5;

  const ModeToggle = () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, background: c.surface, borderRadius: 6, border: `1px solid ${c.border}`, padding: 3 }}>
      {(["borrow", "earn"] as const).map(m => (
        <button key={m} onClick={() => setMode(m)} style={{
          padding: "10px 0", borderRadius: 4, fontSize: 12, fontWeight: 600,
          border: "none", cursor: "pointer", fontFamily: f.sans, letterSpacing: "0.02em",
          background: mode === m ? c.surfaceRaised : "transparent",
          color: mode === m ? c.text : c.mute, transition: "all 0.15s",
        }}>{m === "borrow" ? "Borrow" : "Earn"}</button>
      ))}
    </div>
  );

  const ReviewSheet = () => (
    <div style={{ display: showReview ? "block" : "none" }}>
      <Card s={{ marginBottom: 16 }}>
        <Label s={{ marginBottom: 10 }}>Review transaction</Label>
        <Row label="Collateral" value={`${collateralAmount} ${selectedCollateral}`} color={c.accent} accent />
        <Row label="Borrow amount" value={`${borrowAmount} USDC`} color={c.positive} accent />
        <Row label="Rate (variable)" value={`${currentAaveRate}% APY`} />
        <Row label="Your LTV" value={`${ltv.toFixed(1)}%`} color={ltv > 80 ? c.negative : c.text} />
        <Row label="Liquidation price" value={`$${liquidationPrice.toFixed(0)}`} color={ltv > 80 ? c.negative : c.text} />
      </Card>

      {ltv > 80 && (
        <Card glow={c.negativeDim} s={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
            <div>
              <div style={{ fontSize: 12, color: c.negative, fontWeight: 600, marginBottom: 4 }}>High LTV</div>
              <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.5 }}>
                You're borrowing {ltv.toFixed(1)}% of your collateral's value. Price drops could trigger liquidation.
              </div>
            </div>
          </div>
        </Card>
      )}

      {!signing ? (
        <Btn primary onClick={() => {
          setSigning(true);
          setTimeout(() => {
            setActiveLoan({
              collateralAsset: selectedCollateral,
              collateralAmount,
              borrowAmount,
              rate: currentAaveRate,
              startDate: new Date().toLocaleDateString("en-GB"),
              healthFactor: healthFactor.toFixed(2),
            });
            setShowReview(false);
            setSigning(false);
            go("home");
          }, 1500);
        }}>
          Sign & borrow
        </Btn>
      ) : (
        <div style={{ textAlign: "center", padding: "12px 0" }}>
          <div style={{
            width: 40, height: 40, borderRadius: 20,
            border: `2px solid ${c.border}`, borderTopColor: c.accent,
            margin: "0 auto 12px",
            animation: "spin 0.8s linear infinite",
          }} />
          <div style={{ fontSize: 13, color: c.text, fontWeight: 500, marginBottom: 4 }}>Waiting for wallet...</div>
          <div style={{ fontSize: 11, color: c.mute }}>Confirm in MetaMask or Ledger</div>
        </div>
      )}
    </div>
  );

  // ── Active loan view
  if (activeLoan) {
    return (
      <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
        <div style={{ marginBottom: 24, marginTop: 4 }}>
          <Label s={{ marginBottom: 6 }}>Borrowing position</Label>
          <Num large>{activeLoan.borrowAmount} USDC</Num>
          <div style={{ fontSize: 13, color: c.sub, fontFamily: f.mono, marginTop: 4 }}>
            Health factor: {activeLoan.healthFactor}
          </div>
          <div style={{ width: 40, height: 2, background: c.accent, borderRadius: 1, marginTop: 14 }} />
        </div>

        <Card s={{ marginBottom: 12 }}>
          <Label s={{ marginBottom: 10 }}>Position</Label>
          <Row label="Collateral" value={`${activeLoan.collateralAmount} ${activeLoan.collateralAsset}`} color={c.accent} accent />
          <Row label="Borrowed" value={`${activeLoan.borrowAmount} USDC`} />
          <Row label="Rate" value={`${activeLoan.rate}% APY (variable)`} />
          <Row label="LTV" value={`${((activeLoan.borrowAmount / (activeLoan.collateralAmount * ASSETS[activeLoan.collateralAsset].priceUsd * ASSETS[activeLoan.collateralAsset].maxLtv)) * 100).toFixed(1)}%`} />
          <Row label="Health factor" value={activeLoan.healthFactor} color={Number(activeLoan.healthFactor) < 1.5 ? c.negative : c.text} accent />
        </Card>

        <Card s={{ marginBottom: 16 }}>
          <Label s={{ marginBottom: 10 }}>How it works</Label>
          <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.6 }}>
            Your assets are locked as collateral on Aave. Interest accrues continuously. You can repay anytime. If your health factor drops below 1, liquidators can claim your collateral.
          </div>
        </Card>

        <Btn primary>Repay</Btn>
      </div>
    );
  }

  // ── Earn mode (supply to Aave)
  if (mode === "earn") {
    const supplyAssets = [
      { id: "USDC", apy: 4.5 },
      { id: "USDT", apy: 4.0 },
      { id: "ETH", apy: 2.0 },
      { id: "BTC", apy: 1.0 },
    ];

    return (
      <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
        <div style={{ marginBottom: 16, marginTop: 4 }}>
          <div style={{ width: 32, height: 2, background: c.info, borderRadius: 1, marginBottom: 12 }} />
          <div style={{ fontSize: 20, fontWeight: 300, color: c.text, fontFamily: f.display, lineHeight: 1.3 }}>
            Earn yield.<br />Keep full control.
          </div>
          <div style={{ fontSize: 11, color: c.mute, marginTop: 8 }}>Supply assets to Aave and earn interest while you hold</div>
        </div>

        <Label s={{ marginBottom: 8 }}>Lending opportunities</Label>
        {supplyAssets.map(asset => {
          const tokenAsset = ASSETS[asset.id];
          const holding = holdings.find(h => h.assetId === asset.id);
          return (
            <Card key={asset.id} s={{ marginBottom: 8, cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: "50%", background: tokenAsset.color,
                  }} />
                  <div>
                    <div style={{ fontSize: 13, color: c.text, fontWeight: 500 }}>{asset.id}</div>
                    <div style={{ fontSize: 10, color: c.mute }}>You have: {holding?.amount.toFixed(2) || "0"}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, color: c.positive, fontWeight: 600 }}>{asset.apy}% APY</div>
                  <div style={{ fontSize: 10, color: c.mute }}>Annual yield</div>
                </div>
              </div>
            </Card>
          );
        })}

        <Btn primary s={{ marginTop: 16 }} onClick={() => {
          // Supply flow would go here
        }}>Supply assets</Btn>
      </div>
    );
  }

  // ── Borrow mode
  return (
    <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
      <div style={{ marginTop: 4, marginBottom: 16 }}><ModeToggle /></div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ width: 32, height: 2, background: c.accent, borderRadius: 1, marginBottom: 12 }} />
        <div style={{ fontSize: 20, fontWeight: 300, color: c.text, fontFamily: f.display, lineHeight: 1.3 }}>
          Use your assets.<br />Get liquidity.
        </div>
        <div style={{ fontSize: 11, color: c.mute, marginTop: 8 }}>Borrow stablecoins against your crypto collateral</div>
      </div>

      {/* Collateral selection */}
      <Label s={{ marginBottom: 8 }}>Select collateral</Label>
      <div style={{ marginBottom: 12 }}>
        {holdings
          .filter(h => {
            const asset = ASSETS[h.assetId];
            return asset && asset.maxLtv > 0 && h.amount > 0;
          })
          .map(h => {
            const asset = ASSETS[h.assetId];
            return (
              <button key={h.assetId} onClick={() => {
                setSelectedCollateral(h.assetId);
                setCollateralAmount(Math.min(h.amount, 1));
              }} style={{
                width: "100%", marginBottom: 8, padding: "12px 14px", borderRadius: 6,
                background: selectedCollateral === h.assetId ? c.surfaceRaised : c.surface,
                border: `1px solid ${selectedCollateral === h.assetId ? c.accent : c.border}`,
                cursor: "pointer", textAlign: "left", transition: "all 0.15s",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: asset.color }} />
                    <div>
                      <div style={{ fontSize: 13, color: c.text, fontWeight: 500 }}>{h.assetId}</div>
                      <div style={{ fontSize: 10, color: c.mute }}>Max LTV: {(asset.maxLtv * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: c.text, fontWeight: 500 }}>{h.amount.toFixed(2)}</div>
                    <div style={{ fontSize: 10, color: c.mute }}>available</div>
                  </div>
                </div>
              </button>
            );
          })}
      </div>

      {/* Collateral amount slider */}
      <Card s={{ marginBottom: 12 }}>
        <Label s={{ marginBottom: 10 }}>Collateral amount</Label>
        <input type="range" min={0.01} max={Math.min(100, holdings.find(h => h.assetId === selectedCollateral)?.amount || 1)} step={0.01}
          value={collateralAmount}
          onChange={e => setCollateralAmount(Number(e.target.value))}
          style={{ width: "100%", accentColor: c.accent, marginBottom: 12, height: 2 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Num>{collateralAmount.toLocaleString("en", { maximumFractionDigits: 2 })} <span style={{ fontSize: 13, color: c.mute }}>{selectedCollateral}</span></Num>
          <span style={{ fontSize: 12, color: c.mute, fontFamily: f.mono }}>≈ €{(collateralValueUsd * EUR_RATE).toLocaleString("en", { maximumFractionDigits: 0 })}</span>
        </div>
      </Card>

      {/* Borrow amount */}
      <Card s={{ marginBottom: 12 }}>
        <Label s={{ marginBottom: 10 }}>Borrow amount</Label>
        <input type="range" min={0} max={borrowingPowerUsd} step={100}
          value={borrowAmount}
          onChange={e => setBorrowAmount(Math.min(borrowingPowerUsd, Number(e.target.value)))}
          style={{ width: "100%", accentColor: c.accent, marginBottom: 12, height: 2 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Num>{borrowAmount.toLocaleString("en", { maximumFractionDigits: 0 })} <span style={{ fontSize: 13, color: c.mute }}>USDC</span></Num>
          <span style={{ fontSize: 12, color: c.mute, fontFamily: f.mono }}>≈ €{(borrowAmount * EUR_RATE).toLocaleString("en", { maximumFractionDigits: 0 })}</span>
        </div>
      </Card>

      {/* Summary */}
      <Card s={{ marginBottom: 16 }}>
        <Label s={{ marginBottom: 10 }}>Your position</Label>
        <Row label="Borrowing power" value={`${borrowingPowerUsd.toLocaleString("en", { maximumFractionDigits: 0 })} USDC`} />
        <Row label="You borrow" value={`${borrowAmount} USDC`} />
        <Row label="LTV" value={`${ltv.toFixed(1)}%`} color={ltv > 80 ? c.negative : ltv > 60 ? c.accent : c.positive} accent />
        <Row label="Health factor" value={healthFactor.toFixed(2)} color={healthFactor < 1.5 ? c.negative : c.positive} accent />
        <Row label="Rate" value={`${currentAaveRate}% variable APY`} />
      </Card>

      <Btn primary onClick={() => setShowReview(true)} disabled={borrowAmount <= 0 || ltv > 90}>
        Review & borrow
      </Btn>

      {showReview && <ReviewSheet />}
    </div>
  );
};
