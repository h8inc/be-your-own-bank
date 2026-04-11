/**
 * Power-law corridor model for BTC price projections.
 * Median price path: monthly log drift plExponent / (PL_REF_AGE + m)
 * Corridor σ compresses with BTC age: σ(m) = σ₀ × (t₀ / t)^β
 */

/** BTC genesis: Jan 2009. Months since genesis to Mar 2026 */
export const PL_REF_AGE = (2026 - 2009) * 12 + 2; // ~206 months

export const EUR_USD_DEFAULT = 1.08;

const Z = {
  p10: -1.282,
  p25: -0.674,
  p50: 0,
  p75: 0.674,
  p90: 1.282,
};

/** Default power-law exponent (log drift per month at PL_REF_AGE) */
export const PL_EXPONENT_DEFAULT = 5.83;  // Santostasi-calibrated
/** Default log-sigma at t=0 simulation start */
export const PL_SIGMA0_DEFAULT = 0.85;
/** How fast σ compresses with age */
export const PL_CORRIDOR_AGE_BETA_DEFAULT = 0.6;

export function sigmaCorridorAtSimMonth(plSigma0: number, m: number, corridorAgeBeta: number): number {
  const t0 = PL_REF_AGE;
  const t = PL_REF_AGE + m;
  return plSigma0 * Math.pow(t0 / t, corridorAgeBeta);
}

export interface CorridorPoint {
  month: number;
  year: number;
  p10: number; p25: number; p50: number; p75: number; p90: number;
  btcStack: number;
}

export interface CorridorOptions {
  startPriceUsd: number;
  totalBtc: number;
  plExponent?: number;
  plSigma0?: number;
  plCorridorAgeBeta?: number;
  nMonths?: number;
  eurUsd?: number;
  /** Monthly DCA amount in EUR to add to stack */
  monthlyDcaEur?: number;
}

export function computeBagCorridorPoints({
  startPriceUsd,
  totalBtc,
  plExponent = PL_EXPONENT_DEFAULT,
  plSigma0 = PL_SIGMA0_DEFAULT,
  plCorridorAgeBeta = PL_CORRIDOR_AGE_BETA_DEFAULT,
  nMonths = 120,
  eurUsd = EUR_USD_DEFAULT,
  monthlyDcaEur = 0,
}: CorridorOptions): CorridorPoint[] {
  const points: CorridorPoint[] = [];
  let cumLogReturn = 0;
  let stack = totalBtc;

  for (let m = 0; m <= nMonths; m++) {
    // DCA: buy BTC each month at the median projected price
    if (m > 0 && monthlyDcaEur > 0) {
      const medianPriceEur = (startPriceUsd * Math.exp(cumLogReturn)) / eurUsd;
      if (medianPriceEur > 0) {
        stack += monthlyDcaEur / medianPriceEur;
      }
    }

    const priceEurMedian = (startPriceUsd * Math.exp(cumLogReturn)) / eurUsd;
    const bandLogStd = sigmaCorridorAtSimMonth(plSigma0, m, plCorridorAgeBeta);

    points.push({
      month: m,
      year: 2026 + m / 12,
      p10: priceEurMedian * Math.exp(Z.p10 * bandLogStd) * stack,
      p25: priceEurMedian * Math.exp(Z.p25 * bandLogStd) * stack,
      p50: priceEurMedian * stack,
      p75: priceEurMedian * Math.exp(Z.p75 * bandLogStd) * stack,
      p90: priceEurMedian * Math.exp(Z.p90 * bandLogStd) * stack,
      btcStack: stack,
    });

    if (m < nMonths) {
      const absAge = PL_REF_AGE + m;
      cumLogReturn += plExponent / absAge;
    }
  }

  return points;
}

export interface HorizonRow {
  key: string;
  horizon: string;
  sub: string;
  m: number;
  fair: number;
  floor: number;
  ceiling: number;
  growthPct: number | string;
  sigma: number;
}

export function buildHorizonTable(
  points: CorridorPoint[],
  plSigma0: number = PL_SIGMA0_DEFAULT,
  plCorridorAgeBeta: number = PL_CORRIDOR_AGE_BETA_DEFAULT,
) {
  if (!points?.length) return { rows: [] as HorizonRow[], logWidthCompressionPct: null as number | null };

  const p0 = points[0];
  const p60 = points[60];
  const p120 = points[120];

  const logW0 = Math.log(Math.max(p0.p90 / p0.p10, 1e-12));
  const logW120 = p120 ? Math.log(Math.max(p120.p90 / p120.p10, 1e-12)) : null;
  const logWidthCompressionPct =
    logW120 != null && logW0 > 0 ? (1 - logW120 / logW0) * 100 : null;

  const fmtGrowth = (m: number): number | string => {
    if (m === 0) {
      const p12 = points[12];
      if (!p12 || p0.p50 <= 0) return "—";
      return (p12.p50 / p0.p50 - 1) * 100;
    }
    const end = points[m];
    if (!end || p0.p50 <= 0) return "—";
    const years = m / 12;
    return (Math.pow(end.p50 / p0.p50, 1 / years) - 1) * 100;
  };

  const rows: HorizonRow[] = [
    {
      key: "now", horizon: "Now", sub: "Apr 2026", m: 0,
      fair: p0.p50, floor: p0.p10, ceiling: p0.p90,
      growthPct: fmtGrowth(0),
      sigma: sigmaCorridorAtSimMonth(plSigma0, 0, plCorridorAgeBeta),
    },
    {
      key: "5y", horizon: "5yr", sub: "(2031)", m: 60,
      fair: p60?.p50 ?? 0, floor: p60?.p10 ?? 0, ceiling: p60?.p90 ?? 0,
      growthPct: fmtGrowth(60),
      sigma: sigmaCorridorAtSimMonth(plSigma0, 60, plCorridorAgeBeta),
    },
    {
      key: "10y", horizon: "10yr", sub: "(2036)", m: 120,
      fair: p120?.p50 ?? 0, floor: p120?.p10 ?? 0, ceiling: p120?.p90 ?? 0,
      growthPct: fmtGrowth(120),
      sigma: sigmaCorridorAtSimMonth(plSigma0, 120, plCorridorAgeBeta),
    },
  ];

  return { rows, logWidthCompressionPct };
}
