import React from "react";
import { c, f } from "../../lib/theme";

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    minHeight: "100vh", background: c.bg, fontFamily: f.sans,
    display: "flex", flexDirection: "column",
  }}>
    <div style={{
      width: "100%", maxWidth: 480, minHeight: "100vh",
      background: c.bg, overflow: "hidden", display: "flex", flexDirection: "column",
      position: "relative", // needed for BottomSheet absolute positioning
      margin: "0 auto",
    }}>{children}</div>
  </div>
);
