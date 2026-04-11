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
