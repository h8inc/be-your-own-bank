import React from "react";
import { c, f } from "../lib/theme";
import { ASSETS, portfolioValueEur, portfolioValueUsd, EUR_RATE } from "../lib/constants";
import type { Holding } from "../lib/constants";
import { Label, Num, Card, Badge } from "../components/ui";

interface Props {
  holdings: Holding[];
  activeLoan: any;
  hasCard: boolean;
  go: (s: string) => void;
}

export const HomeScreen: React.FC<Props> = ({ holdings, activeLoan, hasCard, go }) => {
  const netUsd = portfolioValueUsd(holdings);
  const netEur = portfolioValueEur(holdings);
  const activeLoans = activeLoan ? [activeLoan] : [];

  // Recent activity feed (mock data)
  const recentActivity = [
    { type: "deposit", asset: "ETH", amount: 2.5, value: 8000, date: "Today 14:32" },
    { type: "card_payment", vendor: "Amazon", amount: -125.50, date: "Today 10:15" },
    { type: "borrow", asset: "USDC", amount: 5000, date: "Mar 28" },
    { type: "shield", asset: "BTC", amount: 0.15, date: "Mar 25" },
  ];

  return (
    <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
      {/* Hero: Net worth */}
      <div style={{ marginBottom: 28, marginTop: 4 }}>
        <Label s={{ marginBottom: 12 }}>Net worth</Label>
        <Num large>€{netEur.toLocaleString("en", { maximumFractionDigits: 0 })}</Num>
        <div style={{ fontSize: 13, color: c.sub, fontFamily: f.mono, marginTop: 6, letterSpacing: "-0.01em" }}>
          ${netUsd.toLocaleString("en", { maximumFractionDigits: 0 })}
        </div>
        <div style={{ width: 40, height: 2, background: c.accent, borderRadius: 1, marginTop: 14 }} />
      </div>

      {/* Asset breakdown */}
      <Label s={{ marginBottom: 8 }}>Portfolio</Label>
      <div style={{ marginBottom: 16 }}>
        {holdings.map(h => {
          const asset = ASSETS[h.assetId];
          if (!asset) return null;
          const holdingEur = h.amount * asset.priceUsd * EUR_RATE;
          const pctOfPortfolio = netEur > 0 ? ((holdingEur / netEur) * 100).toFixed(1) : "0";

          return (
            <div key={h.assetId} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 0", borderBottom: `1px solid ${c.borderSubtle}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: "50%", background: asset.color,
                }}>
                </div>
                <div>
                  <div style={{ fontSize: 13, color: c.text, fontWeight: 500 }}>
                    {h.amount.toLocaleString("en", {
                      maximumFractionDigits: asset.symbol === "BTC" ? 4 : 2,
                    })} {asset.symbol}
                  </div>
                  <div style={{ fontSize: 10, color: c.mute, display: "flex", alignItems: "center", gap: 4 }}>
                    {h.shielded && <span>🔒</span>}
                    <span>{pctOfPortfolio}% of portfolio</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, color: c.text, fontWeight: 500, fontFamily: f.mono }}>
                  €{holdingEur.toLocaleString("en", { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <Label s={{ marginBottom: 8 }}>Actions</Label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: 16 }}>
        {[
          { icon: "↙", label: "Deposit", s: "deposit" },
          { icon: "↗", label: "Send", s: "home" },
          { icon: "🔐", label: "Shield", s: "home" },
          { icon: "₿", label: "Borrow", s: "lending" },
        ].map(a => (
          <button key={a.label} onClick={() => go(a.s)} style={{
            background: c.surface, border: `1px solid ${c.border}`, borderRadius: 6,
            padding: "14px 0", cursor: "pointer", display: "flex", flexDirection: "column",
            alignItems: "center", gap: 5, transition: "border-color 0.2s",
          }}>
            <span style={{ fontSize: 16 }}>{a.icon}</span>
            <span style={{ fontSize: 9, color: c.mute, fontWeight: 500, letterSpacing: "0.05em", fontFamily: f.sans }}>{a.label.toUpperCase()}</span>
          </button>
        ))}
      </div>

      {/* Card card */}
      <Card onClick={() => go("card")} s={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Label s={{ marginBottom: 6 }}>Card</Label>
          <Num>€500</Num>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {hasCard && <Badge text="Active" color={c.positive} />}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke={c.mute} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </Card>

      {/* Active loans */}
      {activeLoans.length > 0 && (
        <>
          <Label s={{ marginBottom: 8 }}>Active positions</Label>
          {activeLoans.map((loan, i) => (
            <Card key={i} glow={c.accentSoft} s={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: c.accent, fontWeight: 600 }}>Borrow position</span>
                <span style={{ fontSize: 10, color: c.mute, fontFamily: f.mono }}>Variable rate</span>
              </div>
              <div style={{ fontSize: 11, color: c.mute, marginTop: 4, lineHeight: 1.5 }}>
                {loan.collateralAsset} locked · borrowing USDC · Health factor: {loan.healthFactor?.toFixed(2) || "N/A"}
              </div>
            </Card>
          ))}
        </>
      )}

      {/* Recent activity */}
      <Label s={{ marginBottom: 8 }}>Recent activity</Label>
      {recentActivity.slice(0, 4).map((tx, i) => (
        <div key={i} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 0", borderBottom: `1px solid ${c.borderSubtle}`,
        }}>
          <div>
            <div style={{ fontSize: 13, color: c.text }}>
              {tx.type === "deposit" && `Deposit ${tx.asset}`}
              {tx.type === "card_payment" && `Spent at ${tx.vendor}`}
              {tx.type === "borrow" && `Borrowed ${tx.asset}`}
              {tx.type === "shield" && `Shielded ${tx.asset}`}
            </div>
            <div style={{ fontSize: 10, color: c.mute }}>{tx.date}</div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: tx.type === "card_payment" ? c.text : c.positive, fontFamily: f.mono }}>
            {tx.type === "card_payment" ? "-" : "+"}€{Math.abs(tx.amount || tx.value || 0).toLocaleString("en", { maximumFractionDigits: 2 })}
          </span>
        </div>
      ))}
    </div>
  );
};
