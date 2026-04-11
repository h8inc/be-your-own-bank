import React from "react";
import { c, f } from "../../lib/theme";

export const Btn: React.FC<{
  children: React.ReactNode; primary?: boolean; ghost?: boolean; danger?: boolean;
  compact?: boolean; disabled?: boolean; onClick?: () => void; s?: React.CSSProperties;
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
