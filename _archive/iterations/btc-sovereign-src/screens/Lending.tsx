import React, { useState } from "react";
import { c, f, BTC_PRICE, EUR_RATE } from "../lib/theme";
import { Label, Num, Row, Card, Btn, Back, Badge } from "../components/Primitives";

interface Props {
  vaultBal: number;
  activeLoan: any;
  setActiveLoan: (l: any) => void;
  setVaultBal: (fn: (v: number) => number) => void;
  setCardBal: (n: number) => void;
  go: (s: string) => void;
}

export const LendingScreen: React.FC<Props> = ({ vaultBal, activeLoan, setActiveLoan, setVaultBal, setCardBal, go }) => {
  const [mode, setMode] = useState<"borrow" | "earn">("borrow");
  const [collBtc, setCollBtc] = useState(Math.min(0.5, vaultBal));
  const [durDays, setDurDays] = useState(90);
  const [rate, setRate] = useState(3.5);
  const [matching, setMatching] = useState(false);
  const [matchProgress, setMatchProgress] = useState(0);
  const [matchedLender, setMatchedLender] = useState<any>(null);
  const [showSighashSheet, setShowSighashSheet] = useState(false);
  const [sighashType, setSighashType] = useState<"standard" | "simplicity" | null>(null);

  const principal = collBtc * BTC_PRICE * 0.30;
  const totalRepay = principal * (1 + rate / 100 * (durDays / 365));
  const interest = totalRepay - principal;

  const openOffers = [
    { id: 1, borrower: "bc1q...7xk4", collateral: 0.82, principal: 20280, rate: 4.2, duration: 90, ltv: 24, posted: "2 min ago" },
    { id: 2, borrower: "bc1q...m3pf", collateral: 2.10, principal: 53550, rate: 3.8, duration: 180, ltv: 30, posted: "8 min ago" },
    { id: 3, borrower: "bc1q...9dw2", collateral: 0.35, principal: 8873, rate: 5.1, duration: 30, ltv: 30, posted: "14 min ago" },
    { id: 4, borrower: "bc1q...kf71", collateral: 1.50, principal: 38025, rate: 3.5, duration: 365, ltv: 30, posted: "22 min ago" },
    { id: 5, borrower: "bc1q...a8x3", collateral: 0.50, principal: 12675, rate: 4.8, duration: 90, ltv: 30, posted: "31 min ago" },
  ];

  const startMatching = () => {
    setMatching(true);
    setMatchProgress(0);
    const steps = [
      { delay: 400, progress: 15 }, { delay: 1200, progress: 30 },
      { delay: 2000, progress: 55 }, { delay: 2800, progress: 75 },
      { delay: 3600, progress: 90 }, { delay: 4200, progress: 100 },
    ];
    steps.forEach(({ delay, progress }) => {
      setTimeout(() => setMatchProgress(progress), delay);
    });
    setTimeout(() => {
      setMatchedLender({ address: "bc1q...f8m2", reputation: 47, totalLent: "$2.4M" });
    }, 4200);
  };

  const confirmMatch = () => {
    const exp = new Date(); exp.setDate(exp.getDate() + durDays);
    setActiveLoan({
      collateralBTC: collBtc, principalUSD: Math.round(principal), interestRate: rate, durationDays: durDays,
      startDate: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      expiryDate: exp.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    });
    setVaultBal(prev => prev - collBtc);
    setCardBal(Math.round(principal));
    setMatching(false);
    setMatchedLender(null);
    go("home");
  };

  const ModeToggle = () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, background: c.surface, borderRadius: 6, border: `1px solid ${c.border}`, padding: 3 }}>
      {(["borrow", "earn"] as const).map(m => (
        <button key={m} onClick={() => setMode(m)} style={{
          padding: "10px 0", borderRadius: 4, fontSize: 12, fontWeight: 600,
          border: "none", cursor: "pointer", fontFamily: f.sans, letterSpacing: "0.02em",
          background: mode === m ? c.surfaceRaised : "transparent",
          color: mode === m ? c.text : c.mute, transition: "all 0.15s",
        }}>{m === "borrow" ? "Borrow" : "Earn"}</button>
      ))}
    </div>
  );

  // ── Active loan
  if (activeLoan) {
    const totalDue = activeLoan.principalUSD * (1 + activeLoan.interestRate / 100 * (activeLoan.durationDays / 365));
    const ltv = (activeLoan.principalUSD / (activeLoan.collateralBTC * BTC_PRICE)) * 100;
    return (
      <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
        <div style={{ marginBottom: 24, marginTop: 4 }}>
          <Label s={{ marginBottom: 6 }}>Active contract</Label>
          <Num large>${activeLoan.principalUSD.toLocaleString()}</Num>
          <div style={{ fontSize: 13, color: c.mute, fontFamily: f.mono, marginTop: 4 }}>
            ≈ €{(activeLoan.principalUSD * EUR_RATE).toLocaleString("en", { maximumFractionDigits: 0 })} · Due {activeLoan.expiryDate}
          </div>
          <div style={{ width: 40, height: 2, background: c.accent, borderRadius: 1, marginTop: 14 }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          <Btn primary onClick={() => go("repay")}>Repay</Btn>
          <Btn onClick={() => go("add-collateral")}>+ Collateral</Btn>
        </div>
        <Card s={{ marginBottom: 12 }}>
          <Label s={{ marginBottom: 10 }}>Terms</Label>
          <Row label="Started" value={activeLoan.startDate} />
          <Row label="Expires" value={activeLoan.expiryDate} color={c.accent} accent />
          <Row label="Duration" value={`${activeLoan.durationDays}d`} />
          <Row label="Rate" value={`${activeLoan.interestRate}% APR`} />
          <Row label="Interest" value={`$${Math.round(totalDue - activeLoan.principalUSD).toLocaleString()}`} />
          <Row label="Total due" value={`$${Math.round(totalDue).toLocaleString()}`} color={c.accent} accent />
        </Card>
        <Card s={{ marginBottom: 12 }}>
          <Label s={{ marginBottom: 10 }}>Collateral</Label>
          <Row label="Locked" value={`${activeLoan.collateralBTC.toFixed(4)} BTC`} color={c.accent} accent />
          <Row label="Value" value={`$${(activeLoan.collateralBTC * BTC_PRICE).toLocaleString("en", { maximumFractionDigits: 0 })}`} />
          <Row label="LTV" value={`${ltv.toFixed(1)}%`} color={c.positive} accent />
        </Card>
        <Card>
          <Label s={{ marginBottom: 8 }}>How it works</Label>
          <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.6, marginBottom: 10 }}>
            Fixed date. No monitoring. No margin calls. Simple.
          </div>
          {([
            ["Repay on time", "BTC returned", c.positive],
            ["Miss deadline", "Lender claims collateral", c.negative],
            ["Add collateral", "Improve safety margin", c.info],
          ] as const).map(([a, b, col], i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5, fontSize: 11 }}>
              <span style={{ color: col, fontWeight: 600, minWidth: 110, fontFamily: f.sans }}>{a}</span>
              <span style={{ color: c.mute }}>{b}</span>
            </div>
          ))}
        </Card>
      </div>
    );
  }

  // ── Matching
  if (matching) {
    const steps = [
      { at: 0, label: "Publishing your offer" },
      { at: 15, label: "Searching for lenders" },
      { at: 30, label: "3 potential lenders found" },
      { at: 55, label: "Negotiating best terms" },
      { at: 75, label: "Lender accepted your offer" },
      { at: 90, label: "Setting up loan contract" },
    ];
    return (
      <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
        <div style={{ marginBottom: 28, marginTop: 4 }}>
          <Label s={{ marginBottom: 6 }}>{matchedLender ? "Matched" : "Finding a lender"}</Label>
          <Num large>{matchedLender ? "Lender found" : "Matching..."}</Num>
          <div style={{ width: 40, height: 2, background: matchedLender ? c.positive : c.accent, borderRadius: 1, marginTop: 14 }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ height: 3, background: c.border, borderRadius: 2, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ height: "100%", borderRadius: 2, transition: "width 0.6s ease-out", width: `${matchProgress}%`, background: matchedLender ? c.positive : c.accent }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 10, color: c.mute, fontFamily: f.mono }}>{matchProgress}%</span>
            <span style={{ fontSize: 10, color: matchedLender ? c.positive : c.mute }}>{matchedLender ? "Contract ready" : "Searching..."}</span>
          </div>
        </div>
        <Card s={{ marginBottom: 16 }}>
          {steps.map((step, i) => {
            const done = matchProgress >= step.at + 15;
            const active = matchProgress >= step.at && !done;
            return (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < steps.length - 1 ? 10 : 0, alignItems: "center" }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                  background: done ? c.positiveDim : active ? c.accentDim : c.borderSubtle, transition: "all 0.3s",
                }}>
                  <span style={{ fontSize: 9, color: done ? c.positive : active ? c.accent : c.mute, fontFamily: f.mono }}>
                    {done ? "✓" : active ? "●" : "○"}
                  </span>
                </div>
                <span style={{ fontSize: 12, color: done ? c.sub : active ? c.text : c.mute, transition: "color 0.3s" }}>{step.label}</span>
              </div>
            );
          })}
        </Card>
        <Card s={{ marginBottom: 16 }}>
          <Label s={{ marginBottom: 10 }}>Your offer</Label>
          <Row label="Collateral" value={`${collBtc.toFixed(4)} BTC`} color={c.accent} accent />
          <Row label="Borrowing" value={`$${Math.round(principal).toLocaleString()}`} />
          <Row label="Rate" value={`${rate.toFixed(1)}% APR`} />
          <Row label="Duration" value={`${durDays}d`} />
        </Card>
        {matchedLender && (
          <>
            <Card glow={c.positive + "44"} s={{ marginBottom: 16 }}>
              <Label s={{ marginBottom: 10 }}>Matched lender</Label>
              <Row label="Address" value={matchedLender.address} color={c.info} />
              <Row label="Contracts completed" value={`${matchedLender.reputation}`} color={c.positive} accent />
              <Row label="Total lent" value={matchedLender.totalLent} />
            </Card>
            <Btn primary onClick={() => { setSighashType(null); setShowSighashSheet(true); }}>
              Sign & accept — ${Math.round(principal).toLocaleString()}
            </Btn>
            <div style={{ fontSize: 10, color: c.mute, marginTop: 8 }}>Your wallet will confirm the loan</div>
          </>
        )}

        {/* ── SIGhash bottom sheet ── */}
        {showSighashSheet && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 100,
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
          }}>
            {/* backdrop */}
            <div
              onClick={() => setShowSighashSheet(false)}
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}
            />
            {/* sheet */}
            <div style={{
              position: "relative", zIndex: 1,
              background: c.surface, borderRadius: "16px 16px 0 0",
              border: `1px solid ${c.border}`, borderBottom: "none",
              padding: "24px 24px 36px",
              maxHeight: "85vh", overflowY: "auto",
            }}>
              {/* pill */}
              <div style={{ width: 36, height: 3, background: c.border, borderRadius: 2, margin: "0 auto 20px" }} />

              <Label s={{ marginBottom: 6 }}>⚡ Critical signing decision</Label>
              <div style={{ fontSize: 17, fontWeight: 400, color: c.text, fontFamily: f.display, lineHeight: 1.4, marginBottom: 6 }}>
                SIGhash scope
              </div>
              <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.6, marginBottom: 20 }}>
                Choose what your signature commits to. This affects which hardware wallets can sign and how portable the contract is.
              </div>

              {/* Option A — Standard */}
              <button
                onClick={() => setSighashType("standard")}
                style={{
                  width: "100%", textAlign: "left", padding: 14, marginBottom: 10,
                  borderRadius: 8, cursor: "pointer", fontFamily: f.sans,
                  border: `1.5px solid ${sighashType === "standard" ? c.positive : c.border}`,
                  background: sighashType === "standard" ? c.positiveDim ?? "rgba(52,211,153,0.08)" : c.bg,
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: sighashType === "standard" ? c.positive : c.text }}>
                    Standard SIGhash
                  </span>
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
                    color: c.positive, background: "rgba(52,211,153,0.12)",
                    padding: "2px 7px", borderRadius: 4,
                  }}>BROAD COMPAT</span>
                </div>
                <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.6, marginBottom: 8 }}>
                  Uses BIP-341/342 Tapscript sighash serialisation. Your signature commits to the standard Bitcoin transaction fields the same way any Taproot spend does.
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                  {["Ledger", "Trezor", "Coldcard", "Jade", "BitBox"].map(hw => (
                    <span key={hw} style={{
                      fontSize: 10, color: c.sub, background: c.surfaceRaised,
                      padding: "2px 8px", borderRadius: 4, fontFamily: f.mono,
                    }}>{hw}</span>
                  ))}
                </div>
              </button>

              {/* Option B — Simplicity-specific */}
              <button
                onClick={() => setSighashType("simplicity")}
                style={{
                  width: "100%", textAlign: "left", padding: 14, marginBottom: 20,
                  borderRadius: 8, cursor: "pointer", fontFamily: f.sans,
                  border: `1.5px solid ${sighashType === "simplicity" ? c.accent : c.border}`,
                  background: sighashType === "simplicity" ? c.accentDim : c.bg,
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: sighashType === "simplicity" ? c.accent : c.text }}>
                    Simplicity-specific SIGhash
                  </span>
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
                    color: c.accent, background: c.accentDim,
                    padding: "2px 7px", borderRadius: 4,
                  }}>LIQUID NATIVE</span>
                </div>
                <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.6, marginBottom: 8 }}>
                  Uses Simplicity's own transaction introspection jets. Your signature cryptographically binds to the exact Simplicity program hash — tighter contract guarantees, but requires a Simplicity-aware signer.
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                  {["Jade (Liquid)", "Blockstream signing API"].map(hw => (
                    <span key={hw} style={{
                      fontSize: 10, color: c.sub, background: c.surfaceRaised,
                      padding: "2px 8px", borderRadius: 4, fontFamily: f.mono,
                    }}>{hw}</span>
                  ))}
                </div>
              </button>

              {/* comparison note */}
              <div style={{
                background: c.surfaceRaised, borderRadius: 8, padding: 12, marginBottom: 20,
                border: `1px solid ${c.border}`,
              }}>
                <div style={{ fontSize: 10, color: c.mute, lineHeight: 1.7 }}>
                  <span style={{ color: c.positive, fontWeight: 600 }}>Standard</span> — wallet shows human-readable tx fields; signs with standard Taproot flow.<br />
                  <span style={{ color: c.accent, fontWeight: 600 }}>Simplicity-specific</span> — wallet must evaluate Simplicity jets to produce the sighash; currently Blockstream/Liquid orbit only.
                </div>
              </div>

              <Btn
                primary
                disabled={!sighashType}
                onClick={() => { setShowSighashSheet(false); confirmMatch(); }}
              >
                {sighashType
                  ? `Continue with ${sighashType === "standard" ? "Standard" : "Simplicity-specific"} SIGhash →`
                  : "Select a SIGhash type to continue"}
              </Btn>
              <Btn ghost onClick={() => setShowSighashSheet(false)} s={{ marginTop: 10 }}>
                Cancel
              </Btn>
            </div>
          </div>
        )}
        {!matchedLender && (
          <Btn ghost onClick={() => { setMatching(false); setMatchProgress(0); }} s={{ border: `1px solid ${c.border}` }}>Cancel</Btn>
        )}
      </div>
    );
  }

  // ── Borrow / Earn toggle
  return (
    <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
      <div style={{ marginTop: 4, marginBottom: 16 }}><ModeToggle /></div>

      {mode === "earn" ? (
        <>
          <div style={{ marginBottom: 16 }}>
            <div style={{ width: 32, height: 2, background: c.info, borderRadius: 1, marginBottom: 14 }} />
            <div style={{ fontSize: 20, fontWeight: 300, color: c.text, fontFamily: f.display, lineHeight: 1.3 }}>
              Earn yield.<br />No hypothecation.
            </div>
            <div style={{ fontSize: 11, color: c.mute, marginTop: 8 }}>Lend to borrowers · BTC collateral backs every loan · Earn interest</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
            {[
              { label: "Open offers", value: `${openOffers.length}`, col: c.text },
              { label: "Avg rate", value: "4.1%", col: c.positive },
              { label: "Total vol", value: "$133K", col: c.info },
            ].map(({ label, value, col }) => (
              <Card key={label} s={{ padding: 12 }}>
                <Label s={{ marginBottom: 6, fontSize: 9 }}>{label}</Label>
                <div style={{ fontSize: 16, fontWeight: 600, color: col, fontFamily: f.mono }}>{value}</div>
              </Card>
            ))}
          </div>
          <Label s={{ marginBottom: 8 }}>Open loan requests</Label>
          {openOffers.map(offer => (
            <Card key={offer.id} s={{ marginBottom: 8, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: c.info, fontFamily: f.mono }}>{offer.borrower}</span>
                <Badge text={offer.posted} color={c.mute} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <Num s={{ fontSize: 18 }}>${offer.principal.toLocaleString()}</Num>
                <span style={{ fontSize: 14, fontWeight: 600, color: c.positive, fontFamily: f.mono }}>{offer.rate}%</span>
              </div>
              <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: c.mute }}><span style={{ color: c.sub }}>{offer.collateral} BTC</span> collateral</div>
                <div style={{ fontSize: 10, color: c.mute }}><span style={{ color: c.sub }}>{offer.duration}d</span> term</div>
                <div style={{ fontSize: 10, color: c.mute }}><span style={{ color: c.sub }}>{offer.ltv}%</span> LTV</div>
              </div>
              <Btn compact onClick={() => {}} s={{ width: "100%" }}>Fund this loan — earn {offer.rate}% APR</Btn>
            </Card>
          ))}
        </>
      ) : (
        <>
          <div style={{ marginBottom: 16 }}>
            <div style={{ width: 32, height: 2, background: c.accent, borderRadius: 1, marginBottom: 14 }} />
            <div style={{ fontSize: 20, fontWeight: 300, color: c.text, fontFamily: f.display, lineHeight: 1.3 }}>
              Lock BTC. Borrow USDT.<br />Repay by a fixed date.
            </div>
            <div style={{ fontSize: 11, color: c.mute, marginTop: 8 }}>Fixed terms · No surprises · No margin calls · Peer-to-peer</div>
          </div>
          <Card s={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <Label>Collateral</Label>
              <span style={{ fontSize: 10, color: c.mute, fontFamily: f.mono }}>{vaultBal.toFixed(4)} avail.</span>
            </div>
            <input type="range" min={0} max={Math.floor(vaultBal * 10000)} value={Math.round(collBtc * 10000)}
              onChange={e => setCollBtc(Number(e.target.value) / 10000)}
              style={{ width: "100%", accentColor: c.accent, marginBottom: 12, height: 2 }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <Num>{collBtc.toFixed(4)} <span style={{ fontSize: 13, color: c.mute }}>BTC</span></Num>
              <span style={{ fontSize: 12, color: c.mute, fontFamily: f.mono }}>${(collBtc * BTC_PRICE).toLocaleString("en", { maximumFractionDigits: 0 })}</span>
            </div>
          </Card>
          <Card s={{ marginBottom: 12 }}>
            <Label s={{ marginBottom: 10 }}>Duration</Label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6 }}>
              {[30, 90, 180, 365].map(d => (
                <button key={d} onClick={() => setDurDays(d)} style={{
                  padding: "10px 0", borderRadius: 4, fontSize: 12, fontWeight: 500,
                  border: `1px solid ${durDays === d ? c.accent : c.border}`,
                  background: durDays === d ? c.accentDim : "transparent",
                  color: durDays === d ? c.accent : c.mute, cursor: "pointer", fontFamily: f.mono,
                  transition: "all 0.15s",
                }}>{d === 365 ? "1yr" : d === 180 ? "6mo" : `${d}d`}</button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: c.mute, marginTop: 8, fontFamily: f.mono }}>
              Expires {new Date(Date.now() + durDays * 86400000).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </div>
          </Card>
          <Card s={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <Label>Interest rate</Label>
              <span style={{ fontSize: 10, color: c.mute }}>Higher = faster match</span>
            </div>
            <input type="range" min={10} max={80} value={Math.round(rate * 10)}
              onChange={e => setRate(Number(e.target.value) / 10)}
              style={{ width: "100%", accentColor: rate <= 3 ? c.positive : rate <= 5 ? c.accent : c.negative, marginBottom: 12, height: 2 }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <Num color={rate <= 3 ? c.positive : rate <= 5 ? c.accent : c.negative}>
                {rate.toFixed(1)}% <span style={{ fontSize: 13, color: c.mute }}>APR</span>
              </Num>
              <span style={{ fontSize: 10, color: c.mute, fontFamily: f.mono }}>Market ~3-4%</span>
            </div>
          </Card>
          <Card s={{ marginBottom: 16 }}>
            <Label s={{ marginBottom: 10 }}>Summary</Label>
            <Row label="You lock" value={`${collBtc.toFixed(4)} BTC`} color={c.accent} accent />
            <Row label="You receive" value={`$${Math.round(principal).toLocaleString()} USDT`} color={c.positive} accent />
            <Row label="LTV" value="30%" />
            <Row label="Duration" value={`${durDays}d`} />
            <Row label="Interest" value={`$${Math.round(interest).toLocaleString()}`} />
            <Row label="Total to repay" value={`$${Math.round(totalRepay).toLocaleString()}`} color={c.accent} accent />
            <div style={{ marginTop: 8, fontSize: 11, color: c.positive, fontWeight: 500 }}>✓ Not a taxable event</div>
          </Card>
          <Btn primary disabled={collBtc <= 0} onClick={startMatching}>
            Post offer — ${Math.round(principal).toLocaleString()}
          </Btn>
          <div style={{ fontSize: 10, color: c.mute, marginTop: 8 }}>Your offer is matched with a lender automatically</div>
        </>
      )}
    </div>
  );
};
