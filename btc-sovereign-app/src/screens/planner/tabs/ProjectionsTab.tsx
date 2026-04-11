import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { c, f } from "../../../lib/theme";
import { BTC_PRICE } from "../../../lib/constants";
import { fmtCompact, fmtUsdCompact } from "../../../lib/formatters";
import { Card, Label, Row, Expandable } from "../../../components/ui";
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

export const ProjectionsTab: React.FC<Props> = ({ vaultBal, horizon, data }) => {
  const { corridorChartData, mcChartData, mc } = data;

  return (
    <>
      {/* Corridor chart */}
      <Card s={{ marginBottom: 12, padding: "16px 8px 8px" }}>
        <Label s={{ marginBottom: 6, paddingLeft: 8 }}>Your portfolio range (EUR)</Label>
        <div style={{ paddingLeft: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: c.mute }}>Where your {vaultBal.toFixed(2)} BTC could be in {horizon} years</span>
        </div>
        <div style={{ width: "100%", height: 200, minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={corridorChartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="gradP90" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={c.positive} stopOpacity={0.12} />
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
              <Area type="monotone" dataKey="p90" stroke={c.positive} fill="url(#gradP90)" strokeWidth={1} dot={false} name="Optimistic" />
              <Area type="monotone" dataKey="p75" stroke={c.positive + "66"} fill="transparent" strokeWidth={1} strokeDasharray="3 3" dot={false} name="P75" />
              <Area type="monotone" dataKey="p50" stroke={c.accent} fill="url(#gradP50)" strokeWidth={2} dot={false} name="Median" />
              <Area type="monotone" dataKey="p25" stroke={c.negative + "66"} fill="transparent" strokeWidth={1} strokeDasharray="3 3" dot={false} name="P25" />
              <Area type="monotone" dataKey="p10" stroke={c.negative} fill="transparent" strokeWidth={1} dot={false} name="Conservative" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* MC chart */}
      <Card s={{ marginBottom: 12, padding: "16px 8px 8px" }}>
        <Label s={{ marginBottom: 6, paddingLeft: 8 }}>BTC price scenarios</Label>
        <div style={{ paddingLeft: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: c.mute }}>{mc.nPaths.toLocaleString()} simulated futures</span>
        </div>
        <div style={{ width: "100%", height: 200, minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
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
              <ReferenceLine y={BTC_PRICE} stroke={c.mute} strokeDasharray="3 3" label={{ value: "Today", fill: c.mute, fontSize: 9, position: "insideTopRight" }} />
              <Area type="monotone" dataKey="p90" stroke={c.positive} fill="transparent" strokeWidth={1} dot={false} name="Optimistic" />
              <Area type="monotone" dataKey="p50" stroke={c.accent} fill="url(#mcGrad)" strokeWidth={2} dot={false} name="Median" />
              <Area type="monotone" dataKey="p10" stroke={c.negative} fill="transparent" strokeWidth={1} dot={false} name="Conservative" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Detail behind expand */}
      <Expandable title="Full price distribution">
        {[
          { label: "P95 — extreme bull", value: mc.p95, col: c.positive },
          { label: "P90 — optimistic", value: mc.p90, col: c.positive },
          { label: "P75", value: mc.p75, col: c.positive },
          { label: "P50 — median", value: mc.p50, col: c.accent },
          { label: "P25", value: mc.p25, col: c.negative },
          { label: "P10 — conservative", value: mc.p10, col: c.negative },
          { label: "P5 — extreme bear", value: mc.p5, col: c.negative },
        ].map(({ label, value, col }) => (
          <Row key={label} label={label} value={fmtUsdCompact(value)} color={col} accent={label.includes("P50")} />
        ))}
      </Expandable>

      <Expandable title="Risk metrics">
        <Row label="Chance of loss" value={`${(mc.pBelowEntry * 100).toFixed(1)}%`} color={mc.pBelowEntry > 0.3 ? c.negative : c.positive} />
        <Row label="VaR 5%" value={fmtUsdCompact(mc.var5)} color={c.negative} />
        <Row label="CVaR 5%" value={fmtUsdCompact(mc.cvar5)} color={c.negative} />
        <Row label="Typical max drawdown" value={`-${(mc.medianMaxDD * 100).toFixed(0)}%`} color={c.negative} />
        <Row label="Worst-case drawdown (P90)" value={`-${(mc.p90MaxDD * 100).toFixed(0)}%`} color={c.negative} />
        <div style={{ fontSize: 10, color: c.mute, marginTop: 8, lineHeight: 1.5 }}>
          Cycle-aware model: consolidation → bull run → correction → recovery. Includes structural price floor.
        </div>
      </Expandable>

      <Card glow={c.infoDim}>
        <div style={{ fontSize: 11, color: c.info, fontWeight: 600, marginBottom: 4 }}>How to read these charts</div>
        <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.6 }}>
          The <span style={{ color: c.accent }}>amber line</span> is the median path — not a prediction. The shaded area shows the range of possibilities. Wider = more uncertainty. The corridor <span style={{ color: c.accent }}>narrows over time</span> — Bitcoin becomes more predictable as it matures.
        </div>
      </Card>
    </>
  );
};
