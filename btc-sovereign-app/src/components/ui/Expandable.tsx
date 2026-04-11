import React, { useState } from "react";
import { c, f } from "../../lib/theme";

/** Collapsible section with progressive disclosure */
export const Expandable: React.FC<{
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}> = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 12 }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 14px", background: c.surface, border: `1px solid ${c.border}`,
        borderRadius: open ? "8px 8px 0 0" : 8, cursor: "pointer", transition: "all 0.15s",
      }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: c.sub, fontFamily: f.sans, letterSpacing: "0.02em" }}>{title}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <path d="M3 5l3 3 3-3" stroke={c.mute} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderTop: "none", borderRadius: "0 0 8px 8px", padding: 14 }}>
          {children}
        </div>
      )}
    </div>
  );
};
