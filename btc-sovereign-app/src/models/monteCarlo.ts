/**
 * Monte Carlo simulation engine
 *
 * BTC: Regime-switching log-normal returns with Student-t noise,
 *      cycle-phase-aware scheduling, and structural price floor.
 *
 * Multi-asset: GBM (Geometric Brownian Motion) with asset-specific drift/volatility.
 */

export const DEFAULT_REGIMES = {
  crash:    { label: "Crash",    mu: -0.45, sigma: 0.45, color: "#dc2626" },
  bear:     { label: "Bear",     mu: -0.12, sigma: 0.35, color: "#ef4444" },
  sideways: { label: "Sideways", mu:  0.08, sigma: 0.35, color: "#94a3b8" },
  bull:     { label: "Bull",     mu:  0.80, sigma: 0.55, color: "#14f195" },
} as const;

export const DEFAULT_TRANSITION: Record<string, Record<string, number>> = {
  crash:    { crash: 0.45, bear: 0.35, sideways: 0.18, bull: 0.02 },
  bear:     { crash: 0.05, bear: 0.60, sideways: 0.30, bull: 0.05 },
  sideways: { crash: 0.03, bear: 0.18, sideways: 0.54, bull: 0.25 },
  bull:     { crash: 0.08, bear: 0.12, sideways: 0.30, bull: 0.50 },
};

export const CYCLE_2026_5YR: { months: number; mix: Record<string, number> }[] = [
  { months: 18, mix: { crash: 0, bear: 0.20, sideways: 0.65, bull: 0.15 } },
  { months: 18, mix: { crash: 0, bear: 0.03, sideways: 0.17, bull: 0.80 } },
  { months: 12, mix: { crash: 0.75, bear: 0.22, sideways: 0.03, bull: 0 } },
  { months: 12, mix: { crash: 0.08, bear: 0.45, sideways: 0.47, bull: 0 } },
];

export const CYCLE_2026_10YR: { months: number; mix: Record<string, number> }[] = [
  ...CYCLE_2026_5YR,
  { months: 24, mix: { crash: 0.02, bear: 0.13, sideways: 0.65, bull: 0.20 } },
  { months: 18, mix: { crash: 0, bear: 0.03, sideways: 0.17, bull: 0.80 } },
  { months: 12, mix: { crash: 0.70, bear: 0.25, sideways: 0.05, bull: 0 } },
  { months:  6, mix: { crash: 0.05, bear: 0.50, sideways: 0.45, bull: 0 } },
];

function boxMuller(): number {
  let u: number;
  do { u = Math.random(); } while (u === 0);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random());
}

function randT(df: number): number {
  const z = boxMuller();
  let chi2 = 0;
  for (let i = 0; i < df; i++) { const n = boxMuller(); chi2 += n * n; }
  return z / Math.sqrt(chi2 / df);
}

function sampleRegime(mix: Record<string, number>): string {
  const r = Math.random();
  let cum = 0;
  for (const k of Object.keys(mix)) {
    cum += mix[k];
    if (r < cum) return k;
  }
  return Object.keys(mix).slice(-1)[0];
}

export interface MCResult {
  p5: number; p10: number; p25: number; p50: number;
  p75: number; p90: number; p95: number;
  mean: number; pBelowEntry: number;
  var5: number; cvar5: number;
  medianMaxDD: number; p90MaxDD: number;
  nPaths: number; sorted: number[];
  /** Monthly percentile paths for charting */
  monthlyPaths?: { month: number; p10: number; p25: number; p50: number; p75: number; p90: number }[];
}

export interface MCOptions {
  startPriceUsd?: number;
  nPaths?: number;
  nMonths?: number;
  regimes?: Record<string, { mu: number; sigma: number }>;
  transition?: Record<string, Record<string, number>>;
  initialRegime?: string;
  cyclePhases?: { months: number; mix: Record<string, number> }[] | null;
  df?: number;
  structuralFloor?: number;
  floorGrowthRate?: number;
  collectMonthly?: boolean;
}

