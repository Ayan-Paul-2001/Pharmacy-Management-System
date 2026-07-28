'use client'

import { useState } from 'react'
import { RoleShell } from '@/components/RoleShell'

interface PrescriptionItem {
  id: string
  customerName: string
  doctorName: string
  hospital: string
  prescribedDate: string
  medicineRequested: string
  dosage: string
  status: 'Pending' | 'Approved' | 'Rejected'
  fileUrl: string
}

const initialRxList: PrescriptionItem[] = [
  { id: 'RX-901', customerName: 'Sarah Mitchell', doctorName: 'Dr. Arthur Pendelton, MD', hospital: 'City Central Hospital', prescribedDate: '2026-07-27', medicineRequested: 'Amoxicillin 500mg (20 Caps)', dosage: '1 capsule 3x daily after meals', status: 'Pending', fileUrl: '/pharma-hero.png' },
  { id: 'RX-902', customerName: 'David Miller', doctorName: 'Dr. Rebecca Vance, MD', hospital: 'Northwest Medical Center', prescribedDate: '2026-07-26', medicineRequested: 'Metformin 850mg (60 Tabs)', dosage: '1 tablet 2x daily with meals', status: 'Approved', fileUrl: '/pharma-hero.png' },
  { id: 'RX-903', customerName: 'Emily Watson', doctorName: 'Dr. Jonathan Blake, MD', hospital: 'St. Jude Clinic', prescribedDate: '2026-07-25', medicineRequested: 'Atorvastatin 20mg (30 Tabs)', dosage: '1 tablet at bedtime', status: 'Pending', fileUrl: '/pharma-hero.png' },
]

export default function PrescriptionsPage() {
  const [rxList, setRxList] = useState<PrescriptionItem[]>(initialRxList)
  const [viewingRx, setViewingRx] = useState<PrescriptionItem | null>(null)
  const [toast, setToast] = useState('')

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  function handleApprove(id: string) {
    setRxList(rxList.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r)))
    notify(`Approved prescription ${id}`)
    setViewingRx(null)
  }

  function handleReject(id: string) {
    setRxList(rxList.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r)))
    notify(`Rejected prescription ${id}`)
    setViewingRx(null)
  }

  return (
    <RoleShell role="owner" title="Prescription Verification">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Regulatory Compliance & Doctor Verification</div>
          <h1>Prescription Approvals</h1>
          <p>Review customer uploaded doctor prescriptions, verify validity, and authorize medicine sales.</p>
        </div>
      </div>

      <div className="stat-strip three">
        <div>
          <span>Pending Verifications</span>
          <b className="amber-text">{rxList.filter((r) => r.status === 'Pending').length} Action Required</b>
          <em>Awaiting pharmacist review</em>
        </div>
        <div>
          <span>Approved Prescriptions</span>
          <b className="mint-text">{rxList.filter((r) => r.status === 'Approved').length} Approved</b>
          <em>Authorized for sale</em>
        </div>
        <div>
          <span>Compliance Score</span>
          <b>100% Audit Ready</b>
          <em>Full digital records kept</em>
        </div>
      </div>

      <div className="panel table-panel">
        <div className="table-toolbar">
          <div>
            <h2>Uploaded Prescriptions ({rxList.length})</h2>
            <p>Select any prescription to view original document scan and doctor credentials</p>
          </div>
        </div>

        <div className="data-table">
          <div className="table-row table-head">
            <span>Rx ID / Date</span>
            <span>Patient / Customer</span>
            <span>Doctor & Hospital</span>
            <span>Requested Medicine</span>
            <span>Status</span>
            <span style={{ textAlign: 'right' }}>Review Action</span>
          </div>

          {rxList.map((rx) => (
            <div className="table-row" key={rx.id}>
              <div>
                <b style={{ color: '#1e293b' }}>{rx.id}</b>
                <div style={{ fontSize: 10, color: '#64748b' }}>Date: {rx.prescribedDate}</div>
              </div>

              <span style={{ fontWeight: 600 }}>{rx.customerName}</span>

              <div>
                <span>{rx.doctorName}</span>
                <div style={{ fontSize: 10, color: '#64748b' }}>{rx.hospital}</div>
              </div>

              <div>
                <b style={{ color: '#2563eb' }}>{rx.medicineRequested}</b>
                <div style={{ fontSize: 10, color: '#64748b' }}>Dosage: {rx.dosage}</div>
              </div>

              <div>
                {rx.status === 'Approved' ? (
                  <span className="status mint">✓ Approved</span>
                ) : rx.status === 'Rejected' ? (
                  <span className="status red">✕ Rejected</span>
                ) : (
                  <span className="status amber">⏳ Pending Verification</span>
                )}
              </div>

              <div style={{ textAlign: 'right' }}>
                <button className="filter-btn" style={{ background: '#edf4ff', color: '#2563eb' }} onClick={() => setViewingRx(rx)}>
                  Review Document
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Prescription Document Modal */}
      {viewingRx && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ width: 500 }}>
            <button className="close-modal-btn" onClick={() => setViewingRx(null)}>
              ×
            </button>

            <h2>Review Prescription #{viewingRx.id}</h2>
            <p>
              Uploaded by <strong>{viewingRx.customerName}</strong> on {viewingRx.prescribedDate}
            </p>

            <div
              style={{
                height: 180,
                background: '#091220',
                borderRadius: 10,
                overflow: 'hidden',
                position: 'relative',
                marginBottom: 16,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <img src={viewingRx.fileUrl} alt="Prescription Document" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              <div
                style={{
                  position: 'absolute',
                  bottom: 10,
                  left: 10,
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: 10,
                  fontFamily: 'DM Mono',
                }}
              >
                📜 Verified Scan Image Attached
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: 14, borderRadius: 8, fontSize: 11, marginBottom: 16 }}>
              <div style={{ margin: '4px 0' }}>
                <strong>Doctor:</strong> {viewingRx.doctorName} ({viewingRx.hospital})
              </div>
              <div style={{ margin: '4px 0' }}>
                <strong>Medicine:</strong> {viewingRx.medicineRequested}
              </div>
              <div style={{ margin: '4px 0' }}>
                <strong>Instructions:</strong> {viewingRx.dosage}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="primary" style={{ flex: 1, background: '#35ad80' }} onClick={() => handleApprove(viewingRx.id)}>
                ✓ Approve & Authorize Sale
              </button>

              <button
                className="filter-btn"
                style={{ flex: 1, color: '#de6870', borderColor: '#fca5a5' }}
                onClick={() => handleReject(viewingRx.id)}
              >
                ✕ Reject Request
              </button>
            </div>
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
