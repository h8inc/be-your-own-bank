import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { c, f } from "../../../lib/theme";
import { fmtCompact, fmtUsdCompact } from "../../../lib/formatters";
import { Card, Label, Row, Btn, Expandable, BottomSheet } from "../../../components/ui";
import { LIFESTYLE_PRESETS } from "../../../hooks/usePlannerData";
import type { usePlannerData } from "../../../hooks/usePlannerData";

interface Props {
  vaultBal: number;
  horizon: 5 | 10;
  monthlyDca: number;
  setMonthlyDca: (v: number) => void;
  fiTarget: number;
  setFiTarget: (v: number) => void;
  data: ReturnType<typeof usePlannerData>;
}

const chartTooltipStyle = {
  backgroundColor: c.surface,
  border: `1px solid ${c.border}`,
  borderRadius: 6,
  fontSize: 10,
  fontFamily: f.mono,
};

export const GrowTab: React.FC<Props> = ({
  vaultBal, horizon, monthlyDca, setMonthlyDca, fiTarget, setFiTarget, data,
}) => {
  const { dcaProjection, fiCalc } = data;
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [itemAmounts, setItemAmounts] = useState<Record<string, number>>(
    Object.fromEntries(LIFESTYLE_PRESETS.map((p) => [p.id, p.amount])),
  );

  /** Recalculate fiTarget from selected lifestyle items */
  const applyLifestyle = () => {
    const total = LIFESTYLE_PRESETS.reduce(
      (sum, item) => sum + (selectedItems[item.id] ? (itemAmounts[item.id] ?? item.amount) : 0),
      0,
    );
    if (total > 0) setFiTarget(Math.round(total / 500) * 500 || 500);
    setSheetOpen(false);
  };

  const toggleItem = (id: string) => {
    setSelectedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      {/* ── SECTION 1: DCA — Stack sats ── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: c.text, fontWeight: 500, marginBottom: 4 }}>
          Invest every month
        </div>
        <div style={{ fontSize: 11, color: c.mute, marginBottom: 12, lineHeight: 1.5 }}>
          Dollar-cost averaging smooths out volatility. Set a monthly amount and see how your portfolio grows.
        </div>

        <Card s={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <Label>Monthly savings</Label>
            <span style={{ fontSize: 12, color: c.accent, fontWeight: 600, fontFamily: f.mono }}>€{monthlyDca}/mo</span>
          </div>
          <input
            type="range" min={0} max={2000} step={50} value={monthlyDca}
            onChange={(e) => setMonthlyDca(Number(e.target.value))}
            style={{ width: "100%", accentColor: c.accent, marginBottom: 12, height: 2 }}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {[0, 100, 200, 500, 1000].map((v) => (
              <button key={v} onClick={() => setMonthlyDca(v)} style={{
                fontSize: 10, color: monthlyDca === v ? c.accent : c.mute,
                background: "none", border: "none", cursor: "pointer", fontFamily: f.mono,
                padding: "4px 6px",
              }}>{v === 0 ? "None" : `€${v}`}</button>
            ))}
          </div>
        </Card>

        {/* DCA growth chart */}
        <Card s={{ marginBottom: 12, padding: "16px 8px 8px" }}>
          <Label s={{ marginBottom: 6, paddingLeft: 8 }}>Your portfolio over {horizon} years</Label>
          <div style={{ width: "100%", height: 160, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dcaProjection.chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="dcaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c.accent} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={c.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" tick={{ fontSize: 9, fill: c.mute }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 9, fill: c.mute }} tickFormatter={(v) => fmtCompact(v as number)} tickLine={false} axisLine={false} width={48} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => fmtCompact(v as number)} />
                <Area type="monotone" dataKey="p90" stroke={c.positive + "66"} fill="transparent" strokeWidth={1} strokeDasharray="3 3" dot={false} name="Optimistic" />
                <Area type="monotone" dataKey="p50" stroke={c.accent} fill="url(#dcaGrad)" strokeWidth={2} dot={false} name="Median" />
                <Area type="monotone" dataKey="p10" stroke={c.negative + "66"} fill="transparent" strokeWidth={1} strokeDasharray="3 3" dot={false} name="Conservative" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Simple result */}
        <Card s={{ marginBottom: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontSize: 9, color: c.mute, marginBottom: 2, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>You invest</div>
              <div style={{ fontSize: 16, fontWeight: 500, color: c.text, fontFamily: f.mono }}>{fmtCompact(dcaProjection.totalInvestedEur)}</div>
              <div style={{ fontSize: 10, color: c.mute, marginTop: 2 }}>over {horizon} years</div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: c.mute, marginBottom: 2, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>It could become</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: c.accent, fontFamily: f.mono }}>{fmtCompact(dcaProjection.valueP50)}</div>
              <div style={{ fontSize: 10, color: c.mute, marginTop: 2 }}>{dcaProjection.multiple > 0 ? `${dcaProjection.multiple.toFixed(1)}× at median` : "—"}</div>
            </div>
          </div>
          {/* Show assumed BTC price */}
          <div style={{ borderTop: `1px solid ${c.borderSubtle}`, marginTop: 10, paddingTop: 8 }}>
            <div style={{ fontSize: 10, color: c.mute, lineHeight: 1.5 }}>
              Assumes BTC at <span style={{ color: c.accent, fontFamily: f.mono }}>{fmtUsdCompact(dcaProjection.assumedPriceUsd)}</span> (€{fmtCompact(dcaProjection.assumedPriceEur).replace("€", "")}) median price in {2026 + horizon}. DCA buys at the modeled price each month, not today's price.
            </div>
          </div>
        </Card>

        <Expandable title="Detailed breakdown">
          <Row label="Starting BTC" value={`${vaultBal.toFixed(4)} BTC`} />
          <Row label="BTC from DCA" value={`+${dcaProjection.btcAccumulated.toFixed(4)} BTC`} color={c.positive} accent />
          <Row label="Total BTC" value={`${dcaProjection.totalBtc.toFixed(4)} BTC`} color={c.accent} accent />
          <div style={{ height: 1, background: c.borderSubtle, margin: "6px 0" }} />
          <Row label="Conservative value" value={fmtCompact(dcaProjection.valueP10)} color={c.negative} />
          <Row label="Median value" value={fmtCompact(dcaProjection.valueP50)} color={c.accent} accent />
          <Row label="Optimistic value" value={fmtCompact(dcaProjection.valueP90)} color={c.positive} />
        </Expandable>
      </div>

      {/* ── SECTION 2: Freedom — How much do you need? ── */}
      <div style={{ height: 1, background: c.border, marginBottom: 20 }} />

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: c.text, fontWeight: 500, marginBottom: 4 }}>
          Financial freedom target
        </div>
        <div style={{ fontSize: 11, color: c.mute, marginBottom: 12, lineHeight: 1.5 }}>
          How much do you need to live off your portfolio? Set your monthly spending to see.
        </div>

        <Card s={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <Label>Monthly spending</Label>
            <span style={{ fontSize: 12, color: c.accent, fontWeight: 600, fontFamily: f.mono }}>€{fiTarget.toLocaleString()}/mo</span>
          </div>
          <input
            type="range" min={1000} max={10000} step={500} value={fiTarget}
            onChange={(e) => setFiTarget(Number(e.target.value))}
            style={{ width: "100%", accentColor: c.accent, marginBottom: 8, height: 2 }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            {[1000, 2000, 3000, 5000, 10000].map((v) => (
              <button key={v} onClick={() => setFiTarget(v)} style={{
                fontSize: 10, color: fiTarget === v ? c.accent : c.mute,
                background: "none", border: "none", cursor: "pointer", fontFamily: f.mono,
                padding: "4px 2px",
              }}>{v >= 1000 ? `€${v / 1000}K` : `€${v}`}</button>
            ))}
          </div>
          {/* Lifestyle calculator button */}
          <button onClick={() => setSheetOpen(true)} style={{
            width: "100%", padding: "10px 12px", borderRadius: 6,
            background: c.surfaceRaised, border: `1px solid ${c.border}`,
            color: c.sub, fontSize: 11, fontFamily: f.sans, cursor: "pointer",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span>Not sure? Build your monthly budget</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4 3l3 3-3 3" stroke={c.mute} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </Card>

        {/* Portfolio scenarios for FI */}
        <Card s={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: c.mute, marginBottom: 8, lineHeight: 1.5 }}>
            To spend €{fiTarget.toLocaleString()}/mo indefinitely (4% withdrawal rate), you'd need:
          </div>
          {fiCalc.scenarios.map((s) => {
            const portfolioNeeded = fiCalc.portfolioNeededUsd;
            const have = s.value >= portfolioNeeded;
            const pct = Math.min(100, (s.value / portfolioNeeded) * 100);
            return (
              <div key={s.label} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: c.text, fontWeight: 500 }}>{s.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: have ? c.positive : c.text, fontFamily: f.mono }}>
                    {s.valueLabel}
                  </span>
                </div>
                {/* Progress bar */}
                <div style={{ height: 4, background: c.border, borderRadius: 2, overflow: "hidden", marginBottom: 4 }}>
                  <div style={{
                    height: "100%", borderRadius: 2, width: `${pct}%`,
                    background: have ? c.positive : pct > 50 ? c.accent : c.negative + "88",
                    transition: "width 0.3s",
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 9, color: c.mute }}>
                    {s.label} scenario in {horizon}yr
                  </span>
                  <span style={{ fontSize: 9, color: have ? c.positive : c.mute, fontWeight: have ? 600 : 400 }}>
                    {have ? "✓ You're there" : `${pct.toFixed(0)}% of target`}
                  </span>
                </div>
              </div>
            );
          })}
        </Card>

        {/* Gap + DCA timeline */}
        {fiCalc.scenarios[1].shortfall > 0 && (
          <Card s={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: c.text, fontWeight: 500, marginBottom: 8 }}>Closing the gap</div>
            <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.6 }}>
              At the likely scenario, your portfolio would be{" "}
              <span style={{ color: c.accent, fontWeight: 600 }}>
                {fmtUsdCompact(fiCalc.scenarios[1].shortfall)}
              </span>{" "}
              short of your target.
              {monthlyDca > 0 && fiCalc.yearsToGoal != null ? (
                <> At €{monthlyDca}/mo (current DCA), that's roughly{" "}
                  <span style={{ color: c.accent, fontWeight: 600 }}>{fiCalc.yearsToGoal} years</span> of stacking.</>
              ) : (
                <> Start a DCA above to see how long it would take.</>
              )}
            </div>
          </Card>
        )}

        <Card glow={c.accentSoft}>
          <div style={{ fontSize: 11, color: c.accent, fontWeight: 600, marginBottom: 4 }}>The crypto pension</div>
          <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.6 }}>
            Accumulate crypto. At financial independence, borrow against it for living expenses — never sell, never trigger capital gains. Repay from appreciation. Your portfolio stays intact.
          </div>
        </Card>
      </div>

      {/* ── Lifestyle bottom sheet ── */}
      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Build your monthly budget">
        <div style={{ fontSize: 11, color: c.mute, marginBottom: 14, lineHeight: 1.5 }}>
          Select what applies to your lifestyle. Tap an amount to adjust it.
        </div>
        {LIFESTYLE_PRESETS.map((item) => {
          const selected = !!selectedItems[item.id];
          const amt = itemAmounts[item.id] ?? item.amount;
          return (
            <div key={item.id} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 0", borderBottom: `1px solid ${c.borderSubtle}`,
            }}>
              {/* Checkbox */}
              <button onClick={() => toggleItem(item.id)} style={{
                width: 22, height: 22, borderRadius: 4, flexShrink: 0,
                border: `1.5px solid ${selected ? c.accent : c.border}`,
                background: selected ? c.accentDim : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}>
                {selected && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 6l2 2 4-4" stroke={c.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              {/* Label */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: selected ? c.text : c.sub }}>{item.label}</div>
                <div style={{ fontSize: 10, color: c.mute }}>{item.hint}</div>
              </div>
              {/* Amount — editable if selected */}
              <div style={{
                padding: "4px 8px", borderRadius: 4, minWidth: 56, textAlign: "right" as const,
                background: selected ? c.surfaceRaised : "transparent",
                border: selected ? `1px solid ${c.border}` : "1px solid transparent",
              }}>
                {selected ? (
                  <input
                    type="number"
                    value={amt}
                    onChange={(e) => setItemAmounts((prev) => ({ ...prev, [item.id]: Number(e.target.value) || 0 }))}
                    style={{
                      width: 48, fontSize: 12, fontFamily: f.mono, color: c.accent,
                      background: "transparent", border: "none", textAlign: "right" as const,
                      outline: "none",
                    }}
                  />
                ) : (
                  <span style={{ fontSize: 12, fontFamily: f.mono, color: c.mute }}>€{amt}</span>
                )}
              </div>
            </div>
          );
        })}
        {/* Total + apply */}
        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: c.sub }}>Total</span>
          <span style={{ fontSize: 18, fontWeight: 600, color: c.accent, fontFamily: f.mono }}>
            €{LIFESTYLE_PRESETS.reduce(
              (sum, item) => sum + (selectedItems[item.id] ? (itemAmounts[item.id] ?? item.amount) : 0),
              0,
            ).toLocaleString()}/mo
          </span>
        </div>
        <Btn primary onClick={applyLifestyle}>Set as my spending target</Btn>
      </BottomSheet>
    </>
  );
};
