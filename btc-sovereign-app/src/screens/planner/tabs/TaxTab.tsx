import React from "react";
import { c, f } from "../../../lib/theme";
import { Card, Label, Btn } from "../../../components/ui";

const mockTxHistory = [
  { date: "2024-01-10", type: "Buy", amount: "0.3800 BTC", price: "$44,973", total: "$17,090" },
  { date: "2024-07-17", type: "Buy", amount: "0.0856 BTC", price: "$59,526", total: "$5,097" },
  { date: "2024-08-04", type: "Buy", amount: "0.2500 BTC", price: "$54,000", total: "$13,500" },
  { date: "2024-09-30", type: "Buy", amount: "0.4174 BTC", price: "$59,969", total: "$25,027" },
  { date: "2025-02-10", type: "Buy", amount: "0.1063 BTC", price: "$93,998", total: "$9,992" },
  { date: "2026-03-14", type: "Buy", amount: "0.0807 BTC", price: "$61,961", total: "$5,002" },
  { date: "2026-03-28", type: "Buy", amount: "0.0742 BTC", price: "$57,419", total: "$4,262" },
];

export const TaxTab: React.FC = () => (
  <>
    <Card s={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, color: c.text, lineHeight: 1.6, marginBottom: 8 }}>
        Borrowing against BTC is <span style={{ color: c.positive, fontWeight: 600 }}>not a taxable event</span>. You only owe taxes when you sell.
      </div>
      <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.6 }}>
        Your transaction history is available for export to your tax advisor or portfolio tracker.
      </div>
    </Card>

    <Card s={{ marginBottom: 12 }}>
      <Label s={{ marginBottom: 10 }}>Transaction history</Label>
      {mockTxHistory.map((tx, i) => (
        <div key={i} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "8px 0", borderBottom: i < mockTxHistory.length - 1 ? `1px solid ${c.borderSubtle}` : "none",
        }}>
          <div>
            <div style={{ fontSize: 12, color: c.text }}>{tx.type} {tx.amount}</div>
            <div style={{ fontSize: 10, color: c.mute }}>{tx.date} · {tx.price}/BTC</div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 500, color: c.sub, fontFamily: f.mono }}>{tx.total}</span>
        </div>
      ))}
    </Card>

    <Btn primary onClick={() => {
      const csv = "Date,Type,Amount,Price,Total\n" + mockTxHistory.map((t) => `${t.date},${t.type},${t.amount},${t.price},${t.total}`).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "btc-transactions.csv"; a.click();
      URL.revokeObjectURL(url);
    }}>
      Download transactions (CSV)
    </Btn>
    <div style={{ fontSize: 10, color: c.mute, marginTop: 8 }}>Compatible with Koinly, CoinTracker, and most tax software</div>

    <Card glow={c.positiveDim} s={{ marginTop: 12 }}>
      <div style={{ fontSize: 11, color: c.positive, fontWeight: 600, marginBottom: 4 }}>Tax-efficient strategy</div>
      <div style={{ fontSize: 11, color: c.mute, lineHeight: 1.6 }}>
        Borrow against your BTC instead of selling. Loan proceeds are not income. Repayment is not a disposal. Your BTC stays untouched — no capital gains triggered.
      </div>
    </Card>
  </>
);
