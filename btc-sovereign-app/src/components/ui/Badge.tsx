import React from "react";
import { f } from "../../lib/theme";

export const Badge: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <span style={{
    fontSize: 9, fontWeight: 600, color, background: color + "14",
    padding: "3px 8px", borderRadius: 3, letterSpacing: "0.04em",
    fontFamily: f.sans, textTransform: "uppercase",
  }}>{text}</span>
);
