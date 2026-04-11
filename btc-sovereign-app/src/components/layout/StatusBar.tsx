import React from "react";
import { c, f } from "../../lib/theme";

export const StatusBar: React.FC = () => (
  <div style={{
    height: 44, display: "flex", justifyContent: "space-between", alignItems: "flex-end",
    padding: "0 24px 4px", flexShrink: 0,
  }}>
    <span style={{ fontSize: 13, fontWeight: 600, color: c.text, fontFamily: f.sans }}>9:41</span>
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <svg width="16" height="12" viewBox="0 0 16 12" fill={c.text}><rect x="0" y="5" width="3" height="7" rx="0.5"/><rect x="4.5" y="3" width="3" height="9" rx="0.5"/><rect x="9" y="1" width="3" height="11" rx="0.5"/><rect x="13.5" y="0" width="2.5" height="12" rx="0.5" fillOpacity="0.35"/></svg>
      <svg width="18" height="12" viewBox="0 0 18 12" fill="none"><path d="M1 9.5a9.5 6 0 0116 0" stroke={c.text} strokeWidth="1.5" strokeLinecap="round"/><path d="M4.5 9.5a6 4 0 019 0" stroke={c.text} strokeWidth="1.5" strokeLinecap="round"/><circle cx="9" cy="10.5" r="1" fill={c.text}/></svg>
      <svg width="22" height="12" viewBox="0 0 22 12" fill="none"><rect x="0.5" y="1" width="18" height="10" rx="2" stroke={c.text}/><rect x="2" y="2.5" width="12" height="7" rx="1" fill={c.positive}/><rect x="19.5" y="4" width="2" height="4" rx="0.5" fill={c.text} fillOpacity="0.4"/></svg>
    </div>
  </div>
);
