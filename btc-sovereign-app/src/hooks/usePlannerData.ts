import { useMemo } from "react";
import { BTC_PRICE, EUR_RATE, SAFE_WITHDRAWAL_RATE } from "../lib/constants";
import { fmtCompact, fmtUsdCompact } from "../lib/formatters";
import { runMonteCarlo, CYCLE_2026_5YR, CYCLE_2026_10YR } from "../models/monteCarlo";
import { computeBagCorridorPoints, buildHorizonTable } from "../models/powerLaw";

/** Lifestyle presets for monthly spending estimation */
export interface LifestyleItem {
  id: string;
  label: string;
  hint: string;
  amount: number;
}

export const LIFESTYLE_PRESETS: LifestyleItem[] = [
  { id: "housing-rent", label: "Rent / Mortgage", hint: "Monthly housing payment", amount: 800 },
  { id: "housing-own", label: "Own outright", hint: "No mortgage payment", amount: 150 },
  { id: "groceries", label: "Groceries & household", hint: "Food, cleaning, basics", amount: 500 },
  { id: "transport", label: "Car / Transport", hint: "Fuel, insurance, public transit", amount: 300 },
  { id: "utilities", label: "Utilities & internet", hint: "Electric, water, phone, wifi", amount: 200 },
  { id: "insurance", label: "Health / insurance", hint: "Private health, life insurance", amount: 200 },
  { id: "kids-school", label: "Children (school-age)", hint: "Per child: activities, clothes", amount: 400 },
  { id: "kids-nursery", label: "Nursery / Kindergarten", hint: "Per child: childcare costs", amount: 600 },
  { id: "leisure", label: "Leisure & dining", hint: "Restaurants, hobbies, subscriptions", amount: 300 },
  { id: "travel", label: "Holidays & travel", hint: "Amortized over the year", amount: 250 },
  { id: "savings", label: "Buffer / unexpected", hint: "Emergency cushion", amount: 200 },
];

export interface PlannerInputs {
  vaultBal: number;
  horizon: 5 | 10;
  monthlyDca: number;
  fiTarget: number;
  includeDcaInCorridor: boolean;
}

