/** App-wide constants */
export const EUR_RATE = 0.92;
export const EUR_USD = 1.08;
export const SAFE_WITHDRAWAL_RATE = 0.04;

/** Asset definitions */
export interface Asset {
  id: string;
  symbol: string;
  name: string;
  color: string;
  priceUsd: number;
  /** Annual volatility for MC simulation */
  annualVol: number;
  /** Annual drift (expected return) for MC */
  annualDrift: number;
  /** Whether power-law model applies */
  hasPowerLaw: boolean;
  /** Aave supply APY (display only) */
  supplyApy: number;
  /** Max LTV on Aave */
  maxLtv: number;
  /** Liquidation threshold on Aave */
  liquidationThreshold: number;
}

export const ASSETS: Record<string, Asset> = {
  BTC: {
    id: "btc",
    symbol: "BTC",
    name: "Bitcoin",
    color: "#F7931A",
    priceUsd: 84500,
    annualVol: 0.65,
    annualDrift: 0.35,
    hasPowerLaw: true,
    supplyApy: 0.01,
    maxLtv: 0.73,
    liquidationThreshold: 0.78,
  },
  ETH: {
    id: "eth",
    symbol: "ETH",
    name: "Ethereum",
    color: "#627EEA",
    priceUsd: 3200,
    annualVol: 0.75,
    annualDrift: 0.25,
    hasPowerLaw: false,
    supplyApy: 0.02,
    maxLtv: 0.8,
    liquidationThreshold: 0.825,
  },
  SOL: {
    id: "sol",
    symbol: "SOL",
    name: "Solana",
    color: "#9945FF",
    priceUsd: 178,
    annualVol: 0.95,
    annualDrift: 0.3,
    hasPowerLaw: false,
    supplyApy: 0.0,
    maxLtv: 0.65,
    liquidationThreshold: 0.7,
  },
  USDC: {
    id: "usdc",
    symbol: "USDC",
    name: "USD Coin",
    color: "#2775CA",
    priceUsd: 1.0,
    annualVol: 0.005,
    annualDrift: 0.0,
    hasPowerLaw: false,
    supplyApy: 0.045,
    maxLtv: 0.0,
    liquidationThreshold: 0.0,
  },
  USDT: {
    id: "usdt",
    symbol: "USDT",
    name: "Tether",
    color: "#50AF95",
    priceUsd: 1.0,
    annualVol: 0.005,
    annualDrift: 0.0,
    hasPowerLaw: false,
    supplyApy: 0.04,
    maxLtv: 0.0,
    liquidationThreshold: 0.0,
  },
};

export const ASSET_LIST = Object.values(ASSETS);

/** Default portfolio for demo */
export interface Holding {
  assetId: string;
  amount: number;
  shielded: boolean; // true = in Railgun
}

export const DEFAULT_HOLDINGS: Holding[] = [
  { assetId: "BTC", amount: 1.2450, shielded: true },
  { assetId: "ETH", amount: 8.5, shielded: true },
  { assetId: "SOL", amount: 45, shielded: false },
  { assetId: "USDC", amount: 2200, shielded: false },
];

/** Helper: total portfolio value in USD */
export function portfolioValueUsd(holdings: Holding[]): number {
  return holdings.reduce((sum, h) => {
    const asset = ASSETS[h.assetId];
    return sum + (asset ? h.amount * asset.priceUsd : 0);
  }, 0);
}

/** Helper: total portfolio value in EUR */
export function portfolioValueEur(holdings: Holding[]): number {
  return portfolioValueUsd(holdings) * EUR_RATE;
}

// Keep BTC_PRICE for backward compatibility
export const BTC_PRICE = ASSETS.BTC.priceUsd;
