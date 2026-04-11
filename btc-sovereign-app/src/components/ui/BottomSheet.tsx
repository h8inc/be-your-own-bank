import React from "react";
import { c, f } from "../../lib/theme";

/** Slide-up bottom sheet overlay */
export const BottomSheet: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 50,
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
    }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
      }} />
      {/* Sheet */}
      <div style={{
        position: "relative", zIndex: 1,
        background: c.surface, borderRadius: "16px 16px 0 0",
        border: `1px solid ${c.border}`, borderBottom: "none",
        padding: "12px 20px 28px",
        maxHeight: "70%", overflowY: "auto",
        animation: "slideUp 0.25s ease-out",
      }}>
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: c.border }} />
        </div>
        {/* Title */}
        <div style={{
          fontSize: 14, fontWeight: 600, color: c.text, fontFamily: f.display,
          marginBottom: 16,
        }}>{title}</div>
        {children}
      </div>
    </div>
  );
};
