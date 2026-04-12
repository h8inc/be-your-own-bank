export function fmt(n: number) {
  if (Math.abs(n) >= 1000) return "€" + Math.round(n).toLocaleString("en");
  return "€" + Math.round(n);
}

export function fmtUsd(n: number) {
  if (Math.abs(n) >= 1000) return "$" + Math.round(n).toLocaleString("en");
  return "$" + Math.round(n);
}

export function fmtCompact(n: number) {
  if (Math.abs(n) >= 1_000_000) return "€" + (n / 1_000_000).toFixed(1) + "M";
  if (Math.abs(n) >= 1000) return "€" + (n / 1000).toFixed(0) + "K";
  return "€" + Math.round(n);
}

export function fmtUsdCompact(n: number) {
  if (Math.abs(n) >= 1_000_000) return "$" + (n / 1_000_000).toFixed(1) + "M";
  if (Math.abs(n) >= 1000) return "$" + (n / 1000).toFixed(0) + "K";
  return "$" + Math.round(n);
}

export function fmtBtc(n: number) {
  return n.toFixed(4);
}

export function fmtPct(n: number) {
  const sign = n >= 0 ? "+" : "";
  return sign + n.toFixed(1) + "%";
}

export function fmtAsset(amount: number, symbol: string): string {
  // For BTC-like assets, show 4 decimals
  if (["BTC", "ETH"].includes(symbol)) {
    const decimals = symbol === "BTC" ? 4 : 4;
    return `${amount.toFixed(decimals)} ${symbol}`;
  }
  // For stablecoins and others, show commas and 2 decimals
  return `${Math.round(amount).toLocaleString("en")} ${symbol}`;
}
