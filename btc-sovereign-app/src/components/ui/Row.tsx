import React from "react";
import { c, f } from "../../lib/theme";

export const Row: React.FC<{
  label: string; value: string; color?: string; accent?: boolean;
}> = ({ label, value, color, accent }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "5px 0" }}>
    <span style={{ fontSize: 12, color: c.sub, fontFamily: f.sans }}>{label}</span>
    <span style={{
      fontSize: 12, color: color || c.text, fontFamily: f.mono,
      fontWeight: accent ? 600 : 400,
    }}>{value}</span>
  </div>
);
