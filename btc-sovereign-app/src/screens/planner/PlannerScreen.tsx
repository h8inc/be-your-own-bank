import React, { useState } from "react";
import { c, f } from "../../lib/theme";
import { BTC_PRICE, EUR_RATE } from "../../lib/constants";
import { fmtCompact } from "../../lib/formatters";
import { Card, Label, Badge } from "../../components/ui";
import { usePlannerData } from "../../hooks/usePlannerData";
import { OverviewTab } from "./tabs/OverviewTab";
import { ProjectionsTab } from "./tabs/ProjectionsTab";
import { GrowTab } from "./tabs/GrowTab";
import { TaxTab } from "./tabs/TaxTab";

interface Props {
  vaultBal: number;
  walletConnected: boolean;
  manualBtc: number;
  setManualBtc: (v: number) => void;
  onConnect: () => void;
}

type Tab = "overview" | "projections" | "grow" | "tax";

export const PlannerScreen: React.FC<Props> = ({
  vaultBal, walletConnected, manualBtc, setManualBtc, onConnect,
}) => {
  const [tab, setTab] = useState<Tab>("overview");
  const [horizon, setHorizon] = useState<5 | 10>(10);
  const [monthlyDca, setMonthlyDca] = useState(200);
  const [fiTarget, setFiTarget] = useState(3000);

  const data = usePlannerData({
    vaultBal,
    horizon,
    monthlyDca,
    fiTarget,
    includeDcaInCorridor: tab === "grow",
  });

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "projections", label: "Models" },
    { id: "grow", label: "Grow" },
    { id: "tax", label: "Tax" },
  ];

  return (
    <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
      {/* Header */}
      <div style={{ marginBottom: 12, marginTop: 4 }}>
        <div style={{ width: 32, height: 2, background: c.accent, borderRadius: 1, marginBottom: 12 }} />
        <div style={{ fontSize: 18, fontWeight: 300, color: c.text, fontFamily: f.display, lineHeight: 1.3 }}>
          Your Bitcoin plan.
        </div>
        <div style={{ fontSize: 11, color: c.mute, marginTop: 4 }}>
          See where you might be headed. Plan how to get there.
        </div>
      </div>

      {/* ── BTC input for non-connected users ── */}
      {!walletConnected && (
        <Card s={{ marginBottom: 12, padding: "12px 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Label s={{ margin: 0 }}>How much BTC do you hold?</Label>
            </div>
            <Badge text="Free preview" color={c.accent} />
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{
              flex: 1, display: "flex", alignItems: "center", gap: 6,
              background: c.surfaceRaised, borderRadius: 6, padding: "8px 12px",
              border: `1px solid ${c.border}`,
            }}>
              <input
                type="number"
                min={0}
                step={0.01}
                value={manualBtc || ""}
                placeholder="0.00"
                onChange={(e) => setManualBtc(Math.max(0, Number(e.target.value) || 0))}
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  color: c.text, fontSize: 16, fontFamily: f.mono, fontWeight: 500,
                  width: "100%",
                }}
              />
              <span style={{ fontSize: 12, color: c.accent, fontWeight: 600, fontFamily: f.mono, flexShrink: 0 }}>BTC</span>
            </div>
          </div>
          {manualBtc > 0 && (
            <div style={{ fontSize: 10, color: c.mute, marginTop: 6, fontFamily: f.mono }}>
              ≈ {fmtCompact(manualBtc * BTC_PRICE * EUR_RATE)} today
            </div>
          )}
          {/* Quick presets */}
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            {[0.1, 0.5, 1, 2, 5].map((v) => (
              <button key={v} onClick={() => setManualBtc(v)} style={{
                flex: 1, padding: "6px 0", borderRadius: 4, fontSize: 10,
                border: `1px solid ${manualBtc === v ? c.accent : c.border}`,
                background: manualBtc === v ? c.accentDim : "transparent",
                color: manualBtc === v ? c.accent : c.mute,
                cursor: "pointer", fontFamily: f.mono, fontWeight: 500,
              }}>{v}</button>
            ))}
          </div>
          {/* Connect prompt */}
          <button onClick={onConnect} style={{
            width: "100%", marginTop: 10, padding: "8px 0", borderRadius: 4,
            background: "transparent", border: `1px solid ${c.border}`,
            color: c.sub, fontSize: 11, fontFamily: f.sans, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            transition: "border-color 0.15s",
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="3" y="6" width="8" height="6" rx="1" stroke={c.mute} strokeWidth="1.2" />
              <path d="M5 6V4.5a2 2 0 014 0V6" stroke={c.mute} strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            Connect wallet for live balances
          </button>
        </Card>
      )}

      {/* Horizon toggle */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {([5, 10] as const).map((h) => (
          <button key={h} onClick={() => setHorizon(h)} style={{
            padding: "6px 14px", borderRadius: 4, fontSize: 11, fontWeight: 600,
            border: `1px solid ${horizon === h ? c.accent : c.border}`,
            background: horizon === h ? c.accentDim : "transparent",
            color: horizon === h ? c.accent : c.mute, cursor: "pointer", fontFamily: f.mono,
          }}>{h} year</button>
        ))}
      </div>

      {/* Tab nav */}
      <div style={{
        display: "flex", gap: 0, marginBottom: 16, background: c.surface,
        borderRadius: 6, border: `1px solid ${c.border}`, padding: 3, overflowX: "auto",
      }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "8px 10px", borderRadius: 4, fontSize: 10, fontWeight: 600,
            border: "none", cursor: "pointer", fontFamily: f.sans, letterSpacing: "0.02em",
            background: tab === t.id ? c.surfaceRaised : "transparent",
            color: tab === t.id ? c.text : c.mute, transition: "all 0.15s",
            whiteSpace: "nowrap", flex: "1 0 auto",
          }}>{t.label}</button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "overview" && <OverviewTab vaultBal={vaultBal} horizon={horizon} data={data} />}
      {tab === "projections" && <ProjectionsTab vaultBal={vaultBal} horizon={horizon} data={data} />}
      {tab === "grow" && (
        <GrowTab
          vaultBal={vaultBal}
          horizon={horizon}
          monthlyDca={monthlyDca}
          setMonthlyDca={setMonthlyDca}
          fiTarget={fiTarget}
          setFiTarget={setFiTarget}
          data={data}
        />
      )}
      {tab === "tax" && <TaxTab />}
    </div>
  );
};
