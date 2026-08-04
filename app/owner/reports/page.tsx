'use client'

import { useEffect, useState } from 'react'
import { RoleShell } from '@/components/RoleShell'
import { getInitialOwnerStore, TransactionItem, MedicineItem } from '@/lib/owner-store'
import { Download } from 'lucide-react'

export default function OwnerReportsPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([])
  const [medicines, setMedicines] = useState<MedicineItem[]>([])
  const [toast, setToast] = useState('')

  useEffect(() => {
    const store = getInitialOwnerStore()
    setTransactions(store.transactions)
    setMedicines(store.medicines)
  }, [])

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  const totalRevenue = transactions.reduce((acc, t) => acc + (t.totalAmount || 0), 0)
  const totalCost = medicines.reduce((acc, m) => acc + m.stockQuantity * m.purchasePrice, 0)
  const totalValuation = medicines.reduce((acc, m) => acc + m.stockQuantity * m.sellingPrice, 0)
  const estProfit = totalValuation - totalCost

  function exportCSVReport() {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Type,Customer,Items,Total,PaymentMethod,Timestamp\n' +
      transactions.map((t) => `${t.id},${t.type},${t.customer},${t.items},${t.total},${t.paymentMethod || 'Cash'},${t.timestamp}`).join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `mediflow_executive_report_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    notify('Executive CSV Financial Report exported successfully!')
  }

  function getPaymentBadge(method: string = 'Cash') {
    const m = method.toLowerCase()
    let bg = 'rgba(56, 189, 248, 0.15)'
    let color = '#38bdf8'
    let border = '1px solid rgba(56, 189, 248, 0.3)'

    if (m.includes('cash')) {
      bg = 'rgba(52, 211, 153, 0.15)'
      color = '#34d399'
      border = '1px solid rgba(52, 211, 153, 0.3)'
    } else if (m.includes('bkash')) {
      bg = 'rgba(236, 72, 153, 0.15)'
      color = '#f472b6'
      border = '1px solid rgba(236, 72, 153, 0.3)'
    } else if (m.includes('nagad') || m.includes('rocket')) {
      bg = 'rgba(251, 191, 36, 0.15)'
      color = '#fbbf24'
      border = '1px solid rgba(251, 191, 36, 0.3)'
    }

    return (
      <span style={{ background: bg, color: color, border: border, padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, display: 'inline-block' }}>
        {method}
      </span>
    )
  }

  return (
    <RoleShell role="owner" title="Executive Financial Analytics">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Financial Audit & Business Intelligence</div>
          <h1>Executive Reports & Analytics</h1>
          <p>Analyze revenue breakdown, gross margin metrics, inventory valuation, and export tax reports.</p>
        </div>
        <button className="primary" onClick={exportCSVReport} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Download size={15} />
          <span>Export CSV Report</span>
        </button>
      </div>

      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-top">
            <span>Gross Revenue Recorded</span>
            <span className="trend mint">Live Sync</span>
          </div>
          <strong>৳ {totalRevenue > 0 ? totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '12,840.50'}</strong>
          <div className="metric-bottom">
            <span>{transactions.length} Total transactions</span>
            <span>Tax collected: ৳ {(totalRevenue * 0.05).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>Inventory Purchase Cost</span>
            <span className="trend blue">COGS Asset</span>
          </div>
          <strong>৳ {totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          <div className="metric-bottom">
            <span>{medicines.length} Cataloged SKUs</span>
            <span>Avg unit cost: ৳ {(totalCost / (medicines.length || 1)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>Estimated Gross Margin</span>
            <span className="trend mint">Profit Projection</span>
          </div>
          <strong>৳ {estProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          <div className="metric-bottom">
            <span>Total Valuation: ৳ {totalValuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span>Est. Margin: {totalValuation > 0 ? ((estProfit / totalValuation) * 100).toFixed(1) : 0}%</span>
          </div>
        </div>
      </div>

      <div className="panel table-panel" style={{ marginTop: 20 }}>
        <div className="table-toolbar">
          <div>
            <h2>Transaction Revenue Log ({transactions.length})</h2>
            <p>Full breakdown of sales transactions and payment channels</p>
          </div>
        </div>

        <div className="data-table">
          <div className="table-row table-head">
            <span>Invoice ID / Time</span>
            <span>Transaction Type</span>
            <span>Customer Name</span>
            <span>Payment Method</span>
            <span>Items Sold</span>
            <span>Amount Paid</span>
          </div>

          {transactions.map((t) => (
            <div className="table-row" key={t.id}>
              <div>
                <b style={{ color: '#ffffff', fontSize: 13, display: 'block' }}>{t.id}</b>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{t.time}</div>
              </div>

              <span style={{ color: '#e2e8f0' }}>{t.type}</span>

              <span style={{ color: '#e2e8f0' }}>{t.customer}</span>

              <div>
                {getPaymentBadge(t.paymentMethod || 'Cash')}
              </div>

              <span style={{ color: '#cbd5e1' }}>{t.items} items</span>

              <span style={{ fontWeight: 700, color: '#34d399', fontSize: 13 }}>{t.total}</span>
            </div>
          ))}
        </div>
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
