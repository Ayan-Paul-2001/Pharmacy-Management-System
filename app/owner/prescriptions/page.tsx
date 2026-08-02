'use client'

import { useEffect, useState } from 'react'
import { RoleShell } from '@/components/RoleShell'
import { getInitialOwnerStore, savePrescriptionsStore, PrescriptionQueueItem } from '@/lib/owner-store'

export default function OwnerPrescriptionsPage() {
  const [queue, setQueue] = useState<PrescriptionQueueItem[]>([])
  const [selectedRx, setSelectedRx] = useState<PrescriptionQueueItem | null>(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const store = getInitialOwnerStore()
    setQueue(store.prescriptions)
  }, [])

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  function updateStatus(id: string, newStatus: 'Approved' | 'Rejected') {
    const updated = queue.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    setQueue(updated)
    savePrescriptionsStore(updated)
    notify(`Prescription ${id} has been ${newStatus.toLowerCase()}`)
    setSelectedRx(null)
  }

  return (
    <RoleShell role="owner" title="Prescription Review Queue">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Rx Verification & Clinical Approval</div>
          <h1>Prescription Review Queue</h1>
          <p>Review customer uploaded prescriptions, verify doctor credentials, and approve orders for dispensing.</p>
        </div>
      </div>

      <div className="stat-strip three">
        <div>
          <span>Total Prescriptions</span>
          <b>{queue.length} Submissions</b>
          <em>Rx log</em>
        </div>
        <div>
          <span>Pending Approvals</span>
          <b className="amber-text">{queue.filter((q) => q.status === 'Pending').length} Pending</b>
          <em>Requires review</em>
        </div>
        <div>
          <span>Approved Rx Orders</span>
          <b className="mint-text">{queue.filter((q) => q.status === 'Approved').length} Approved</b>
          <em>Dispensed to customer</em>
        </div>
      </div>

      <div className="panel table-panel">
        <div className="table-toolbar">
          <div>
            <h2>Uploaded Prescriptions Queue ({queue.length})</h2>
            <p>Patient submissions requiring licensed owner/pharmacist sign-off</p>
          </div>
        </div>

        <div className="data-table">
          <div className="table-row table-head">
            <span>Rx ID / Submission Date</span>
            <span>Patient Name</span>
            <span>Prescribing Doctor</span>
            <span>Requested Medicine</span>
            <span>Verification Status</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>

          {queue.map((rx) => (
            <div className="table-row" key={rx.id}>
              <div>
                <b style={{ color: '#ffffff' }}>{rx.id}</b>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>Date: {rx.date}</div>
              </div>

              <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{rx.patientName}</span>

              <span style={{ fontSize: 11, color: '#94a3b8' }}>{rx.doctorName}</span>

              <div>
                <b style={{ fontSize: 12, color: '#ffffff' }}>{rx.medicineName}</b>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{rx.dosage}</div>
              </div>

              <div>
                <span className={`status ${rx.status === 'Approved' ? 'mint' : rx.status === 'Rejected' ? 'amber' : 'blue'}`}>
                  {rx.status === 'Approved' ? '✓ Approved' : rx.status === 'Rejected' ? '✕ Rejected' : '⏳ Pending Review'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                <button
                  className="filter-btn"
                  style={{ padding: '4px 8px' }}
                  onClick={() => setSelectedRx(rx)}
                >
                  Review Document
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      {selectedRx && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ width: 480 }}>
            <button className="close-modal-btn" onClick={() => setSelectedRx(null)}>
              ×
            </button>
            <h2>Prescription Review ({selectedRx.id})</h2>
            <p>Verify doctor registration number and patient prescription copy.</p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 14, margin: '14px 0' }}>
              <div style={{ fontSize: 12, marginBottom: 4 }}>
                <strong>Patient:</strong> {selectedRx.patientName}
              </div>
              <div style={{ fontSize: 12, marginBottom: 4 }}>
                <strong>Doctor:</strong> {selectedRx.doctorName}
              </div>
              <div style={{ fontSize: 12, marginBottom: 4 }}>
                <strong>Medicine & Dosage:</strong> {selectedRx.medicineName} ({selectedRx.dosage})
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 8 }}>
                Uploaded File: <code>doctor_prescription_copy_scan.pdf</code>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button
                className="primary"
                style={{ flex: 1, background: '#059669', borderColor: '#059669' }}
                onClick={() => updateStatus(selectedRx.id, 'Approved')}
              >
                ✓ Approve Prescription
              </button>
              <button
                className="filter-btn"
                style={{ flex: 1, color: '#de6870', borderColor: '#fca5a5' }}
                onClick={() => updateStatus(selectedRx.id, 'Rejected')}
              >
                ✕ Reject Rx
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