export function runMonteCarlo({
  startPriceUsd    = 84500,
  nPaths           = 10000,
  nMonths          = 60,
  regimes          = DEFAULT_REGIMES as unknown as Record<string, { mu: number; sigma: number }>,
  transition       = DEFAULT_TRANSITION,
  initialRegime    = "sideways",
  cyclePhases      = null,
  df               = 4,
  structuralFloor  = 45000,
  floorGrowthRate  = 0.10,
  collectMonthly   = false,
}: MCOptions = {}): MCResult {
  let monthPhase: Record<string, number>[] | null = null;
  if (cyclePhases) {
    monthPhase = [];
    for (const ph of cyclePhases) {
      for (let i = 0; i < ph.months; i++) monthPhase.push(ph.mix);
    }
    while (monthPhase.length < nMonths) monthPhase.push(cyclePhases[cyclePhases.length - 1].mix);
  }

  const regimeKeys   = Object.keys(regimes);
  const terminals    = new Array(nPaths);
  const maxDrawdowns = new Array(nPaths);

  // For monthly path collection
  const monthlyAll: number[][] | null = collectMonthly ? Array.from({ length: nMonths + 1 }, () => []) : null;

  for (let p = 0; p < nPaths; p++) {
    let price  = startPriceUsd;
    let peak   = startPriceUsd;
    let regime = initialRegime;
    let maxDD  = 0;

    if (monthlyAll) monthlyAll[0].push(price);

    for (let m = 0; m < nMonths; m++) {
      if (monthPhase) {
        regime = sampleRegime(monthPhase[m]);
      }

      const { mu, sigma } = regimes[regime] || regimes.sideways;
      const ret = (mu / 12) + (sigma / Math.sqrt(12)) * randT(df);
      price = price * Math.exp(ret);

      if (structuralFloor > 0) {
        const floor = structuralFloor * Math.exp(floorGrowthRate * m / 12);
        if (price < floor) price = floor;
      }

      if (price > peak) peak = price;
      const dd = (peak - price) / peak;
      if (dd > maxDD) maxDD = dd;

      if (!monthPhase) {
        const tr  = transition[regime];
        const rnd = Math.random();
        let cum = 0;
        for (const k of regimeKeys) {
          cum += (tr?.[k] ?? 0);
          if (rnd < cum) { regime = k; break; }
        }
      }

      if (monthlyAll) monthlyAll[m + 1].push(price);
    }

    terminals[p]    = price;
    maxDrawdowns[p] = maxDD;
  }

  const sorted   = terminals.slice().sort((a: number, b: number) => a - b);
  const sortedDD = maxDrawdowns.slice().sort((a: number, b: number) => a - b);
  const pct      = (q: number) => sorted[Math.min(nPaths - 1, Math.floor(q * nPaths))];
  const pctDD    = (q: number) => sortedDD[Math.min(nPaths - 1, Math.floor(q * nPaths))];

  const mean        = sorted.reduce((s: number, v: number) => s + v, 0) / nPaths;
  const pBelowEntry = sorted.filter((v: number) => v <= startPriceUsd).length / nPaths;
  const varIdx      = Math.max(1, Math.floor(0.05 * nPaths));
  const var5        = sorted[varIdx];
  const cvar5       = sorted.slice(0, varIdx).reduce((s: number, v: number) => s + v, 0) / varIdx;

  let monthlyPaths: MCResult["monthlyPaths"] = undefined;
  if (monthlyAll) {
    monthlyPaths = monthlyAll.map((prices, m) => {
      const s = prices.slice().sort((a, b) => a - b);
      const p = (q: number) => s[Math.min(s.length - 1, Math.floor(q * s.length))];
      return { month: m, p10: p(0.10), p25: p(0.25), p50: p(0.50), p75: p(0.75), p90: p(0.90) };
    });
  }

  return {
    p5: pct(0.05), p10: pct(0.10), p25: pct(0.25), p50: pct(0.50),
    p75: pct(0.75), p90: pct(0.90), p95: pct(0.95),
    mean, pBelowEntry, var5, cvar5,
    medianMaxDD: pctDD(0.50), p90MaxDD: pctDD(0.90),
    nPaths, sorted, monthlyPaths,
  };
}

