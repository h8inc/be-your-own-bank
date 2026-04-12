import { useMemo } from "react";
import { ASSETS, EUR_RATE, SAFE_WITHDRAWAL_RATE, portfolioValueUsd, portfolioValueEur } from "../lib/constants";
import type { Holding } from "../lib/constants";
import { fmtUsdCompact } from "../lib/formatters";
import { runMonteCarlo, runPortfolioMonteCarlo, CYCLE_2026_5YR, CYCLE_2026_10YR } from "../models/monteCarlo";
import type { PortfolioAssetConfig } from "../models/monteCarlo";
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
  holdings: Holding[];
  horizon: 5 | 10;
  monthlyDcaEur: number;
  fiTarget: number;
  includeDcaInCorridor: boolean;
}

export function usePlannerData({
  holdings,
  horizon,
  monthlyDcaEur,
  fiTarget,
  includeDcaInCorridor,
}: PlannerInputs) {
  // Extract BTC holdings for power-law corridor
  const btcHolding = holdings.find((h) => h.assetId === "BTC");
  const btcAmount = btcHolding?.amount ?? 0;
  const btcPrice = ASSETS.BTC.priceUsd;

  /** Corridor model — BTC value bands over time */
  const corridorPoints = useMemo(
    () =>
      computeBagCorridorPoints({
        startPriceUsd: btcPrice,
        totalBtc: btcAmount,
        nMonths: horizon * 12,
        monthlyDcaEur: includeDcaInCorridor ? monthlyDcaEur : 0,
      }),
    [btcAmount, btcPrice, horizon, monthlyDcaEur, includeDcaInCorridor],
  );

  /** Full 10-year corridor for the horizon table */
  const horizonTable = useMemo(() => {
    const full = computeBagCorridorPoints({
      startPriceUsd: btcPrice,
      totalBtc: btcAmount,
      nMonths: 120,
    });
    return buildHorizonTable(full);
  }, [btcAmount, btcPrice]);

  /** BTC-specific Monte Carlo simulation (regime-switching) */
  const mcBtc = useMemo(
    () =>
      runMonteCarlo({
        startPriceUsd: btcPrice,
        nPaths: 10000,
        nMonths: horizon * 12,
        cyclePhases: horizon === 5 ? CYCLE_2026_5YR : CYCLE_2026_10YR,
        collectMonthly: true,
      }),
    [btcPrice, horizon],
  );

  /** Portfolio-level Monte Carlo simulation (all assets, GBM) */
  const mcPortfolio = useMemo(() => {
    const portfolioAssets: PortfolioAssetConfig[] = holdings
      .map((h) => {
        const asset = ASSETS[h.assetId];
        if (!asset) return null;
        return {
          assetId: h.assetId,
          startPriceUsd: asset.priceUsd,
          amountHeld: h.amount,
          annualDrift: asset.annualDrift,
          annualVol: asset.annualVol,
        };
      })
      .filter((x) => x !== null) as PortfolioAssetConfig[];

    if (portfolioAssets.length === 0) {
      // Fallback if no holdings
      return mcBtc;
    }

    return runPortfolioMonteCarlo({
      assets: portfolioAssets,
      nPaths: 10000,
      nMonths: horizon * 12,
      collectMonthly: true,
    });
  }, [holdings, horizon, mcBtc]);

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

  /** Chart-ready MC BTC data (downsampled) */
  const mcBtcChartData = useMemo(
    () =>
      mcBtc.monthlyPaths
        ? mcBtc.monthlyPaths
            .filter((_, i) => i % 3 === 0 || i === (mcBtc.monthlyPaths?.length ?? 1) - 1)
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
    [mcBtc],
  );

  /** Chart-ready MC Portfolio data (downsampled) */
  const mcPortfolioChartData = useMemo(
    () =>
      mcPortfolio.monthlyPaths
        ? mcPortfolio.monthlyPaths
            .filter((_, i) => i % 3 === 0 || i === (mcPortfolio.monthlyPaths?.length ?? 1) - 1)
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
    [mcPortfolio],
  );

  /** DCA accumulation projection (BTC-focused DCA) */
  const dcaProjection = useMemo(() => {
    const months = horizon * 12;
    const totalInvestedEur = monthlyDcaEur * months;
    const dcaCorridor = computeBagCorridorPoints({
      startPriceUsd: btcPrice,
      totalBtc: btcAmount,
      nMonths: months,
      monthlyDcaEur: monthlyDcaEur,
    });
    const endPoint = dcaCorridor[dcaCorridor.length - 1];
    const medianPriceEur = endPoint.p50 / endPoint.btcStack;
    const medianPriceUsd = medianPriceEur * (1 / EUR_RATE);
    const initialPortfolioValueEur = portfolioValueEur(holdings);
    return {
      totalInvestedEur,
      btcAccumulated: endPoint.btcStack - btcAmount,
      totalBtc: endPoint.btcStack,
      valueP50: endPoint.p50,
      valueP10: endPoint.p10,
      valueP90: endPoint.p90,
      multiple: totalInvestedEur > 0 ? endPoint.p50 / (initialPortfolioValueEur + totalInvestedEur) : 0,
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
  }, [monthlyDcaEur, horizon, btcAmount, btcPrice, holdings]);

  /** Financial independence calculations */
  const fiCalc = useMemo(() => {
    const annualNeed = fiTarget * 12;
    const portfolioNeededEur = annualNeed / SAFE_WITHDRAWAL_RATE;
    const portfolioNeededUsd = portfolioNeededEur / EUR_RATE;

    // Use MC portfolio end-of-horizon values
    const scenarios = [
      {
        label: "Conservative",
        value: mcPortfolio.p25,
        valueLabel: fmtUsdCompact(mcPortfolio.p25),
        shortfall: Math.max(0, portfolioNeededUsd - mcPortfolio.p25),
      },
      {
        label: "Likely",
        value: mcPortfolio.p50,
        valueLabel: fmtUsdCompact(mcPortfolio.p50),
        shortfall: Math.max(0, portfolioNeededUsd - mcPortfolio.p50),
      },
      {
        label: "Optimistic",
        value: mcPortfolio.p75,
        valueLabel: fmtUsdCompact(mcPortfolio.p75),
        shortfall: Math.max(0, portfolioNeededUsd - mcPortfolio.p75),
      },
    ];

    // Years to reach FI goal via DCA (at median portfolio path)
    let yearsToGoal: number | null = null;
    const currentPortfolioValueEur = portfolioValueEur(holdings);
    if (monthlyDcaEur > 0 && currentPortfolioValueEur < portfolioNeededEur) {
      const gap = portfolioNeededEur - currentPortfolioValueEur;
      const monthlyContribution = monthlyDcaEur;
      yearsToGoal = Math.ceil(gap / monthlyContribution / 12);
    }

    return { annualNeed, portfolioNeededEur, portfolioNeededUsd, scenarios, yearsToGoal };
  }, [fiTarget, mcPortfolio, monthlyDcaEur, holdings]);

  /** Derived overview numbers — portfolio level */
  const currentPortfolioValueEur = portfolioValueEur(holdings);
  const currentPortfolioValueUsd = portfolioValueUsd(holdings);

  // BTC corridor endpoints (power-law)
  const btcCorridorEndpoint = corridorPoints[corridorPoints.length - 1];
  const btcP50End = btcCorridorEndpoint?.p50 ?? 0;
  const btcP10End = btcCorridorEndpoint?.p10 ?? 0;
  const btcP90End = btcCorridorEndpoint?.p90 ?? 0;

  return {
    // BTC-specific (power-law corridor)
    corridorPoints,
    corridorChartData,
    horizonTable,
    mcBtc,
    mcBtcChartData,
    btcP50End,
    btcP10End,
    btcP90End,

    // Portfolio-level (multi-asset)
    mcPortfolio,
    mcPortfolioChartData,
    currentPortfolioValueEur,
    currentPortfolioValueUsd,

    // Shared
    dcaProjection,
    fiCalc,
  };
}
