import React from "react";
import { c, f } from "../../lib/theme";

/**
 * Full-screen overlay that blocks interaction on locked features.
 * Shows a clear CTA to connect wallet.
 */
export const LockedOverlay: React.FC<{
  title: string;
  subtitle: string;
  onConnect: () => void;
}> = ({ title, subtitle, onConnect }) => (
  <div style={{
    position: "absolute", inset: 0, zIndex: 40,
    display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
    background: "rgba(12,12,14,0.88)", backdropFilter: "blur(12px)",
    padding: "0 32px", textAlign: "center",
  }}>
    {/* Lock icon */}
    <div style={{
      width: 48, height: 48, borderRadius: 24,
      background: c.accentDim, display: "flex", alignItems: "center", justifyContent: "center",
      marginBottom: 20,
    }}>
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="4" y="10" width="14" height="10" rx="2" stroke={c.accent} strokeWidth="1.5" />
        <path d="M7 10V7a4 4 0 018 0v3" stroke={c.accent} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="11" cy="15" r="1.5" fill={c.accent} />
      </svg>
    </div>
    <div style={{
      fontSize: 18, fontWeight: 300, color: c.text, fontFamily: f.display,
      lineHeight: 1.3, marginBottom: 8,
    }}>{title}</div>
    <div style={{
      fontSize: 12, color: c.mute, lineHeight: 1.6, marginBottom: 24, maxWidth: 260,
    }}>{subtitle}</div>
    <button onClick={onConnect} style={{
      padding: "14px 40px", borderRadius: 6, border: "none",
      background: c.accent, color: c.bg, fontSize: 13, fontWeight: 600,
      fontFamily: f.sans, cursor: "pointer", letterSpacing: "0.01em",
      transition: "opacity 0.15s",
    }}>Connect wallet</button>
    <div style={{ fontSize: 10, color: c.mute, marginTop: 12 }}>
      Read-only · your keys never leave your device
    </div>
  </div>
);