export function usePlannerData({
  vaultBal,
  horizon,
  monthlyDca,
  fiTarget,
  includeDcaInCorridor,
}: PlannerInputs) {
  /** Corridor model — portfolio value bands over time */
  const corridorPoints = useMemo(
    () =>
      computeBagCorridorPoints({
        startPriceUsd: BTC_PRICE,
        totalBtc: vaultBal,
        nMonths: horizon * 12,
        monthlyDcaEur: includeDcaInCorridor ? monthlyDca : 0,
      }),
    [vaultBal, horizon, monthlyDca, includeDcaInCorridor],
  );

  /** Full 10-year corridor for the horizon table */
  const horizonTable = useMemo(() => {
    const full = computeBagCorridorPoints({
      startPriceUsd: BTC_PRICE,
      totalBtc: vaultBal,
      nMonths: 120,
    });
    return buildHorizonTable(full);
  }, [vaultBal]);

  /** Monte Carlo simulation */
  const mc = useMemo(
    () =>
      runMonteCarlo({
        startPriceUsd: BTC_PRICE,
        nPaths: 10000,
        nMonths: horizon * 12,
        cyclePhases: horizon === 5 ? CYCLE_2026_5YR : CYCLE_2026_10YR,
        collectMonthly: true,
      }),
    [horizon],
  );

  /** Chart-ready corridor data (downsampled) */
  const corridorChartData = useMemo(
    () =>
      corridorPoints
        .filter((_, i) => i % 3 === 0 || i === corridorPoints.length - 1)
        .map((p) => ({
          year: p.year.toFixed(1),
          p10: Math.round(p.p10),
          p25: Math.round(p.p25),
          p50: Math.round(p.p50),
          p75: Math.round(p.p75),
          p90: Math.round(p.p90),
        })),
    [corridorPoints],
  );

  /** Chart-ready MC data (downsampled) */
  const mcChartData = useMemo(
    () =>
      mc.monthlyPaths
        ? mc.monthlyPaths
            .filter((_, i) => i % 3 === 0 || i === (mc.monthlyPaths?.length ?? 1) - 1)
            .map((p) => ({
              month: p.month,
              year: (2026 + p.month / 12).toFixed(1),
              p10: Math.round(p.p10),
              p25: Math.round(p.p25),
              p50: Math.round(p.p50),
              p75: Math.round(p.p75),
              p90: Math.round(p.p90),
            }))
        : [],
    [mc],
  );

  /** DCA accumulation projection */
  const dcaProjection = useMemo(() => {
    const months = horizon * 12;
    const totalInvested = monthlyDca * months;
    const dcaCorridor = computeBagCorridorPoints({
      startPriceUsd: BTC_PRICE,
      totalBtc: vaultBal,
      nMonths: months,
      monthlyDcaEur: monthlyDca,
    });
    const endPoint = dcaCorridor[dcaCorridor.length - 1];
    const medianPriceEur = endPoint.p50 / endPoint.btcStack;
    const medianPriceUsd = medianPriceEur * (1 / EUR_RATE);
    return {
      totalInvestedEur: totalInvested,
      btcAccumulated: endPoint.btcStack - vaultBal,
      totalBtc: endPoint.btcStack,
      valueP50: endPoint.p50,
      valueP10: endPoint.p10,
      valueP90: endPoint.p90,
      multiple: totalInvested > 0 ? endPoint.p50 / (vaultBal * BTC_PRICE * EUR_RATE + totalInvested) : 0,
      assumedPriceEur: Math.round(medianPriceEur),
      assumedPriceUsd: Math.round(medianPriceUsd),
      chartData: dcaCorridor
        .filter((_, i) => i % 3 === 0 || i === dcaCorridor.length - 1)
        .map((p) => ({
          year: p.year.toFixed(1),
          p10: Math.round(p.p10),
          p50: Math.round(p.p50),
          p90: Math.round(p.p90),
        })),
    };
  }, [monthlyDca, horizon, vaultBal]);

  /** Financial independence calculations */
  const fiCalc = useMemo(() => {
    const annualNeed = fiTarget * 12;
    const portfolioNeeded = annualNeed / SAFE_WITHDRAWAL_RATE;
    const portfolioNeededUsd = portfolioNeeded / EUR_RATE;

    // Use MC end-of-horizon BTC prices
    const scenarios = [
      {
        label: "Conservative",
        price: mc.p25,
        priceLabel: fmtUsdCompact(mc.p25),
        btcNeeded: portfolioNeededUsd / mc.p25,
      },
      {
        label: "Likely",
        price: mc.p50,
        priceLabel: fmtUsdCompact(mc.p50),
        btcNeeded: portfolioNeededUsd / mc.p50,
      },
      {
        label: "Optimistic",
        price: mc.p75,
        priceLabel: fmtUsdCompact(mc.p75),
        btcNeeded: portfolioNeededUsd / mc.p75,
      },
    ];

    // Years to reach goal via DCA (at median BTC price path)
    let yearsToGoal: number | null = null;
    if (monthlyDca > 0 && vaultBal < scenarios[1].btcNeeded) {
      const gap = scenarios[1].btcNeeded - vaultBal;
      const monthlyBtcAtCurrent = monthlyDca / (BTC_PRICE * EUR_RATE);
      yearsToGoal = Math.ceil(gap / monthlyBtcAtCurrent / 12);
    }

    return { annualNeed, portfolioNeeded, portfolioNeededUsd, scenarios, yearsToGoal };
  }, [fiTarget, mc, monthlyDca, vaultBal]);

  /** Derived overview numbers */
  const currentValueEur = vaultBal * BTC_PRICE * EUR_RATE;
  const endPoint = corridorPoints[corridorPoints.length - 1];
  const p50End = endPoint?.p50 ?? 0;
  const p10End = endPoint?.p10 ?? 0;
  const p90End = endPoint?.p90 ?? 0;

  return {
    corridorPoints,
    corridorChartData,
    horizonTable,
    mc,
    mcChartData,
    dcaProjection,
    fiCalc,
    currentValueEur,
    p50End,
    p10End,
    p90End,
  };
}
