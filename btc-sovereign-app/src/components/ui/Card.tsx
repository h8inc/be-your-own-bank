import React from "react";
import { c } from "../../lib/theme";

export const Card: React.FC<{
  children: React.ReactNode; onClick?: () => void; glow?: string; s?: React.CSSProperties;
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
