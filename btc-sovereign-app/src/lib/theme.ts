/*
  Sovereign Stack — Design Tokens
  Dark, warm, monospace numbers, single amber accent.
  Information-dense. Precision over decoration.
*/

export const c = {
  bg:             "#0C0C0E",
  surface:        "#141416",
  surfaceRaised:  "#1C1C1F",
  border:         "#2A2A2D",
  borderSubtle:   "#1E1E21",
  accent:         "#E8890C",
  accentDim:      "#E8890C18",
  accentSoft:     "#E8890C44",
  positive:       "#4ADE80",
  positiveDim:    "#4ADE8012",
  negative:       "#F87171",
  negativeDim:    "#F8717112",
  info:           "#60A5FA",
  infoDim:        "#60A5FA12",
  text:           "#E8E6E1",
  sub:            "#9B9A95",
  mute:           "#6B6A66",
} as const;

export const f = {
  mono: "'SF Mono','JetBrains Mono','Fira Code','Consolas',monospace",
  sans: "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif",
  display: "'SF Pro Display',-apple-system,BlinkMacSystemFont,system-ui,sans-serif",
} as const;

// Re-export from constants for backward compatibility
export { BTC_PRICE, EUR_RATE } from "./constants";
