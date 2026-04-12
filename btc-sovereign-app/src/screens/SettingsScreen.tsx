import React, { useState } from "react";
import { c, f } from "../lib/theme";
import type { Holding } from "../lib/constants";
import { Label, Row, Card, Btn } from "../components/ui";

interface Props {
  walletType: string | null;
  walletAddress: string;
  setWalletConnected: (v: boolean) => void;
  setWalletType: (v: string | null) => void;
  resetAll: () => void;
  holdings: Holding[];
}

export const SettingsScreen: React.FC<Props> = ({
  walletType, walletAddress, setWalletConnected, setWalletType, resetAll, holdings,
}) => {
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const handleExport = (format: string) => {
    setExportStatus(`Exporting ${format}...`);
    setTimeout(() => setExportStatus(`${format} exported successfully`), 1500);
    setTimeout(() => setExportStatus(null), 3000);
  };

  // Railgun summary
  const shieldedHoldings = holdings.filter(h => h.shielded);
  const totalShielded = shieldedHoldings.length;

  // Truncate address
  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
      <div style={{ marginBottom: 24, marginTop: 4 }}>
        <Label s={{ marginBottom: 6 }}>Settings</Label>
        <div style={{ fontSize: 16, fontWeight: 400, color: c.text, fontFamily: f.display }}>Wallet & account</div>
      </div>

      {/* Wallet section */}
      <Card s={{ marginBottom: 12 }}>
        <Label s={{ marginBottom: 10 }}>Wallet</Label>
        <Row label="Connected" value={walletType ? "Yes" : "No"} color={walletType ? c.positive : c.mute} accent={!!walletType} />
        {walletType && (
          <>
            <Row label="Type" value={
              walletType === "metamask" ? "MetaMask" :
              walletType === "ledger" ? "Ledger" :
              walletType === "walletconnect" ? "WalletConnect" : walletType
            } color={c.positive} />
            <Row label="Address" value={truncateAddress(walletAddress)} />
          </>
        )}
      </Card>

      {/* Railgun section */}
      <Card s={{ marginBottom: 12 }}>
        <Label s={{ marginBottom: 10 }}>Privacy (Railgun)</Label>
        <Row label="Shielded assets" value={`${totalShielded} asset${totalShielded !== 1 ? "s" : ""}`} />
        <div style={{ fontSize: 11, color: c.mute, marginTop: 10, lineHeight: 1.5 }}>
          {shieldedHoldings.length > 0 ? (
            <>Your shielded holdings: {shieldedHoldings.map(h => `${h.amount.toFixed(2)} ${h.assetId}`).join(", ")}</>
          ) : (
            <>No shielded assets yet. Shield assets to protect your balance from public view.</>
          )}
        </div>
      </Card>

      {/* App info */}
      <Card s={{ marginBottom: 12 }}>
        <Label s={{ marginBottom: 10 }}>App</Label>
        <Row label="Version" value="0.1.0-ethereum" />
        <Row label="Network" value="Ethereum mainnet" />
        <Row label="Protocols" value="Aave + Railgun" />
      </Card>

      {/* Export & reports */}
      <Card s={{ marginBottom: 16 }}>
        <Label s={{ marginBottom: 10 }}>Export & reports</Label>
        <div style={{ fontSize: 11, color: c.mute, marginBottom: 12, lineHeight: 1.6 }}>
          Download your transaction history and generate reports for tax and accounting purposes.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          <Btn onClick={() => handleExport("CSV")} s={{ padding: "10px 12px", fontSize: 12 }}>Download CSV</Btn>
          <Btn onClick={() => handleExport("PDF")} s={{ padding: "10px 12px", fontSize: 12 }}>Download PDF</Btn>
          <Btn onClick={() => handleExport("SVG")} s={{ padding: "10px 12px", fontSize: 12 }}>Generate SVG</Btn>
          <Btn onClick={() => handleExport("Accountant")} s={{ padding: "10px 12px", fontSize: 12 }}>Send to accountant</Btn>
        </div>
        {exportStatus && (
          <div style={{ fontSize: 11, color: c.positive, textAlign: "center", padding: "8px 0", fontFamily: f.mono }}>
            {exportStatus}
          </div>
        )}
      </Card>

      {/* Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <Btn danger onClick={() => { setWalletConnected(false); setWalletType(null); }}>Disconnect</Btn>
        <Btn danger onClick={resetAll}>Reset all</Btn>
      </div>
      <div style={{ fontSize: 10, color: c.mute, marginTop: 8 }}>Reset clears holdings, positions, and card back to defaults.</div>
    </div>
  );
};
