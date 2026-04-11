import React from "react";
import { c, f } from "../../lib/theme";

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
