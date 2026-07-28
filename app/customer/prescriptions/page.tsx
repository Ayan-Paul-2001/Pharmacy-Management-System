'use client'

import { useState } from 'react'
import { RoleShell } from '@/components/RoleShell'

export default function CustomerPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([
    { id: 'RX-901', doctor: 'Dr. Arthur Pendelton, MD', date: '2026-07-27', medicine: 'Amoxicillin 500mg', status: 'Approved' },
    { id: 'RX-884', doctor: 'Dr. Rebecca Vance, MD', date: '2026-06-12', medicine: 'Metformin 850mg', status: 'Approved' },
  ])

  const [showUpload, setShowUpload] = useState(false)
  const [docName, setDocName] = useState('')
  const [medName, setMedName] = useState('')
  const [toast, setToast] = useState('')

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    const newRx = {
      id: 'RX-' + Math.floor(900 + Math.random() * 100),
      doctor: docName || 'Dr. Doctor, MD',
      date: new Date().toISOString().split('T')[0],
      medicine: medName || 'Prescription Medicine',
      status: 'Pending',
    }
    setPrescriptions([newRx, ...prescriptions])
    notify('Prescription uploaded! Pending pharmacist verification.')
    setShowUpload(false)
  }

  return (
    <RoleShell role="customer" title="My Prescriptions">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Digital Prescription Wallet</div>
          <h1>My Doctor Prescriptions</h1>
          <p>Upload doctor prescriptions, view authorization records, and reorder prescription drugs.</p>
        </div>
        <button className="primary" onClick={() => setShowUpload(true)}>
          Upload Prescription <span>＋</span>
        </button>
      </div>

      <div className="panel table-panel">
        <div className="table-toolbar">
          <h2>Prescription History ({prescriptions.length})</h2>
        </div>

        <div className="data-table">
          <div className="table-row table-head">
            <span>Rx ID / Date</span>
            <span>Doctor Name</span>
            <span>Medicine Prescribed</span>
            <span style={{ textAlign: 'right' }}>Authorization Status</span>
          </div>

          {prescriptions.map((rx) => (
            <div className="table-row" key={rx.id}>
              <div>
                <b style={{ color: '#1e293b' }}>{rx.id}</b>
                <div style={{ fontSize: 10, color: '#64748b' }}>Uploaded: {rx.date}</div>
              </div>

              <span>{rx.doctor}</span>
              <b style={{ color: '#2563eb' }}>{rx.medicine}</b>

              <div style={{ textAlign: 'right' }}>
                <span className={`status ${rx.status === 'Approved' ? 'mint' : 'amber'}`}>
                  {rx.status === 'Approved' ? '✓ Approved by Pharmacist' : '⏳ Verification Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showUpload && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button className="close-modal-btn" onClick={() => setShowUpload(false)}>
              ×
            </button>
            <h2>Upload New Doctor Prescription</h2>
            <p>Upload a clear photo or PDF of your doctor prescription.</p>

            <form onSubmit={handleUpload}>
              <label style={{ fontSize: 11, color: '#475569' }}>
                Doctor Name / Hospital
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Dr. Arthur Pendelton"
                  style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                />
              </label>

              <label style={{ fontSize: 11, color: '#475569', marginTop: 10, display: 'block' }}>
                Prescribed Medicine Name
                <input
                  type="text"
                  required
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  placeholder="e.g. Amoxicillin 500mg"
                  style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                />
              </label>

              <div style={{ marginTop: 14, background: '#f8fafc', padding: 14, borderRadius: 8, border: '1px dashed #cbd5e1' }}>
                <label style={{ fontSize: 11, color: '#64748b', cursor: 'pointer' }}>
                  Select File (Image / PDF)
                  <input type="file" required accept="image/*,.pdf" style={{ marginTop: 6, display: 'block' }} />
                </label>
              </div>

              <button className="primary" style={{ width: '100%', marginTop: 18 }}>
                Submit for Verification
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast">
          <span>✓</span>
          {toast}
        </div>
      )}
    </RoleShell>
  )
}
