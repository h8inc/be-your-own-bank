import React from "react";
import { c, f } from "../../lib/theme";

export const Num: React.FC<{
  children: React.ReactNode; large?: boolean; color?: string; s?: React.CSSProperties;
}> = ({ children, large, color, s }) => (
  <div style={{
    fontSize: large ? 28 : 20, fontWeight: large ? 300 : 500,
    fontFamily: f.mono, color: color || c.text,
    letterSpacing: "-0.02em", lineHeight: 1.2, ...s,
  }}>{children}</div>
);
