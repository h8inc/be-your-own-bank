import React from "react";
import { c, f } from "../lib/theme";

/** StatusBar — fake iOS status bar */
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

/** NavBar icons */
const icons = {
  home: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 8l7-5 7 5v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 17v-5h4v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  earn: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M10 6v8M7 10l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  planner: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 15l4-6 3 4 3-5 4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 3v14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  card: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 8h16" stroke="currentColor" strokeWidth="1.5"/><path d="M5 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  settings: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M15.8 4.2l-1.4 1.4M5.6 14.4l-1.4 1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
};

export const NavBar: React.FC<{ active: string; go: (s: string) => void }> = ({ active, go }) => {
  const tabs: { id: string; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Home", icon: icons.home },
    { id: "lending", label: "Credit", icon: icons.earn },
    { id: "planner", label: "Plan", icon: icons.planner },
    { id: "card", label: "Card", icon: icons.card },
    { id: "settings", label: "Settings", icon: icons.settings },
  ];
  return (
    <div style={{
      display: "flex", justifyContent: "space-around",
      borderTop: `1px solid ${c.borderSubtle}`,
      padding: "8px 0 20px", background: c.bg, flexShrink: 0,
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => go(t.id)} style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          background: "none", border: "none", cursor: "pointer",
          color: active === t.id ? c.accent : c.mute,
          transition: "color 0.15s",
        }}>
          {t.icon}
          <span style={{ fontSize: 9, fontWeight: 500, fontFamily: f.sans, letterSpacing: "0.03em" }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
};

/** Responsive shell — fills mobile, centered max-width on desktop */
export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    display: "flex", justifyContent: "center",
    minHeight: "100vh", background: c.bg, fontFamily: f.sans,
  }}>
    <div style={{
      width: "100%", maxWidth: 480, minHeight: "100vh",
      background: c.bg,
      overflow: "hidden", display: "flex", flexDirection: "column",
    }}>{children}</div>
  </div>
);
