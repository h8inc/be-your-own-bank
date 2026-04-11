import { useState } from "react";
import { c, f } from "./lib/theme";
import { BTC_PRICE, EUR_RATE } from "./lib/constants";
import { Shell, StatusBar, NavBar } from "./components/layout";
import { Label, Num, Card, Btn, Back, Badge, Row, LockedOverlay } from "./components/ui";
import { HomeScreen } from "./screens/Home";
import { LendingScreen } from "./screens/Lending";
import { CardScreen } from "./screens/CardScreen";
import { PlannerScreen } from "./screens/planner";
import { DepositScreen } from "./screens/DepositScreen";
import { VaultScreen } from "./screens/VaultScreen";
import { RepayScreen } from "./screens/RepayScreen";
import { AddCollateralScreen } from "./screens/AddCollateralScreen";
import { SettingsScreen } from "./screens/SettingsScreen";

export default function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletType, setWalletType] = useState<string | null>(null);
  const [vaultBal, setVaultBal] = useState(1.2450);
  // Non-connected users start on the Plan tab — the freemium hook
  const [screen, setScreen] = useState("planner");
  const [hasCard, setHasCard] = useState(false);
  const [activeLoan, setActiveLoan] = useState<any>(null);
  const [cardBal, setCardBal] = useState(0);
  // Manual BTC entry for non-connected users exploring the planner
  const [manualBtc, setManualBtc] = useState<number>(0);
  // Wallet connection flow shown inside the app (not a gate)
  const [showConnect, setShowConnect] = useState(false);

  const go = (s: string) => setScreen(s);
  const resetAll = () => {
    setWalletConnected(false); setWalletType(null); setVaultBal(1.2450);
    setScreen("planner"); setHasCard(false); setActiveLoan(null); setCardBal(0);
    setManualBtc(0);
  };
  const resetCard = () => { setHasCard(false); setCardBal(0); };

  /** The BTC balance the Planner uses — real vault or manual input */
  const effectiveBtc = walletConnected ? vaultBal : manualBtc;

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
  const isGated = !walletConnected && ["home", "lending", "deposit", "vault", "repay", "add-collateral"].includes(screen);

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
                  Save. Borrow. Spend. Without giving up your Bitcoin.
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  <Badge text="Self-custody" color={c.info} />
                  <Badge text="Your keys" color={c.mute} />
                  <Badge text="Your Bitcoin" color={c.positive} />
                </div>
              </div>

              <Label s={{ marginBottom: 12 }}>Connect wallet</Label>
              <div style={{ fontSize: 11, color: c.mute, marginBottom: 12, lineHeight: 1.5 }}>
                Standard BIP-341 taproot signing. Any Liquid-capable wallet works — no custom firmware needed.
              </div>
              {[
                { id: "jade", name: "Blockstream Jade", sub: "Bluetooth · Hardware key", tag: "Full support", tc: c.positive },
                { id: "ledger", name: "Ledger", sub: "USB · Hardware key", tag: "Full support", tc: c.positive },
                { id: "bitbox", name: "BitBox02", sub: "USB-C · Liquid taproot", tag: "Full support", tc: c.positive },
                { id: "keystone", name: "Keystone", sub: "Air-gapped · QR signing", tag: "QR signing", tc: c.info },
                { id: "trezor", name: "Trezor", sub: "Via SideSwap bridge", tag: "Bridge", tc: c.info },
                { id: "seedsigner", name: "SeedSigner / DIY", sub: "Air-gapped · PSBT compatible", tag: "PSBT", tc: c.info },
                { id: "hot", name: "Hot wallet", sub: "Keys on this device · Fastest", tag: "Built-in", tc: c.accent },
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
                Your keys never leave your device. We can't access or move your Bitcoin — only you can.
              </div>
            </>
          ) : (
            <>
              <div style={{ marginTop: 24 }}>
                <Back onClick={() => setWalletType(null)} label="Choose different wallet" />
              </div>
              <Label s={{ marginBottom: 16 }}>
                {walletType === "hot" ? "Creating wallet" : `Connecting ${walletType === "jade" ? "Jade" : "Ledger"}`}
              </Label>
              <div style={{ marginBottom: 24 }}>
                {[
                  walletType === "hot" ? "Wallet created" : "Device detected",
                  "Setting up your account",
                  "Syncing balances",
                  "Ready to go",
                ].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center" }}>
                    <div style={{ width: 18, height: 18, borderRadius: 9, background: c.positiveDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 10, color: c.positive, fontFamily: f.mono }}>✓</span>
                    </div>
                    <span style={{ fontSize: 13, color: c.sub }}>{step}</span>
                  </div>
                ))}
              </div>
              {walletType === "hot" && (
                <Card glow={c.accentSoft} s={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: c.accent, fontWeight: 600, marginBottom: 6 }}>Back up your seed phrase</div>
                  <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.5 }}>
                    12 words. Write them down. Store offline. Lose this backup and your funds are gone.
                  </div>
                </Card>
              )}
              <Card s={{ marginBottom: 24 }}>
                <Label s={{ marginBottom: 10 }}>Balances found</Label>
                <Row label="L-BTC" value={`${vaultBal.toFixed(4)} BTC`} color={c.accent} accent />
                <Row label="L-USDT" value="0.00 USDT" />
                <Row label="Total" value={`€${(vaultBal * BTC_PRICE * EUR_RATE).toLocaleString("en", { maximumFractionDigits: 0 })}`} color={c.positive} accent />
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
        return <HomeScreen vaultBal={vaultBal} cardBal={cardBal} activeLoan={activeLoan} hasCard={hasCard} go={go} />;
      case "lending":
        return <LendingScreen vaultBal={vaultBal} activeLoan={activeLoan} setActiveLoan={setActiveLoan} setVaultBal={setVaultBal as any} setCardBal={setCardBal} go={go} />;
      case "planner":
        return (
          <PlannerScreen
            vaultBal={effectiveBtc}
            walletConnected={walletConnected}
            manualBtc={manualBtc}
            setManualBtc={setManualBtc}
            onConnect={startConnect}
          />
        );
      case "card":
        return <CardScreen hasCard={hasCard} setHasCard={setHasCard} cardBal={cardBal} resetCard={resetCard} go={go} />;
      case "deposit":
        return <DepositScreen setVaultBal={setVaultBal as any} go={go} />;
      case "vault":
        return <VaultScreen vaultBal={vaultBal} activeLoan={activeLoan} go={go} />;
      case "repay":
        return <RepayScreen activeLoan={activeLoan} setActiveLoan={setActiveLoan} setVaultBal={setVaultBal as any} setCardBal={setCardBal} go={go} />;
      case "add-collateral":
        return <AddCollateralScreen vaultBal={vaultBal} activeLoan={activeLoan} setActiveLoan={setActiveLoan} setVaultBal={setVaultBal as any} go={go} />;
      case "settings":
        return <SettingsScreen walletType={walletType} setWalletConnected={setWalletConnected} setWalletType={setWalletType} resetAll={resetAll} />;
      default:
        return (
          <PlannerScreen
            vaultBal={effectiveBtc}
            walletConnected={walletConnected}
            manualBtc={manualBtc}
            setManualBtc={setManualBtc}
            onConnect={startConnect}
          />
        );
    }
  };

  const tabMap: Record<string, string> = {
    home: "home", deposit: "home", vault: "home",
    lending: "lending", repay: "lending", "add-collateral": "lending",
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
            title={screen === "lending" ? "Earn & Borrow" : screen === "home" ? "Your Portfolio" : "Vault"}
            subtitle={
              screen === "lending"
                ? "Connect a wallet to access P2P lending, borrow against your BTC, and earn yield."
                : screen === "home"
                ? "Connect a wallet to see your holdings, balances, and manage your vault."
                : "Connect a wallet to deposit, withdraw, and manage collateral."
            }
            onConnect={startConnect}
          />
        )}
      </div>
      <NavBar active={tabMap[screen] || "planner"} go={go} />
    </Shell>
  );
}
