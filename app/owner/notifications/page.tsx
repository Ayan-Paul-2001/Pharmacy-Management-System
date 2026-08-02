'use client'

import { useEffect, useState } from 'react'
import { RoleShell } from '@/components/RoleShell'
import {
  getLiveNotifications,
  clearNotification,
  clearAllNotifications,
  markAllNotificationsAsRead,
  LiveNotification,
} from '@/lib/notification-store'

export default function OwnerNotificationsPage() {
  const [alerts, setAlerts] = useState<LiveNotification[]>([])
  const [toast, setToast] = useState('')

  useEffect(() => {
    function load() {
      setAlerts(getLiveNotifications())
    }
    load()

    window.addEventListener('mediflow_notifications_changed', load)
    return () => window.removeEventListener('mediflow_notifications_changed', load)
  }, [])

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  function handleDismiss(id: string) {
    clearNotification(id)
    notify('Notification dismissed')
  }

  function handleClearAll() {
    clearAllNotifications()
    notify('All notifications cleared')
  }

  return (
    <RoleShell role="owner" title="System Notifications & Alerts">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Realtime Alerts & Event Stream</div>
          <h1>Notifications & System Events</h1>
          <p>Review real-time low stock warnings, prescription submissions, POS transactions, and audit logs.</p>
        </div>
        {alerts.length > 0 && (
          <button className="filter-btn" onClick={() => { markAllNotificationsAsRead(); notify('All notifications marked as read'); }}>
            ✓ Mark All As Read
          </button>
        )}
      </div>

      <div className="stat-strip three">
        <div>
          <span>Active System Alerts</span>
          <b>{alerts.length} Notifications</b>
          <em>Realtime stream</em>
        </div>
        <div>
          <span>Stock Warning Alerts</span>
          <b className="amber-text">{alerts.filter((a) => a.type === 'amber').length} Alerts</b>
          <em>Reorder required</em>
        </div>
        <div>
          <span>Action Required</span>
          <b className="blue-text">{alerts.filter((a) => a.type === 'blue' || !a.read).length} Unread</b>
          <em>Attention needed</em>
        </div>
      </div>

      <div className="panel table-panel">
        <div className="table-toolbar">
          <div>
            <h2>Notification Log ({alerts.length})</h2>
            <p>System events automatically logged in real time</p>
          </div>
          {alerts.length > 0 && (
            <button className="filter-btn" onClick={handleClearAll}>
              Clear All Logs
            </button>
          )}
        </div>

        <div className="data-table">
          <div className="table-row table-head">
            <span>Alert Category</span>
            <span>Title & Detail</span>
            <span>Time</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>

          {alerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8', fontSize: 13 }}>
              ✓ You're all caught up! No active system alerts or stock warnings.
            </div>
          ) : (
            alerts.map((a) => (
              <div
                className="table-row"
                key={a.id}
                style={{
                  background: a.read ? 'transparent' : 'rgba(37,99,235,0.06)',
                }}
              >
                <div>
                  <span className={`status ${a.type === 'amber' ? 'amber' : a.type === 'blue' ? 'blue' : 'mint'}`}>
                    {a.type === 'amber' ? '⚠️ Stock Warning' : a.type === 'blue' ? '📋 Task' : '✓ Activity'}
                  </span>
                </div>

                <div>
                  <b style={{ color: '#ffffff', fontSize: 13 }}>{a.title}</b>
                  <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 2 }}>{a.detail}</div>
                </div>

                <span style={{ color: '#94a3b8', fontSize: 11 }}>{a.timestamp}</span>

                <div style={{ textAlign: 'right', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  {a.link && (
                    <button
                      className="filter-btn"
                      style={{ padding: '4px 10px', color: '#60a5fa', borderColor: 'rgba(96,165,250,0.3)' }}
                      onClick={() => (window.location.href = a.link!)}
                    >
                      View Details →
                    </button>
                  )}
                  <button className="filter-btn" style={{ padding: '4px 10px' }} onClick={() => handleDismiss(a.id)}>
                    Dismiss
                  </button>
                </div>
              </div>
            ))
          )}
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
