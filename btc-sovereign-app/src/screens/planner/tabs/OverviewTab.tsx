import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { c, f } from "../../../lib/theme";
import { fmtCompact, fmtUsdCompact, fmtPct } from "../../../lib/formatters";
import { Card, Expandable } from "../../../components/ui";
import type { usePlannerData } from "../../../hooks/usePlannerData";

interface Props {
  vaultBal: number;
  horizon: 5 | 10;
  data: ReturnType<typeof usePlannerData>;
}

const chartTooltipStyle = {
  backgroundColor: c.surface,
  border: `1px solid ${c.border}`,
  borderRadius: 6,
  fontSize: 10,
  fontFamily: f.mono,
};

export const OverviewTab: React.FC<Props> = ({ horizon, data }) => {
  const {
    corridorChartData,
    currentPortfolioValueEur,
    btcP50End, btcP10End, btcP90End,
    mcPortfolioChartData,
    mcBtc,
    horizonTable,
  } = data;

  // Use portfolio MC for the headline if we have multi-asset data
  const hasPortfolioChart = mcPortfolioChartData.length > 0;
  const chartData = hasPortfolioChart ? mcPortfolioChartData : corridorChartData;

  return (
    <>
      {/* Hero chart — the first thing you see */}
      <Card s={{ marginBottom: 12, padding: "16px 8px 8px" }}>
        <div style={{ paddingLeft: 8, marginBottom: 4 }}>
          <div style={{ fontSize: 11, color: c.mute, marginBottom: 2 }}>Where your portfolio might be</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 22, fontWeight: 300, color: c.accent, fontFamily: f.mono }}>{fmtUsdCompact(btcP50End)}</span>
            <span style={{ fontSize: 11, color: c.mute }}>median in {horizon} years</span>
          </div>
        </div>
        <div style={{ width: "100%", height: 180, minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="overviewGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={c.accent} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={c.accent} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="overviewBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={c.positive} stopOpacity={0.08} />
                  <stop offset="95%" stopColor={c.positive} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" tick={{ fontSize: 9, fill: c.mute }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 9, fill: c.mute }} tickFormatter={(v) => fmtCompact(v as number)} tickLine={false} axisLine={false} width={48} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => fmtCompact(v as number)} labelStyle={{ color: c.sub, fontSize: 10 }} />
              <Area type="monotone" dataKey="p90" stroke="transparent" fill="url(#overviewBand)" strokeWidth={0} dot={false} />
              <Area type="monotone" dataKey="p50" stroke={c.accent} fill="url(#overviewGrad)" strokeWidth={2} dot={false} name="Median" />
              <Area type="monotone" dataKey="p10" stroke={c.negative + "44"} fill="transparent" strokeWidth={1} strokeDasharray="4 4" dot={false} name="Conservative" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div style={{ display: "flex", gap: 16, paddingLeft: 8, paddingTop: 6 }}>
          {[
            { color: c.accent, label: "Median path" },
            { color: c.positive + "44", label: "Upside range" },
            { color: c.negative + "66", label: "Conservative" },
          ].map((l) => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 10, height: 2, background: l.color, borderRadius: 1 }} />
              <span style={{ fontSize: 9, color: c.mute }}>{l.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Three range outcomes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
        {[
          { label: "Conservative", value: fmtUsdCompact(btcP10End), col: c.sub },
          { label: "Median", value: fmtUsdCompact(btcP50End), col: c.accent },
          { label: "Optimistic", value: fmtUsdCompact(btcP90End), col: c.positive },
        ].map(({ label, value, col }) => (
          <Card key={label} s={{ padding: 12, textAlign: "center" as const }}>
            <div style={{ fontSize: 9, color: c.mute, marginBottom: 4, letterSpacing: "0.05em", textTransform: "uppercase" as const }}>{label}</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: col, fontFamily: f.mono }}>{value}</div>
          </Card>
        ))}
      </div>

      {/* Current position */}
      <Card s={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div>
            <div style={{ fontSize: 10, color: c.mute, marginBottom: 4 }}>Portfolio value</div>
            <div style={{ fontSize: 20, fontWeight: 400, color: c.text, fontFamily: f.mono }}>
              {fmtCompact(currentPortfolioValueEur)}
            </div>
          </div>
          <div style={{ textAlign: "right" as const }}>
            <div style={{ fontSize: 10, color: c.mute, marginBottom: 4 }}>Today</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: c.sub, fontFamily: f.mono }}>EUR</div>
          </div>
        </div>
      </Card>

      {/* Insight card — humble, no crystal ball */}
      <Card glow={c.accentSoft} s={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: c.text, lineHeight: 1.6, fontFamily: f.sans }}>
          Based on historical models, your portfolio <em>could</em> be worth around{" "}
          <span style={{ color: c.accent, fontWeight: 600 }}>{fmtUsdCompact(btcP50End)}</span> in {horizon} years.
          That's the median — half of simulated outcomes land above, half below.{" "}
          <span style={{ color: c.mute }}>Nobody knows the future.</span>
        </div>
      </Card>

      {/* Progressive detail */}
      <Expandable title="BTC horizon breakdown (Now / 5yr / 10yr)">
        {horizonTable.rows.map((row) => (
          <div key={row.key} style={{ marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${c.borderSubtle}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: c.text }}>{row.horizon}</span>
              <span style={{ fontSize: 10, color: c.mute }}>{row.sub}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
              {[
                { label: "Floor", value: row.floor, col: c.negative },
                { label: "Fair", value: row.fair, col: c.accent },
                { label: "Ceiling", value: row.ceiling, col: c.positive },
              ].map(({ label, value, col }) => (
                <div key={label}>
                  <div style={{ fontSize: 9, color: c.mute, marginBottom: 1 }}>{label}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: col, fontFamily: f.mono }}>{fmtCompact(value)}</div>
                </div>
              ))}
            </div>
            {typeof row.growthPct === "number" && (
              <div style={{ fontSize: 9, color: c.mute, marginTop: 3, fontFamily: f.mono }}>{fmtPct(row.growthPct)} CAGR</div>
            )}
          </div>
        ))}
      </Expandable>

      <Expandable title="Monte Carlo risk analysis">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
          {[
            { label: "Median BTC price", value: fmtUsdCompact(mcBtc.p50), col: c.accent },
            { label: "Upside (P90)", value: fmtUsdCompact(mcBtc.p90), col: c.positive },
            { label: "Downside (P10)", value: fmtUsdCompact(mcBtc.p10), col: c.negative },
            { label: "Max drawdown", value: `-${(mcBtc.medianMaxDD * 100).toFixed(0)}%`, col: c.negative },
          ].map(({ label, value, col }) => (
            <div key={label} style={{ padding: "6px 0" }}>
              <div style={{ fontSize: 9, color: c.mute, marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: col, fontFamily: f.mono }}>{value}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, color: c.mute, lineHeight: 1.5 }}>
          {mcBtc.nPaths.toLocaleString()} simulated paths · {(mcBtc.pBelowEntry * 100).toFixed(0)}% end below today's price
        </div>
      </Expandable>
    </>
  );
};
