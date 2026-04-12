import { useState } from "react";
import { c, f } from "./lib/theme";
import type { Holding } from "./lib/constants";
import { DEFAULT_HOLDINGS } from "./lib/constants";
import { Shell, StatusBar, NavBar } from "./components/layout";
import { Label, Card, Btn, Back, Badge, Row, LockedOverlay } from "./components/ui";
import { HomeScreen } from "./screens/Home";
import { LendingScreen } from "./screens/Lending";
import { CardScreen } from "./screens/CardScreen";
import { PlannerScreen } from "./screens/planner";
import { DepositScreen } from "./screens/DepositScreen";
import { SettingsScreen } from "./screens/SettingsScreen";

export default function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletType, setWalletType] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState("0x7a3b...4f2e");
  const [holdings, setHoldings] = useState<Holding[]>(DEFAULT_HOLDINGS);
  // Non-connected users start on the Plan tab — the freemium hook
  const [screen, setScreen] = useState("planner");
  const [hasCard, setHasCard] = useState(false);
  const [activeLoan, setActiveLoan] = useState<any>(null);
  const [cardBal, setCardBal] = useState(0);
  // Manual holdings entry for non-connected users exploring the planner
  const [manualBtc, setManualBtc] = useState<number>(0);
  // Wallet connection flow shown inside the app (not a gate)
  const [showConnect, setShowConnect] = useState(false);

  const go = (s: string) => setScreen(s);
  const resetAll = () => {
    setWalletConnected(false);
    setWalletType(null);
    setWalletAddress("0x7a3b...4f2e");
    setHoldings(DEFAULT_HOLDINGS);
    setScreen("planner");
    setHasCard(false);
    setActiveLoan(null);
    setCardBal(0);
    setManualBtc(0);
  };

  /** Trigger wallet connect flow */
  const startConnect = () => {
    setShowConnect(true);
    setWalletType(null);
  };

  /** After successful connection, land on Home */
  const completeConnection = () => {
    setWalletConnected(true);
    setShowConnect(false);
    setScreen("home");
  };

  /** Is the current screen gated? */
  const isGated = !walletConnected && ["home", "credit", "deposit"].includes(screen);

  // ── Wallet connection flow (shown as overlay inside the shell)
  if (showConnect) {
    return (
      <Shell>
        <StatusBar />
        <div style={{ flex: 1, padding: "0 24px", overflowY: "auto" }}>
          {!walletType ? (
            <>
              <div style={{ marginTop: 40, marginBottom: 40 }}>
                <Back onClick={() => { setShowConnect(false); }} label="Back to app" />
                <div style={{ width: 32, height: 3, background: c.accent, borderRadius: 1, marginBottom: 20 }} />
                <div style={{ fontSize: 28, fontWeight: 300, color: c.text, lineHeight: 1.25, fontFamily: f.display, letterSpacing: "-0.02em" }}>
                  Save. Borrow.<br />Spend.
                </div>
                <div style={{ fontSize: 14, color: c.sub, marginTop: 14, lineHeight: 1.6 }}>
                  Your keys, your crypto, your bank. Connect your wallet to get started.
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  <Badge text="Self-custody" color={c.info} />
                  <Badge text="Private" color={c.mute} />
                  <Badge text="Multi-asset" color={c.positive} />
                </div>
              </div>

              <Label s={{ marginBottom: 12 }}>Connect wallet</Label>
              <div style={{ fontSize: 11, color: c.mute, marginBottom: 12, lineHeight: 1.5 }}>
                Ethereum mainnet. Your wallet controls your assets — we construct transactions, your wallet signs them.
              </div>
              {[
                { id: "metamask", name: "MetaMask", sub: "Browser extension · Most popular", tag: "Recommended", tc: c.positive },
                { id: "ledger", name: "Ledger", sub: "Hardware wallet · Maximum security", tag: "Secure", tc: c.positive },
                { id: "walletconnect", name: "WalletConnect", sub: "Mobile wallet · Scan QR", tag: "Flexible", tc: c.info },
              ].map(w => (
                <button key={w.id} onClick={() => setWalletType(w.id)} style={{
                  width: "100%", background: c.surface, border: `1px solid ${c.border}`,
                  borderRadius: 6, padding: "14px 16px", cursor: "pointer", textAlign: "left" as const,
                  marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center",
                  transition: "border-color 0.2s",
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: c.text, marginBottom: 2 }}>{w.name}</div>
                    <div style={{ fontSize: 11, color: c.mute }}>{w.sub}</div>
                  </div>
                  <Badge text={w.tag} color={w.tc} />
                </button>
              ))}
              <div style={{ marginTop: 24, fontSize: 11, color: c.mute, lineHeight: 1.6, paddingBottom: 20 }}>
                Your keys never leave your device. We construct transactions — your wallet signs them.
              </div>
            </>
          ) : (
            <>
              <div style={{ marginTop: 24 }}>
                <Back onClick={() => setWalletType(null)} label="Choose different wallet" />
              </div>
              <Label s={{ marginBottom: 16 }}>
                {walletType === "metamask" ? "Connecting MetaMask" : walletType === "ledger" ? "Connecting Ledger" : "Scanning QR code"}
              </Label>
              <div style={{ marginBottom: 24 }}>
                {[
                  walletType === "ledger" ? "Device detected" : "Wallet connected",
                  "Reading on-chain balances",
                  "Checking Aave positions",
                  "Ready",
                ].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center" }}>
                    <div style={{ width: 18, height: 18, borderRadius: 9, background: c.positiveDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 10, color: c.positive, fontFamily: f.mono }}>✓</span>
                    </div>
                    <span style={{ fontSize: 13, color: c.sub }}>{step}</span>
                  </div>
                ))}
              </div>
              <Card s={{ marginBottom: 24 }}>
                <Label s={{ marginBottom: 10 }}>Balances found</Label>
                {holdings.map((holding, idx) => {
                  const assetSymbol = holding.assetId;
                  const amountDisplay = holding.amount.toFixed(holding.assetId === "BTC" ? 4 : 2);
                  return (
                    <Row key={idx} label={assetSymbol} value={`${amountDisplay} ${assetSymbol}`} color={c.accent} accent={idx === 0} />
                  );
                })}
              </Card>
              <Btn primary onClick={completeConnection}>Continue</Btn>
            </>
          )}
        </div>
      </Shell>
    );
  }

  // ── Screen router
  const renderScreen = () => {
    switch (screen) {
      case "home":
        return <HomeScreen holdings={holdings} activeLoan={activeLoan} hasCard={hasCard} go={go} />;
      case "credit":
        return <LendingScreen holdings={holdings} activeLoan={activeLoan} setActiveLoan={setActiveLoan} setHoldings={setHoldings} go={go} />;
      case "planner":
        return (
          <PlannerScreen
            holdings={holdings}
            walletConnected={walletConnected}
            manualBtc={manualBtc}
            setManualBtc={setManualBtc}
            onConnect={startConnect}
          />
        );
      case "card":
        return <CardScreen hasCard={hasCard} setHasCard={setHasCard} cardBal={cardBal} setCardBal={setCardBal} holdings={holdings} go={go} />;
      case "deposit":
        return <DepositScreen holdings={holdings} setHoldings={setHoldings} go={go} />;
      case "settings":
        return <SettingsScreen walletType={walletType} walletAddress={walletAddress} setWalletConnected={setWalletConnected} setWalletType={setWalletType} resetAll={resetAll} holdings={holdings} />;
      default:
        return (
          <PlannerScreen
            holdings={holdings}
            walletConnected={walletConnected}
            manualBtc={manualBtc}
            setManualBtc={setManualBtc}
            onConnect={startConnect}
          />
        );
    }
  };

  const tabMap: Record<string, string> = {
    home: "home",
    deposit: "home",
    credit: "credit",
    planner: "planner",
    card: "card",
    settings: "settings",
  };

  return (
    <Shell>
      <StatusBar />
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", position: "relative" }}>
        {renderScreen()}
        {/* Lock overlay for gated screens */}
        {isGated && (
          <LockedOverlay
            title={screen === "credit" ? "Credit" : screen === "home" ? "Your Portfolio" : "Deposit"}
            subtitle={
              screen === "credit"
                ? "Connect a wallet to borrow against your crypto on Aave and earn yields."
                : screen === "home"
                ? "Connect a wallet to see your holdings, balances, and manage your assets."
                : "Connect a wallet to add crypto to your self-custodial vault."
            }
            onConnect={startConnect}
          />
        )}
      </div>
      <NavBar active={tabMap[screen] || "planner"} go={go} />
    </Shell>
  );
}