/**
 * Simple GBM (Geometric Brownian Motion) simulation for single assets
 * Used for ETH, SOL, stablecoins that don't have regime-switching
 */
export interface GBMOptions {
  startPriceUsd?: number;
  annualDrift?: number;
  annualVol?: number;
  nPaths?: number;
  nMonths?: number;
  collectMonthly?: boolean;
}

export function runGBM({
  startPriceUsd = 100,
  annualDrift = 0.2,
  annualVol = 0.6,
  nPaths = 10000,
  nMonths = 60,
  collectMonthly = false,
}: GBMOptions = {}): MCResult {
  const terminals = new Array(nPaths);
  const maxDrawdowns = new Array(nPaths);
  const monthlyAll: number[][] | null = collectMonthly ? Array.from({ length: nMonths + 1 }, () => []) : null;

  const dt = 1 / 12; // monthly time step
  const drift = annualDrift * dt;
  const volSqrtDt = annualVol * Math.sqrt(dt);

  for (let p = 0; p < nPaths; p++) {
    let price = startPriceUsd;
    let peak = startPriceUsd;
    let maxDD = 0;

    if (monthlyAll) monthlyAll[0].push(price);

    for (let m = 0; m < nMonths; m++) {
      const z = boxMuller();
      const ret = drift + volSqrtDt * z;
      price = price * Math.exp(ret);

      if (price > peak) peak = price;
      const dd = (peak - price) / peak;
      if (dd > maxDD) maxDD = dd;

      if (monthlyAll) monthlyAll[m + 1].push(price);
    }

    terminals[p] = price;
    maxDrawdowns[p] = maxDD;
  }

  const sorted = terminals.slice().sort((a: number, b: number) => a - b);
  const sortedDD = maxDrawdowns.slice().sort((a: number, b: number) => a - b);
  const pct = (q: number) => sorted[Math.min(nPaths - 1, Math.floor(q * nPaths))];
  const pctDD = (q: number) => sortedDD[Math.min(nPaths - 1, Math.floor(q * nPaths))];

  const mean = sorted.reduce((s: number, v: number) => s + v, 0) / nPaths;
  const pBelowEntry = sorted.filter((v: number) => v <= startPriceUsd).length / nPaths;
  const varIdx = Math.max(1, Math.floor(0.05 * nPaths));
  const var5 = sorted[varIdx];
  const cvar5 = sorted.slice(0, varIdx).reduce((s: number, v: number) => s + v, 0) / varIdx;

  let monthlyPaths: MCResult["monthlyPaths"] = undefined;
  if (monthlyAll) {
    monthlyPaths = monthlyAll.map((prices, m) => {
      const s = prices.slice().sort((a, b) => a - b);
      const p = (q: number) => s[Math.min(s.length - 1, Math.floor(q * s.length))];
      return { month: m, p10: p(0.10), p25: p(0.25), p50: p(0.50), p75: p(0.75), p90: p(0.90) };
    });
  }

  return {
    p5: pct(0.05), p10: pct(0.10), p25: pct(0.25), p50: pct(0.50),
    p75: pct(0.75), p90: pct(0.90), p95: pct(0.95),
    mean, pBelowEntry, var5, cvar5,
    medianMaxDD: pctDD(0.50), p90MaxDD: pctDD(0.90),
    nPaths, sorted, monthlyPaths,
  };
}

/**
 * Portfolio Monte Carlo: simulate multiple correlated assets
 * Each asset uses GBM with its own drift/vol parameters
 * Returns portfolio value distribution (sum of all assets in USD)
 */
export interface PortfolioAssetConfig {
  assetId: string;
  startPriceUsd: number;
  amountHeld: number; // quantity held
  annualDrift: number;
  annualVol: number;
}

export interface PortfolioMCOptions {
  assets: PortfolioAssetConfig[];
  nPaths?: number;
  nMonths?: number;
  collectMonthly?: boolean;
  correlationMatrix?: number[][] | null; // optional; if null, assume independent
}

