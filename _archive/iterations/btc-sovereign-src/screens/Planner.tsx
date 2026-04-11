import React, { useState, useMemo, useCallback } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { c, f, BTC_PRICE, EUR_RATE } from "../lib/theme";
import { fmtCompact, fmtUsdCompact, fmtPct } from "../lib/formatters";
import { Label, Num, Row, Card, Btn, Badge } from "../components/Primitives";
import { runMonteCarlo, CYCLE_2026_5YR, CYCLE_2026_10YR } from "../models/monteCarlo";
import { computeBagCorridorPoints, buildHorizonTable } from "../models/powerLaw";

interface Props {
  vaultBal: number;
}

type Tab = "overview" | "corridor" | "monte" | "accumulate" | "fi";

export const PlannerScreen: React.FC<Props> = ({ vaultBal }) => {
  const [tab, setTab] = useState<Tab>("overview");
  const [horizon, setHorizon] = useState<5 | 10>(10);
  const [monthlyDca, setMonthlyDca] = useState(200);
  const [fiTarget, setFiTarget] = useState(3000); // monthly EUR

  // ── Power Law corridor
  const corridorPoints = useMemo(() =>
    computeBagCorridorPoints({
      startPriceUsd: BTC_PRICE,
      totalBtc: vaultBal,
      nMonths: horizon * 12,
      monthlyDcaEur: tab === "accumulate" ? monthlyDca : 0,
    }), [vaultBal, horizon, monthlyDca, tab]
  );

  const horizonTable = useMemo(() => {
    const full = computeBagCorridorPoints({ startPriceUsd: BTC_PRICE, totalBtc: vaultBal, nMonths: 120 });
    return buildHorizonTable(full);
  }, [vaultBal]);

  // ── Monte Carlo
  const mc = useMemo(() =>
    runMonteCarlo({
      startPriceUsd: BTC_PRICE,
      nPaths: 10000,
      nMonths: horizon * 12,
      cyclePhases: horizon === 5 ? CYCLE_2026_5YR : CYCLE_2026_10YR,
      collectMonthly: true,
    }), [horizon]
  );

  // Chart data
  const corridorChartData = useMemo(() =>
    corridorPoints.filter((_, i) => i % 3 === 0 || i === corridorPoints.length - 1).map(p => ({
      year: p.year.toFixed(1),
      p10: Math.round(p.p10),
      p25: Math.round(p.p25),
      p50: Math.round(p.p50),
      p75: Math.round(p.p75),
      p90: Math.round(p.p90),
    })), [corridorPoints]
  );

  const mcChartData = useMemo(() =>
    mc.monthlyPaths ? mc.monthlyPaths.filter((_, i) => i % 3 === 0 || i === (mc.monthlyPaths?.length ?? 1) - 1).map(p => ({
      month: p.month,
      year: (2026 + p.month / 12).toFixed(1),
      p10: Math.round(p.p10),
      p25: Math.round(p.p25),
      p50: Math.round(p.p50),
      p75: Math.round(p.p75),
      p90: Math.round(p.p90),
    })) : [], [mc]
  );

  // ── FI calc: how much BTC needed for target monthly income via 4% SWR
  const fiCalc = useMemo(() => {
    const annualNeed = fiTarget * 12;
    const portfolioNeeded = annualNeed / 0.04; // 4% SWR
    const portfolioNeededUsd = portfolioNeeded / EUR_RATE;
    // At different price levels
    const scenarios = [
      { label: "P10 (floor)", price: mc.p10, btcNeeded: portfolioNeededUsd / mc.p10 },
      { label: "P25", price: mc.p25, btcNeeded: portfolioNeededUsd / mc.p25 },
      { label: "P50 (median)", price: mc.p50, btcNeeded: portfolioNeededUsd / mc.p50 },
      { label: "P75", price: mc.p75, btcNeeded: portfolioNeededUsd / mc.p75 },
      { label: "P90 (bull)", price: mc.p90, btcNeeded: portfolioNeededUsd / mc.p90 },
    ];
    return { annualNeed, portfolioNeeded, portfolioNeededUsd, scenarios };
  }, [fiTarget, mc, horizon]);

  // ── DCA projection
  const dcaProjection = useMemo(() => {
    const months = horizon * 12;
    const totalInvested = monthlyDca * months;
    const endPoint = corridorPoints[corridorPoints.length - 1];
    return {
      totalInvestedEur: totalInvested,
      btcAccumulated: endPoint.btcStack - vaultBal,
      totalBtc: endPoint.btcStack,
      valueP50: endPoint.p50,
      valueP10: endPoint.p10,
      valueP90: endPoint.p90,
      multiple: endPoint.p50 / (vaultBal * BTC_PRICE * EUR_RATE + totalInvested),
    };
  }, [corridorPoints, monthlyDca, horizon, vaultBal]);

  // ── Tab navigation
  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "corridor", label: "Corridor" },
    { id: "monte", label: "Monte Carlo" },
    { id: "accumulate", label: "Stack" },
    { id: "fi", label: "FI" },
  ];

  const chartTooltipStyle = {
    backgroundColor: c.surface, border: `1px solid ${c.border}`,
    borderRadius: 6, fontSize: 10, fontFamily: f.mono,
  };

  return (
    <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
      {/* Header */}
      <div style={{ marginBottom: 12, marginTop: 4 }}>
        <div style={{ width: 32, height: 2, background: c.accent, borderRadius: 1, marginBottom: 12 }} />
        <div style={{ fontSize: 18, fontWeight: 300, color: c.text, fontFamily: f.display, lineHeight: 1.3 }}>
          Plan your sovereignty.
        </div>
        <div style={{ fontSize: 11, color: c.mute, marginTop: 4 }}>Power law · Monte Carlo · Accumulation · Financial independence</div>
      </div>

      {/* Horizon toggle */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {([5, 10] as const).map(h => (
          <button key={h} onClick={() => setHorizon(h)} style={{
            padding: "6px 14px", borderRadius: 4, fontSize: 11, fontWeight: 600,
            border: `1px solid ${horizon === h ? c.accent : c.border}`,
            background: horizon === h ? c.accentDim : "transparent",
            color: horizon === h ? c.accent : c.mute, cursor: "pointer", fontFamily: f.mono,
          }}>{h}yr</button>
        ))}
      </div>

      {/* Sub-tab navigation */}
      <div style={{
        display: "flex", gap: 0, marginBottom: 16, background: c.surface,
        borderRadius: 6, border: `1px solid ${c.border}`, padding: 3, overflowX: "auto",
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "8px 10px", borderRadius: 4, fontSize: 10, fontWeight: 600,
            border: "none", cursor: "pointer", fontFamily: f.sans, letterSpacing: "0.02em",
            background: tab === t.id ? c.surfaceRaised : "transparent",
            color: tab === t.id ? c.text : c.mute, transition: "all 0.15s",
            whiteSpace: "nowrap", flex: "1 0 auto",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ═══════════ OVERVIEW ═══════════ */}
      {tab === "overview" && (
        <>
          {/* Current position */}
          <Card s={{ marginBottom: 12 }}>
            <Label s={{ marginBottom: 10 }}>Your position</Label>
            <Row label="BTC stack" value={`${vaultBal.toFixed(4)} BTC`} color={c.accent} accent />
            <Row label="Current value" value={fmtCompact(vaultBal * BTC_PRICE * EUR_RATE)} />
            <Row label="BTC price" value={fmtUsdCompact(BTC_PRICE)} />
          </Card>

          {/* Horizon table */}
          <Card s={{ marginBottom: 12 }}>
            <Label s={{ marginBottom: 10 }}>Power law projection</Label>
            <div style={{ fontSize: 10, color: c.mute, marginBottom: 12, lineHeight: 1.5 }}>
              Portfolio value (EUR) at P10/P50/P90 confidence bands. Based on BTC power-law regression with age-compressing corridor.
            </div>
            {horizonTable.rows.map(row => (
              <div key={row.key} style={{ marginBottom: 12, paddingBottom: 10, borderBottom: `1px solid ${c.borderSubtle}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: c.text, fontFamily: f.sans }}>{row.horizon}</span>
                  <span style={{ fontSize: 10, color: c.mute }}>{row.sub}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                  {[
                    { label: "Floor", value: row.floor, col: c.negative },
                    { label: "Fair", value: row.fair, col: c.accent },
                    { label: "Ceiling", value: row.ceiling, col: c.positive },
                  ].map(({ label, value, col }) => (
                    <div key={label}>
                      <div style={{ fontSize: 9, color: c.mute, marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: col, fontFamily: f.mono }}>
                        {fmtCompact(value)}
                      </div>
                    </div>
                  ))}
                </div>
                {typeof row.growthPct === "number" && (
                  <div style={{ fontSize: 10, color: c.sub, marginTop: 4, fontFamily: f.mono }}>
                    {fmtPct(row.growthPct)} CAGR
                  </div>
                )}
              </div>
            ))}
          </Card>

          {/* MC quick stats */}
          <Card s={{ marginBottom: 12 }}>
            <Label s={{ marginBottom: 10 }}>Monte Carlo · {horizon}yr · {mc.nPaths.toLocaleString()} paths</Label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "Median BTC", value: fmtUsdCompact(mc.p50), col: c.accent },
                { label: "P90 (bull)", value: fmtUsdCompact(mc.p90), col: c.positive },
                { label: "P10 (floor)", value: fmtUsdCompact(mc.p10), col: c.negative },
                { label: "Max DD (med)", value: `-${(mc.medianMaxDD * 100).toFixed(0)}%`, col: c.negative },
              ].map(({ label, value, col }) => (
                <div key={label} style={{ padding: "8px 0" }}>
                  <div style={{ fontSize: 9, color: c.mute, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: col, fontFamily: f.mono }}>{value}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, fontSize: 10, color: c.sub }}>
              {(mc.pBelowEntry * 100).toFixed(0)}% of paths end below today's price
            </div>
          </Card>
        </>
      )}

      {/* ═══════════ CORRIDOR CHART ═══════════ */}
      {tab === "corridor" && (
        <>
          <Card s={{ marginBottom: 12, padding: "16px 8px 8px" }}>
            <Label s={{ marginBottom: 8, paddingLeft: 8 }}>Portfolio value corridor (EUR)</Label>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <AreaChart data={corridorChartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="gradP90" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={c.positive} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={c.positive} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradP50" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={c.accent} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={c.accent} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" tick={{ fontSize: 9, fill: c.mute }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 9, fill: c.mute }} tickFormatter={(v: number) => fmtCompact(v)} tickLine={false} axisLine={false} width={48} />
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => fmtCompact(v)} labelStyle={{ color: c.sub, fontSize: 10 }} />
                  <Area type="monotone" dataKey="p90" stroke={c.positive} fill="url(#gradP90)" strokeWidth={1} dot={false} name="P90" />
                  <Area type="monotone" dataKey="p75" stroke={c.positive + "66"} fill="transparent" strokeWidth={1} strokeDasharray="3 3" dot={false} name="P75" />
                  <Area type="monotone" dataKey="p50" stroke={c.accent} fill="url(#gradP50)" strokeWidth={2} dot={false} name="Median" />
                  <Area type="monotone" dataKey="p25" stroke={c.negative + "66"} fill="transparent" strokeWidth={1} strokeDasharray="3 3" dot={false} name="P25" />
                  <Area type="monotone" dataKey="p10" stroke={c.negative} fill="transparent" strokeWidth={1} dot={false} name="P10" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card>
            <Label s={{ marginBottom: 8 }}>How to read</Label>
            <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.6 }}>
              The corridor shows your total portfolio value in EUR across probability bands. The P50 median follows BTC's power-law regression. The corridor <span style={{ color: c.accent }}>narrows over time</span> as BTC matures — uncertainty compresses with age.
            </div>
            {[
              ["P90", "Bull case — top 10% of outcomes", c.positive],
              ["P50", "Median — most likely path", c.accent],
              ["P10", "Floor case — bottom 10%", c.negative],
            ].map(([label, desc, col]) => (
              <div key={label as string} style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "baseline" }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: col as string, fontFamily: f.mono, minWidth: 28 }}>{label}</span>
                <span style={{ fontSize: 10, color: c.mute }}>{desc}</span>
              </div>
            ))}
          </Card>
        </>
      )}

      {/* ═══════════ MONTE CARLO ═══════════ */}
      {tab === "monte" && (
        <>
          <Card s={{ marginBottom: 12, padding: "16px 8px 8px" }}>
            <Label s={{ marginBottom: 8, paddingLeft: 8 }}>BTC price distribution · {mc.nPaths.toLocaleString()} paths</Label>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <AreaChart data={mcChartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="mcGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={c.accent} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={c.accent} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" tick={{ fontSize: 9, fill: c.mute }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 9, fill: c.mute }} tickFormatter={(v: number) => fmtUsdCompact(v)} tickLine={false} axisLine={false} width={48} />
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => fmtUsdCompact(v)} labelStyle={{ color: c.sub, fontSize: 10 }} />
                  <ReferenceLine y={BTC_PRICE} stroke={c.mute} strokeDasharray="3 3" />
                  <Area type="monotone" dataKey="p90" stroke={c.positive} fill="transparent" strokeWidth={1} dot={false} name="P90" />
                  <Area type="monotone" dataKey="p75" stroke={c.positive + "66"} fill="transparent" strokeWidth={1} strokeDasharray="3 3" dot={false} name="P75" />
                  <Area type="monotone" dataKey="p50" stroke={c.accent} fill="url(#mcGrad)" strokeWidth={2} dot={false} name="Median" />
                  <Area type="monotone" dataKey="p25" stroke={c.negative + "66"} fill="transparent" strokeWidth={1} strokeDasharray="3 3" dot={false} name="P25" />
                  <Area type="monotone" dataKey="p10" stroke={c.negative} fill="transparent" strokeWidth={1} dot={false} name="P10" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card s={{ marginBottom: 12 }}>
            <Label s={{ marginBottom: 10 }}>Terminal price distribution</Label>
            {[
              { label: "P95 (extreme bull)", value: mc.p95, col: c.positive },
              { label: "P90", value: mc.p90, col: c.positive },
              { label: "P75", value: mc.p75, col: c.positive },
              { label: "P50 (median)", value: mc.p50, col: c.accent },
              { label: "P25", value: mc.p25, col: c.negative },
              { label: "P10", value: mc.p10, col: c.negative },
              { label: "P5 (extreme bear)", value: mc.p5, col: c.negative },
            ].map(({ label, value, col }) => (
              <Row key={label} label={label} value={fmtUsdCompact(value)} color={col} accent={label.includes("P50")} />
            ))}
          </Card>

          <Card>
            <Label s={{ marginBottom: 10 }}>Risk metrics</Label>
            <Row label="P(below entry)" value={`${(mc.pBelowEntry * 100).toFixed(1)}%`} color={mc.pBelowEntry > 0.3 ? c.negative : c.positive} />
            <Row label="VaR 5%" value={fmtUsdCompact(mc.var5)} color={c.negative} />
            <Row label="CVaR 5%" value={fmtUsdCompact(mc.cvar5)} color={c.negative} />
            <Row label="Median max drawdown" value={`-${(mc.medianMaxDD * 100).toFixed(0)}%`} color={c.negative} />
            <Row label="P90 max drawdown" value={`-${(mc.p90MaxDD * 100).toFixed(0)}%`} color={c.negative} />
            <div style={{ fontSize: 10, color: c.mute, marginTop: 8, lineHeight: 1.5 }}>
              Regime-switching model with Student-t(4) noise. Cycle-phase aware: consolidation → bull → crash → stabilise. Structural floor at $45K growing 10%/yr.
            </div>
          </Card>
        </>
      )}

      {/* ═══════════ ACCUMULATE / DCA ═══════════ */}
      {tab === "accumulate" && (
        <>
          <Card s={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <Label>Monthly DCA</Label>
              <span style={{ fontSize: 10, color: c.accent, fontFamily: f.mono }}>€{monthlyDca}/mo</span>
            </div>
            <input type="range" min={0} max={2000} step={50} value={monthlyDca}
              onChange={e => setMonthlyDca(Number(e.target.value))}
              style={{ width: "100%", accentColor: c.accent, marginBottom: 12, height: 2 }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {[0, 200, 500, 1000, 2000].map(v => (
                <button key={v} onClick={() => setMonthlyDca(v)} style={{
                  fontSize: 10, color: monthlyDca === v ? c.accent : c.mute,
                  background: "none", border: "none", cursor: "pointer", fontFamily: f.mono,
                }}>{v === 0 ? "None" : `€${v}`}</button>
              ))}
            </div>
          </Card>

          <Card s={{ marginBottom: 12, padding: "16px 8px 8px" }}>
            <Label s={{ marginBottom: 8, paddingLeft: 8 }}>Stack growth · €{monthlyDca}/mo DCA</Label>
            <div style={{ width: "100%", height: 200 }}>
              <ResponsiveContainer>
                <AreaChart data={corridorChartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="dcaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={c.accent} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={c.accent} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" tick={{ fontSize: 9, fill: c.mute }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 9, fill: c.mute }} tickFormatter={(v: number) => fmtCompact(v)} tickLine={false} axisLine={false} width={48} />
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => fmtCompact(v)} />
                  <Area type="monotone" dataKey="p50" stroke={c.accent} fill="url(#dcaGrad)" strokeWidth={2} dot={false} name="Median" />
                  <Area type="monotone" dataKey="p10" stroke={c.negative} fill="transparent" strokeWidth={1} dot={false} name="P10" />
                  <Area type="monotone" dataKey="p90" stroke={c.positive} fill="transparent" strokeWidth={1} dot={false} name="P90" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card s={{ marginBottom: 12 }}>
            <Label s={{ marginBottom: 10 }}>{horizon}yr projection</Label>
            <Row label="Starting BTC" value={`${vaultBal.toFixed(4)} BTC`} />
            <Row label="Total DCA invested" value={fmtCompact(dcaProjection.totalInvestedEur)} />
            <Row label="BTC accumulated via DCA" value={`+${dcaProjection.btcAccumulated.toFixed(4)} BTC`} color={c.positive} accent />
            <Row label="Total BTC" value={`${dcaProjection.totalBtc.toFixed(4)} BTC`} color={c.accent} accent />
            <div style={{ height: 1, background: c.borderSubtle, margin: "8px 0" }} />
            <Row label="Portfolio P10" value={fmtCompact(dcaProjection.valueP10)} color={c.negative} />
            <Row label="Portfolio P50" value={fmtCompact(dcaProjection.valueP50)} color={c.accent} accent />
            <Row label="Portfolio P90" value={fmtCompact(dcaProjection.valueP90)} color={c.positive} />
            <Row label="Median multiple" value={`${dcaProjection.multiple.toFixed(1)}×`} color={c.accent} accent />
          </Card>

          <Card glow={c.accentSoft}>
            <div style={{ fontSize: 11, color: c.accent, fontWeight: 600, marginBottom: 4 }}>Stack sats, then borrow</div>
            <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.6 }}>
              Every sat you DCA today is future collateral. At 30% LTV, each €1 of BTC unlocks €0.30 of spending power — without selling, without tax events. Your pension is a vault.
            </div>
          </Card>
        </>
      )}

      {/* ═══════════ FI / PENSION ═══════════ */}
      {tab === "fi" && (
        <>
          <Card s={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <Label>Monthly income target</Label>
              <span style={{ fontSize: 10, color: c.accent, fontFamily: f.mono }}>€{fiTarget.toLocaleString()}/mo</span>
            </div>
            <input type="range" min={1000} max={10000} step={500} value={fiTarget}
              onChange={e => setFiTarget(Number(e.target.value))}
              style={{ width: "100%", accentColor: c.accent, marginBottom: 12, height: 2 }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {[1000, 2000, 3000, 5000, 10000].map(v => (
                <button key={v} onClick={() => setFiTarget(v)} style={{
                  fontSize: 10, color: fiTarget === v ? c.accent : c.mute,
                  background: "none", border: "none", cursor: "pointer", fontFamily: f.mono,
                }}>{v >= 1000 ? `€${v / 1000}K` : `€${v}`}</button>
              ))}
            </div>
          </Card>

          <Card s={{ marginBottom: 12 }}>
            <Label s={{ marginBottom: 10 }}>Financial independence · {horizon}yr horizon</Label>
            <div style={{ fontSize: 10, color: c.mute, marginBottom: 12, lineHeight: 1.5 }}>
              At 4% safe withdrawal rate, €{fiTarget.toLocaleString()}/mo requires a portfolio of {fmtCompact(fiCalc.portfolioNeeded)}.
            </div>
            <div style={{ height: 1, background: c.borderSubtle, marginBottom: 8 }} />
            <Label s={{ marginBottom: 8, fontSize: 9 }}>BTC needed at {horizon}yr prices</Label>
            {fiCalc.scenarios.map(s => {
              const have = vaultBal >= s.btcNeeded;
              return (
                <div key={s.label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "6px 0", borderBottom: `1px solid ${c.borderSubtle}`,
                }}>
                  <div>
                    <span style={{ fontSize: 11, color: c.sub }}>{s.label}</span>
                    <span style={{ fontSize: 10, color: c.mute, marginLeft: 8, fontFamily: f.mono }}>
                      @ {fmtUsdCompact(s.price)}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: have ? c.positive : c.text, fontFamily: f.mono }}>
                      {s.btcNeeded.toFixed(4)} BTC
                    </span>
                    {have && <Badge text="✓" color={c.positive} />}
                  </div>
                </div>
              );
            })}
          </Card>

          <Card s={{ marginBottom: 12 }}>
            <Label s={{ marginBottom: 10 }}>Your path to FI</Label>
            <Row label="Current stack" value={`${vaultBal.toFixed(4)} BTC`} color={c.accent} accent />
            <Row label="Need at P50" value={`${fiCalc.scenarios[2].btcNeeded.toFixed(4)} BTC`} />
            <Row label="Gap" value={
              vaultBal >= fiCalc.scenarios[2].btcNeeded
                ? "You're there!"
                : `${(fiCalc.scenarios[2].btcNeeded - vaultBal).toFixed(4)} BTC`
            } color={vaultBal >= fiCalc.scenarios[2].btcNeeded ? c.positive : c.accent} accent />
            {vaultBal < fiCalc.scenarios[2].btcNeeded && (
              <>
                <div style={{ height: 1, background: c.borderSubtle, margin: "8px 0" }} />
                <Row label="DCA to close gap" value={
                  (() => {
                    const gap = fiCalc.scenarios[2].btcNeeded - vaultBal;
                    const monthlyBtc = monthlyDca / (BTC_PRICE / EUR_RATE);
                    if (monthlyBtc <= 0) return "Set DCA in Stack tab";
                    const months = Math.ceil(gap / monthlyBtc);
                    return months > 600 ? "Increase DCA" : `~${Math.ceil(months / 12)}yr at €${monthlyDca}/mo`;
                  })()
                } color={c.info} />
              </>
            )}
          </Card>

          <Card glow={c.accentSoft}>
            <div style={{ fontSize: 11, color: c.accent, fontWeight: 600, marginBottom: 4 }}>Bitcoin pension strategy</div>
            <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.6 }}>
              Accumulate BTC. At FI, borrow against it at 30% LTV for living expenses — never sell, never trigger capital gains.
              Repay each loan from the next cycle's appreciation. Your stack stays intact. Your pension is self-custodial.
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
