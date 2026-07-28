'use client'

import Link from 'next/link'
import { RoleShell, RoleIntro, PortalCard } from '@/components/RoleShell'

export default function CustomerDashboard() {
  return (
    <RoleShell role="customer" title="Home">
      <RoleIntro
        kicker="Customer Room · Gold Member Account"
        title="Welcome back, Sarah Mitchell ✦"
        description="Your trusted online pharmacy, doctor prescriptions, order history, and reward points — all in one calm place."
        action="Shop Medicines"
      />

      {/* Reward Points Banner */}
      <div className="customer-banner" style={{ marginBottom: 28 }}>
        <div>
          <span className="eyebrow" style={{ color: '#93c5fd' }}>
            ★ Gold Tier Member
          </span>
          <h2>You’ve earned 240 Reward Points</h2>
          <p>Redeem 100 points on your next order for $10 discount off eligible items.</p>
        </div>
        <div className="points-ring">
          <b>240</b>
          <span>points</span>
        </div>
      </div>

      <div className="portal-section-title">
        <div>
          <h2>Your Personal Care Hub</h2>
          <p>Everything you need for a simpler healthcare experience.</p>
        </div>
      </div>

      <div className="portal-grid">
        <PortalCard
          href="/customer/shop"
          icon="⌕"
          title="Online Pharmacy Shop"
          description="Browse OTC medicines, prescription drugs, and health supplements."
          metric="1,248 products available"
        />
        <PortalCard
          href="/customer/orders"
          icon="◌"
          title="My Active Orders"
          description="Track live order status, delivery progress, and purchase history."
          metric="1 order in progress"
        />
        <PortalCard
          href="/customer/prescriptions"
          icon="▤"
          title="My Prescriptions"
          description="Upload new doctor prescriptions and track authorization status."
          metric="2 approved prescriptions"
        />
        <PortalCard
          href="/customer/invoices"
          icon="▤"
          title="Invoices & Receipts"
          description="Download digital tax receipts from past purchases."
          metric="24 digital receipts"
        />
      </div>
    </RoleShell>
  )
}
