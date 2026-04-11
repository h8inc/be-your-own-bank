import React, { useState } from "react";
import { c, f } from "../lib/theme";
import { Label, Row, Card, Btn } from "../components/ui";

interface Props {
  walletType: string | null;
  setWalletConnected: (v: boolean) => void;
  setWalletType: (v: string | null) => void;
  resetAll: () => void;
}

export const SettingsScreen: React.FC<Props> = ({ walletType, setWalletConnected, setWalletType, resetAll }) => {
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const handleExport = (format: string) => {
    setExportStatus(`Exporting ${format}...`);
    setTimeout(() => setExportStatus(`${format} exported successfully`), 1500);
    setTimeout(() => setExportStatus(null), 3000);
  };

  return (
    <div style={{ padding: "0 24px", flex: 1, overflowY: "auto", paddingBottom: 20 }}>
      <div style={{ marginBottom: 24, marginTop: 4 }}>
        <Label s={{ marginBottom: 6 }}>Account & admin</Label>
        <div style={{ fontSize: 16, fontWeight: 400, color: c.text, fontFamily: f.display }}>Your wallet & keys</div>
      </div>
      <Card s={{ marginBottom: 12 }}>
        <Label s={{ marginBottom: 10 }}>Wallet</Label>
        <Row label="Type" value={walletType === "jade" ? "Jade" : walletType === "ledger" ? "Ledger" : "Hot wallet"} color={c.positive} accent />
        <Row label="Connection" value={walletType === "hot" ? "On device" : walletType === "jade" ? "Bluetooth" : "USB"} />
      </Card>
      <Card s={{ marginBottom: 12 }}>
        <Label s={{ marginBottom: 10 }}>Security</Label>
        <Row label="Withdrawal delay" value="24h" />
        <Row label="Recovery keys" value="2-of-3" color={c.positive} accent />
        <Row label="Daily limit" value="10% of balance" />
      </Card>
      <Card s={{ marginBottom: 12 }}>
        <Label s={{ marginBottom: 10 }}>App</Label>
        <Row label="Version" value="0.1.0-alpha" />
      </Card>
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <Btn danger onClick={() => { setWalletConnected(false); setWalletType(null); }}>Disconnect</Btn>
        <Btn danger onClick={resetAll}>Reset all</Btn>
      </div>
      <div style={{ fontSize: 10, color: c.mute, marginTop: 8 }}>Reset clears savings, loans, card back to defaults.</div>
    </div>
  );
};
