'use client'

export interface LiveNotification {
  id: string
  title: string
  detail: string
  type: 'amber' | 'blue' | 'mint'
  timestamp: string
  read: boolean
  link?: string
  avatarIcon?: string
}

const defaultLiveNotifications: LiveNotification[] = [
  {
    id: 'NOTIF-101',
    title: '⚠️ Low Stock Alert',
    detail: 'Omeprazole 20mg Capsule has only 12 units remaining (Reorder limit: 25).',
    type: 'amber',
    timestamp: '2m ago',
    read: false,
    link: '/owner/inventory',
    avatarIcon: '📦',
  },
  {
    id: 'NOTIF-102',
    title: '📋 Prescription Uploaded',
    detail: 'Sarah Mitchell uploaded doctor prescription RX-901 for review.',
    type: 'blue',
    timestamp: '12m ago',
    read: false,
    link: '/owner/prescriptions',
    avatarIcon: '💊',
  },
  {
    id: 'NOTIF-103',
    title: '✓ Live POS Counter Sale',
    detail: 'Walk-in Sale INV-9821 processed for ৳ 48.50 via Cash.',
    type: 'mint',
    timestamp: '25m ago',
    read: true,
    link: '/owner/reports',
    avatarIcon: '🛒',
  },
  {
    id: 'NOTIF-104',
    title: '🚚 Supplier Order Shipped',
    detail: 'Purchase order PO-4402 from AstraZeneca is in transit.',
    type: 'blue',
    timestamp: '1h ago',
    read: true,
    link: '/owner/purchases',
    avatarIcon: '🚛',
  },
]

export function getLiveNotifications(): LiveNotification[] {
  if (typeof window === 'undefined') return defaultLiveNotifications

  const stored = localStorage.getItem('mediflow_live_notifications')
  if (!stored) {
    localStorage.setItem('mediflow_live_notifications', JSON.stringify(defaultLiveNotifications))
    return defaultLiveNotifications
  }

  try {
    return JSON.parse(stored)
  } catch {
    return defaultLiveNotifications
  }
}

export function saveLiveNotifications(items: LiveNotification[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem('mediflow_live_notifications', JSON.stringify(items))
  window.dispatchEvent(new CustomEvent('mediflow_notifications_changed'))
}

export function addLiveNotification(notif: Omit<LiveNotification, 'id' | 'timestamp' | 'read'>) {
  const current = getLiveNotifications()
  const newNotif: LiveNotification = {
    ...notif,
    id: 'NOTIF-' + Math.floor(1000 + Math.random() * 9000),
    timestamp: 'Just now',
    read: false,
    avatarIcon: notif.avatarIcon || (notif.type === 'amber' ? '⚠️' : notif.type === 'mint' ? '🛒' : '📋'),
  }
  const updated = [newNotif, ...current]
  saveLiveNotifications(updated)

  // Dispatch Facebook-style floating toast popup event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mediflow_new_toast', { detail: newNotif }))
  }

  return newNotif
}

export function markNotificationAsRead(id: string) {
  const current = getLiveNotifications()
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n))
  saveLiveNotifications(updated)
}

export function markAllNotificationsAsRead() {
  const current = getLiveNotifications()
  const updated = current.map((n) => ({ ...n, read: true }))
  saveLiveNotifications(updated)
}

export function clearNotification(id: string) {
  const current = getLiveNotifications()
  const updated = current.filter((n) => n.id !== id)
  saveLiveNotifications(updated)
}

export function clearAllNotifications() {
  saveLiveNotifications([])
}

// Background Live Simulation (Disabled - automatic simulated notifications turned off)
export function startLiveSimulation() {
  // Automatic periodic notification simulation disabled as requested
}
