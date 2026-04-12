import React from "react";
import { c, f } from "../../lib/theme";

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
    { id: "credit", label: "Credit", icon: icons.earn },
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
