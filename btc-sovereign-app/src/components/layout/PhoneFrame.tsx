import React, { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 600;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth <= MOBILE_BREAKPOINT
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

export const PhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMobile = useIsMobile();

  if (isMobile) return <>{children}</>;

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#050506",
      padding: "32px 0",
    }}>
      <div style={{
        position: "relative",
        width: 400,
        height: 860,
        borderRadius: 52,
        background: "#1A1A1C",
        boxShadow:
          "0 0 0 2px #2A2A2D, 0 0 0 5px #111113, 0 40px 80px rgba(0,0,0,0.6), 0 0 120px rgba(232,137,12,0.03)",
        overflow: "hidden",
        flexShrink: 0,
      }}>
        {/* Side buttons */}
        <div style={{
          position: "absolute", left: -3, top: 160,
          width: 3, height: 32, borderRadius: "2px 0 0 2px",
          background: "#2A2A2D",
        }} />
        <div style={{
          position: "absolute", left: -3, top: 220,
          width: 3, height: 56, borderRadius: "2px 0 0 2px",
          background: "#2A2A2D",
        }} />
        <div style={{
          position: "absolute", left: -3, top: 284,
          width: 3, height: 56, borderRadius: "2px 0 0 2px",
          background: "#2A2A2D",
        }} />
        <div style={{
          position: "absolute", right: -3, top: 240,
          width: 3, height: 80, borderRadius: "0 2px 2px 0",
          background: "#2A2A2D",
        }} />

        {/* Inner screen area */}
        <div style={{
          position: "absolute",
          inset: 4,
          borderRadius: 48,
          overflow: "hidden",
          background: "#0C0C0E",
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Dynamic Island */}
          <div style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 120,
            height: 34,
            borderRadius: 20,
            background: "#000",
            zIndex: 50,
          }} />

          {/* App content */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}>
            {children}
          </div>

          {/* Home indicator */}
          <div style={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 134,
            height: 5,
            borderRadius: 3,
            background: "rgba(232,230,225,0.2)",
            zIndex: 50,
          }} />
        </div>
      </div>
    </div>
  );
};
