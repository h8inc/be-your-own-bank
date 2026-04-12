import React from "react";
import { c, f } from "../../lib/theme";

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    flex: 1, minHeight: 0, background: c.bg, fontFamily: f.sans,
    display: "flex", flexDirection: "column", overflow: "hidden",
  }}>
    <div style={{
      width: "100%", maxWidth: 480, flex: 1, minHeight: 0,
      background: c.bg, overflow: "hidden", display: "flex", flexDirection: "column",
      position: "relative",
      margin: "0 auto",
    }}>{children}</div>
  </div>
);