export function runPortfolioMonteCarlo({
  assets,
  nPaths = 10000,
  nMonths = 60,
  collectMonthly = false,
  correlationMatrix = null,
}: PortfolioMCOptions): MCResult {
  const nAssets = assets.length;
  const terminals = new Array(nPaths);
  const maxDrawdowns = new Array(nPaths);
  const monthlyAll: number[][] | null = collectMonthly ? Array.from({ length: nMonths + 1 }, () => []) : null;

  const dt = 1 / 12;
  const drifts = assets.map((a) => a.annualDrift * dt);
  const volSqrtDts = assets.map((a) => a.annualVol * Math.sqrt(dt));

  // Initialize prices
  const startPrices = assets.map((a) => a.startPriceUsd);

  for (let p = 0; p < nPaths; p++) {
    const prices = [...startPrices];
    let portfolioValue = assets.reduce((sum, a, i) => sum + prices[i] * a.amountHeld, 0);
    let peak = portfolioValue;
    let maxDD = 0;

    if (monthlyAll) monthlyAll[0].push(portfolioValue);

    for (let m = 0; m < nMonths; m++) {
      // Generate correlated returns
      const zs = new Array(nAssets);
      if (correlationMatrix && correlationMatrix.length === nAssets) {
        // Cholesky-based correlated generation (simplified)
        const uncorrelated = Array.from({ length: nAssets }, () => boxMuller());
        for (let i = 0; i < nAssets; i++) {
          let sum = 0;
          for (let j = 0; j <= i; j++) {
            sum += (correlationMatrix[i][j] || 0) * uncorrelated[j];
          }
          zs[i] = sum;
        }
      } else {
        // Independent
        for (let i = 0; i < nAssets; i++) zs[i] = boxMuller();
      }

      // Update each asset price
      for (let i = 0; i < nAssets; i++) {
        const ret = drifts[i] + volSqrtDts[i] * zs[i];
        prices[i] = prices[i] * Math.exp(ret);
      }

      // Compute portfolio value
      portfolioValue = assets.reduce((sum, a, i) => sum + prices[i] * a.amountHeld, 0);

      if (portfolioValue > peak) peak = portfolioValue;
      const dd = (peak - portfolioValue) / peak;
      if (dd > maxDD) maxDD = dd;

      if (monthlyAll) monthlyAll[m + 1].push(portfolioValue);
    }

    terminals[p] = portfolioValue;
    maxDrawdowns[p] = maxDD;
  }

  const sorted = terminals.slice().sort((a: number, b: number) => a - b);
  const sortedDD = maxDrawdowns.slice().sort((a: number, b: number) => a - b);
  const pct = (q: number) => sorted[Math.min(nPaths - 1, Math.floor(q * nPaths))];
  const pctDD = (q: number) => sortedDD[Math.min(nPaths - 1, Math.floor(q * nPaths))];

  const startValue = assets.reduce((sum, a) => sum + a.startPriceUsd * a.amountHeld, 0);
  const mean = sorted.reduce((s: number, v: number) => s + v, 0) / nPaths;
  const pBelowEntry = sorted.filter((v: number) => v <= startValue).length / nPaths;
  const varIdx = Math.max(1, Math.floor(0.05 * nPaths));
  const var5 = sorted[varIdx];
  const cvar5 = sorted.slice(0, varIdx).reduce((s: number, v: number) => s + v, 0) / varIdx;

  let monthlyPaths: MCResult["monthlyPaths"] = undefined;
  if (monthlyAll) {
    monthlyPaths = monthlyAll.map((values, m) => {
      const s = values.slice().sort((a, b) => a - b);
      const p = (q: number) => s[Math.min(s.length - 1, Math.floor(q * s.length))];
      return { month: m, p10: p(0.10), p25: p(0.25), p50: p(0.50), p75: p(0.75), p90: p(0.90) };
    });
  }

  return {
    p5: pct(0.05), p10: pct(0.10), p25: pct(0.25), p50: pct(0.50),
    p75: pct(0.75), p90: pct(0.90), p95: pct(0.95),
    mean, pBelowEntry, var5, cvar5,
    medianMaxDD: pctDD(0.50), p90MaxDD: pctDD(0.90),
    nPaths, sorted, monthlyPaths,
  };
}
