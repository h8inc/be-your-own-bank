import React from "react";
import { c, f } from "../lib/theme";

/* ─── Label ─── */
export const Label: React.FC<{ children: React.ReactNode; s?: React.CSSProperties }> = ({ children, s }) => (
  <div style={{ fontSize: 10, fontWeight: 500, color: c.mute, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: f.sans, ...s }}>{children}</div>
);

/* ─── Num (monospace number display) ─── */
export const Num: React.FC<{
  children: React.ReactNode; large?: boolean; color?: string; s?: React.CSSProperties
}> = ({ children, large, color, s }) => (
  <div style={{
    fontSize: large ? 28 : 20, fontWeight: large ? 300 : 500,
    fontFamily: f.mono, color: color || c.text,
    letterSpacing: "-0.02em", lineHeight: 1.2, ...s,
  }}>{children}</div>
);

/* ─── Row (key-value pair) ─── */
export const Row: React.FC<{
  label: string; value: string; color?: string; accent?: boolean
}> = ({ label, value, color, accent }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "5px 0" }}>
    <span style={{ fontSize: 12, color: c.sub, fontFamily: f.sans }}>{label}</span>
    <span style={{
      fontSize: 12, color: color || c.text, fontFamily: f.mono,
      fontWeight: accent ? 600 : 400,
    }}>{value}</span>
  </div>
);

/* ─── Card ─── */
export const Card: React.FC<{
  children: React.ReactNode; onClick?: () => void; glow?: string; s?: React.CSSProperties
}> = ({ children, onClick, glow, s }) => (
  <div onClick={onClick} style={{
    background: c.surface, borderRadius: 8, padding: 16,
    border: `1px solid ${c.border}`,
    cursor: onClick ? "pointer" : undefined,
    transition: "border-color 0.2s",
    boxShadow: glow ? `0 0 0 1px ${glow}` : undefined,
    ...s,
  }}>{children}</div>
);

/* ─── Btn ─── */
export const Btn: React.FC<{
  children: React.ReactNode; primary?: boolean; ghost?: boolean; danger?: boolean;
  compact?: boolean; disabled?: boolean; onClick?: () => void; s?: React.CSSProperties
}> = ({ children, primary, ghost, danger, compact, disabled, onClick, s }) => (
  <button disabled={disabled} onClick={onClick} style={{
    width: "100%", padding: compact ? "8px 12px" : "14px 0", borderRadius: 6,
    border: primary || danger ? "none" : `1px solid ${c.border}`,
    background: danger ? c.negativeDim : primary ? c.accent : ghost ? "transparent" : c.surfaceRaised,
    color: danger ? c.negative : primary ? c.bg : c.text,
    fontSize: compact ? 11 : 13, fontWeight: 600, fontFamily: f.sans,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    transition: "all 0.15s",
    letterSpacing: "0.01em",
    ...s,
  }}>{children}</button>
);

/* ─── Back ─── */
export const Back: React.FC<{ onClick: () => void; label?: string }> = ({ onClick, label }) => (
  <button onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 4, background: "none", border: "none",
    color: c.mute, fontSize: 11, cursor: "pointer", padding: "8px 0 16px",
    fontFamily: f.sans, letterSpacing: "0.02em",
  }}>
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8 3L4 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    {label || "Back"}
  </button>
);

/* ─── Badge ─── */
export const Badge: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <span style={{
    fontSize: 9, fontWeight: 600, color, background: color + "14",
    padding: "3px 8px", borderRadius: 3, letterSpacing: "0.04em",
    fontFamily: f.sans, textTransform: "uppercase",
  }}>{text}</span>
);
