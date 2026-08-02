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

// Background Live Simulation (Facebook-Style Periodic Notifications)
const simulatedEvents = [
  {
    title: '🛒 Live POS Counter Sale',
    detail: 'Cashier Ayan Paul billed 2x Paracetamol 500mg (Invoice INV-' + Math.floor(1000 + Math.random() * 9000) + ') for ৳ 9.60.',
    type: 'mint' as const,
    link: '/owner/sales',
    avatarIcon: '🛒',
  },
  {
    title: '⚠️ Automatic Low Stock Warning',
    detail: 'Atorvastatin 20mg Tablet stock dropped to 10 units. Reorder recommended.',
    type: 'amber' as const,
    link: '/owner/inventory',
    avatarIcon: '📦',
  },
  {
    title: '📋 Prescription Order Verified',
    detail: 'Doctor Prescription RX-' + Math.floor(100 + Math.random() * 900) + ' approved for dispensing.',
    type: 'blue' as const,
    link: '/owner/prescriptions',
    avatarIcon: '💊',
  },
  {
    title: '💳 bKash Payment Received',
    detail: 'Customer online order #ORD-8822 paid ৳ 1,240.00 via bKash Merchant API.',
    type: 'mint' as const,
    link: '/owner/reports',
    avatarIcon: '📱',
  },
]

let simulationStarted = false

export function startLiveSimulation() {
  if (typeof window === 'undefined' || simulationStarted) return
  simulationStarted = true

  setInterval(() => {
    const randomEvent = simulatedEvents[Math.floor(Math.random() * simulatedEvents.length)]
    addLiveNotification(randomEvent)
  }, 22000) // Trigger realistic notification every 22 seconds
}
