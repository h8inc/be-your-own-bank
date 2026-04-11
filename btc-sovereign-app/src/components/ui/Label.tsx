import React from "react";
import { c, f } from "../../lib/theme";

export const Label: React.FC<{ children: React.ReactNode; s?: React.CSSProperties }> = ({ children, s }) => (
  <div style={{ fontSize: 10, fontWeight: 500, color: c.mute, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: f.sans, ...s }}>{children}</div>
);
