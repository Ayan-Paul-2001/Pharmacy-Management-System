'use client'

import { RoleShell } from '@/components/RoleShell'

export default function CustomerInvoicesPage() {
  const invoices = [
    { id: 'INV-9820', date: '2026-07-28', items: 2, total: 34.2, tax: 1.6, payment: 'bKash Online' },
    { id: 'INV-8790', date: '2026-07-15', items: 2, total: 23.6, tax: 1.1, payment: 'Credit Card' },
    { id: 'INV-8640', date: '2026-06-20', items: 1, total: 9.6, tax: 0.4, payment: 'Cash' },
  ]

  return (
    <RoleShell role="customer" title="Invoices & Receipts">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Tax Receipts & Payment Records</div>
          <h1>My Purchase Receipts</h1>
          <p>Download and print digital tax invoices for health insurance claims.</p>
        </div>
      </div>

      <div className="panel table-panel">
        <div className="table-toolbar">
          <h2>Tax Invoices ({invoices.length})</h2>
        </div>

        <div className="data-table">
          <div className="table-row table-head">
            <span>Invoice # / Date</span>
            <span>Items Included</span>
            <span>VAT Tax Paid</span>
            <span>Total Amount</span>
            <span style={{ textAlign: 'right' }}>Receipt Download</span>
          </div>

          {invoices.map((inv) => (
            <div className="table-row" key={inv.id}>
              <div>
                <b style={{ color: '#1e293b' }}>{inv.id}</b>
                <div style={{ fontSize: 10, color: '#64748b' }}>{inv.date}</div>
              </div>

              <span>{inv.items} items</span>
              <span>${inv.tax.toFixed(2)}</span>

              <b style={{ color: '#2563eb' }}>${inv.total.toFixed(2)}</b>

              <div style={{ textAlign: 'right' }}>
                <button className="filter-btn" style={{ background: '#edf4ff', color: '#2563eb' }} onClick={() => window.print()}>
                  🖨️ Print Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RoleShell>
  )
}
