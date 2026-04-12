import React, { useState } from "react";
import { c, f } from "../lib/theme";
import { EUR_RATE } from "../lib/constants";
import type { Holding } from "../lib/constants";
import { Label, Num, Card, Btn, Badge, Row } from "../components/ui";

interface Props {
  hasCard: boolean;
  setHasCard: (v: boolean) => void;
  cardBal: number;
  setCardBal: (n: number) => void;
  holdings: Holding[];
  go: (s: string) => void;
}

export const CardScreen: React.FC<Props> = ({ hasCard, setHasCard, cardBal, setCardBal, holdings }) => {
  const [topupAmount, setTopupAmount] = useState(500);
  const [showTopupReview, setShowTopupReview] = useState(false);
  const [unshielding, setUnshielding] = useState(false);

  if (!hasCard) {
    return (
      <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
        <div style={{ marginBottom: 28, marginTop: 4 }}>
          <div style={{ width: 32, height: 2, background: c.accent, borderRadius: 1, marginBottom: 16 }} />
          <div style={{ fontSize: 22, fontWeight: 300, color: c.text, fontFamily: f.display, lineHeight: 1.3 }}>
            Spend without<br />compromising privacy.
          </div>
        </div>
        <div style={{
          background: c.surface, borderRadius: 8, padding: "24px 20px",
          marginBottom: 24, border: `1px solid ${c.border}`, position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle at top right, ${c.accentDim}, transparent 70%)` }} />
          <div style={{ fontSize: 9, color: c.mute, letterSpacing: "0.15em", fontWeight: 500, marginBottom: 48 }}>SELF-CUSTODIAL</div>
          <div style={{ fontSize: 15, letterSpacing: "0.25em", color: c.sub, marginBottom: 14, fontFamily: f.mono }}>•••• •••• •••• ••••</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <span style={{ fontSize: 11, color: c.mute, letterSpacing: "0.05em" }}>YOUR NAME</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: c.accent, letterSpacing: "0.03em" }}>Mastercard</span>
          </div>
        </div>
        <Card s={{ marginBottom: 12 }}>
          <Label s={{ marginBottom: 12 }}>How it works</Label>
          {[
            ["1", "Fund from private Railgun", "Unshield 1 tap"],
            ["2", "Top up card", "Instant settlement"],
            ["3", "Tap to pay", "EUR/local currency"],
            ["4", "Your assets stay private", "Until you unshield"],
          ].map(([n, t, sub]) => (
            <div key={n} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: c.accent, fontWeight: 600, fontFamily: f.mono, minWidth: 14 }}>{n}</span>
              <div>
                <div style={{ fontSize: 12, color: c.text }}>{t}</div>
                <div style={{ fontSize: 10, color: c.mute }}>{sub}</div>
              </div>
            </div>
          ))}
        </Card>
        <Card glow={c.accentSoft} s={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: c.accent, fontWeight: 600, marginBottom: 4 }}>KYC required</div>
          <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.5 }}>Card partner verifies your identity. Your Railgun holdings stay shielded.</div>
        </Card>
        <Btn primary onClick={() => setHasCard(true)}>Get card</Btn>
      </div>
    );
  }

  const TopupReview = () => {
    // Find shielded USDC for display
    void holdings.find(h => h.assetId === "USDC" && h.shielded);
    return showTopupReview ? (
      <Card s={{ marginBottom: 16, background: c.surfaceRaised }}>
        <Label s={{ marginBottom: 10 }}>Confirm top-up</Label>
        <Row label="Unshield from Railgun" value={`${topupAmount} USDC`} color={c.accent} accent />
        <Row label="To card" value={`€${(topupAmount * EUR_RATE).toLocaleString("en", { maximumFractionDigits: 2 })}`} />
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          {!unshielding ? (
            <>
              <Btn primary onClick={() => {
                setUnshielding(true);
                setTimeout(() => {
                  setCardBal(cardBal + topupAmount);
                  setShowTopupReview(false);
                  setUnshielding(false);
                  setTopupAmount(500);
                }, 1500);
              }} s={{ flex: 1 }}>Confirm</Btn>
              <Btn onClick={() => setShowTopupReview(false)} s={{ flex: 1, border: `1px solid ${c.border}` }}>Cancel</Btn>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "12px", flex: 1 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 16,
                border: `2px solid ${c.border}`, borderTopColor: c.accent,
                margin: "0 auto 8px",
                animation: "spin 0.8s linear infinite",
              }} />
              <div style={{ fontSize: 11, color: c.text, fontWeight: 500 }}>Unshielding...</div>
            </div>
          )}
        </div>
      </Card>
    ) : null;
  };

  return (
    <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
      <div style={{ marginBottom: 24, marginTop: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <Label s={{ marginBottom: 6 }}>Card balance</Label>
            <Num large>€{(cardBal * EUR_RATE).toLocaleString("en", { maximumFractionDigits: 0 })}</Num>
          </div>
          <Badge text="Active" color={c.positive} />
        </div>
        <div style={{ width: 40, height: 2, background: c.accent, borderRadius: 1, marginTop: 14 }} />
      </div>

      {/* Top-up section */}
      <Card s={{ marginBottom: 16 }}>
        <Label s={{ marginBottom: 10 }}>Top-up amount</Label>
        <input type="range" min={100} max={5000} step={50}
          value={topupAmount}
          onChange={e => setTopupAmount(Number(e.target.value))}
          style={{ width: "100%", accentColor: c.accent, marginBottom: 12, height: 2 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Num>{topupAmount} <span style={{ fontSize: 13, color: c.mute }}>USDC</span></Num>
          <span style={{ fontSize: 12, color: c.mute, fontFamily: f.mono }}>≈ €{(topupAmount * EUR_RATE).toLocaleString("en", { maximumFractionDigits: 2 })}</span>
        </div>
      </Card>

      {TopupReview()}

      {!showTopupReview && (
        <Btn primary onClick={() => setShowTopupReview(true)} s={{ marginBottom: 12 }}>
          Top-up €{(topupAmount * EUR_RATE).toLocaleString("en", { maximumFractionDigits: 0 })}
        </Btn>
      )}

      <Label s={{ marginBottom: 8 }}>Recent transactions</Label>
      {[
        { name: "Lidl Bulgaria", amount: -42.30, date: "Today 14:23" },
        { name: "Shell station", amount: -85.00, date: "Yesterday 09:15" },
        { name: "Netflix subscription", amount: -15.99, date: "Mar 28" },
        { name: "Amazon.de", amount: -129.00, date: "Mar 26" },
        { name: "Top-up from Railgun", amount: 500, date: "Mar 25" },
      ].map((tx, i) => (
        <div key={i} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 0", borderBottom: `1px solid ${c.borderSubtle}`,
        }}>
          <div>
            <div style={{ fontSize: 13, color: c.text }}>{tx.name}</div>
            <div style={{ fontSize: 10, color: c.mute }}>{tx.date}</div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: tx.amount > 0 ? c.positive : c.text, fontFamily: f.mono }}>
            {tx.amount > 0 ? "+" : ""}€{Math.abs(tx.amount).toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  );
};
