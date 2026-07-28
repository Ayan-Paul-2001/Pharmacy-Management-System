'use client'

import { useState } from 'react'
import { RoleShell } from '@/components/RoleShell'

export default function ReportsPage() {
  const [toast, setToast] = useState('')

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  function downloadCSV(reportName: string, data: string) {
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${reportName}_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    notify(`Exported ${reportName}.csv successfully`)
  }

  return (
    <RoleShell role="owner" title="Analytics & Reports">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Financial Analytics & Record Export</div>
          <h1>Business Reports Engine</h1>
          <p>Generate, filter, print, and export comprehensive sales, inventory valuation, expiry, and profit/loss data.</p>
        </div>
      </div>

      <div className="report-grid">
        <div className="report-card">
          <div className="report-icon blue">⌁</div>
          <div>
            <h2>Sales Revenue & Invoices Report</h2>
            <p>Detailed breakdown of gross sales, discounts, taxes, and payment channels (POS, Online, Cash, bKash).</p>
            <span>Format: CSV / Printable PDF</span>
          </div>
          <button
            onClick={() =>
              downloadCSV(
                'sales_revenue_report',
                'InvoiceNo,Date,Customer,TotalAmount,PaymentMethod,Tax\nINV-9821,2026-07-28,Walk-in,48.50,Cash,2.30\nINV-9820,2026-07-28,Sarah Mitchell,34.20,bKash,1.60\nINV-9819,2026-07-27,David Miller,112.00,Card,5.33'
              )
            }
          >
            ⤓
          </button>
        </div>

        <div className="report-card">
          <div className="report-icon mint">◇</div>
          <div>
            <h2>Inventory Valuation & Stock Summary</h2>
            <p>Full stock count, purchase valuation, selling value, reorder recommendations, and batch numbers.</p>
            <span>Format: CSV / Printable PDF</span>
          </div>
          <button
            onClick={() =>
              downloadCSV(
                'inventory_valuation_report',
                'MedicineID,Name,Category,StockQty,PurchasePrice,SellingPrice,Valuation\nMED-1001,Amoxicillin 500mg,Antibiotics,145,8.50,12.40,1798.00\nMED-1002,Paracetamol 500mg,Pain relief,320,2.10,4.80,1536.00'
              )
            }
          >
            ⤓
          </button>
        </div>

        <div className="report-card">
          <div className="report-icon amber">◷</div>
          <div>
            <h2>Expiry & Damaged Stock Analysis</h2>
            <p>Analysis of medicines nearing expiration date within 30/60/90 days and damaged write-off records.</p>
            <span>Format: CSV / Printable PDF</span>
          </div>
          <button
            onClick={() =>
              downloadCSV(
                'expiry_analysis_report',
                'MedicineID,Name,BatchNo,ExpiryDate,Quantity,RiskLevel\nMED-1005,Atorvastatin 20mg,BAT-882,2026-08-18,12,High Expiry Risk\nMED-1003,Metformin 850mg,BAT-441,2026-11-20,18,Medium Risk'
              )
            }
          >
            ⤓
          </button>
        </div>

        <div className="report-card">
          <div className="report-icon lavender">▱</div>
          <div>
            <h2>Profit & Loss (P&L) Statement</h2>
            <p>Gross sales vs Cost of Goods Sold (COGS), operating expenses, staff payroll, and net profit margins.</p>
            <span>Format: CSV / Financial Ledger</span>
          </div>
          <button
            onClick={() =>
              downloadCSV(
                'profit_and_loss_statement',
                'Category,Amount\nGross Sales Revenue,12840.50\nCost of Goods Sold (COGS),9193.80\nGross Profit,3646.70\nStaff Salaries,12200.00\nNet Operating Margin,28.4%'
              )
            }
          >
            ⤓
          </button>
        </div>
      </div>

      <div className="panel export-panel" style={{ padding: 24, borderRadius: 12 }}>
        <div>
          <h2>Need Custom Date Range Reports?</h2>
          <p>Export custom quarterly or annual audit statements for tax filing & regulatory bodies.</p>
        </div>
        <button
          className="primary"
          onClick={() =>
            downloadCSV(
              'annual_audit_report',
              'Period,TotalSales,TotalPurchases,TaxPaid,NetProfit\nQ1 2026,145200.00,98400.00,7260.00,39540.00\nQ2 2026,162800.00,105200.00,8140.00,49460.00'
            )
          }
        >
          Export Full Year CSV <span>⤓</span>
        </button>
      </div>

      {toast && (
        <div className="toast">
          <span>✓</span>
          {toast}
        </div>
      )}
    </RoleShell>
  )
}
