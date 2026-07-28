'use client'

import { useState } from 'react'
import { RoleShell } from '@/components/RoleShell'

export default function CustomerWishlistPage() {
  const [items, setItems] = useState([
    { id: '1', name: 'Vitamin D3 1000IU Softgel', price: 11.8, inStock: true },
    { id: '2', name: 'Paracetamol 500mg Tablet', price: 4.8, inStock: true },
  ])

  return (
    <RoleShell role="customer" title="Saved Medicines Wishlist">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Saved Items for Reordering</div>
          <h1>My Saved Wishlist</h1>
          <p>Quickly reorder your frequently purchased vitamins, supplements, and OTC medicines.</p>
        </div>
      </div>

      <div className="customer-shop-grid">
        {items.map((i) => (
          <div className="portal-card" key={i.id}>
            <h2>{i.name}</h2>
            <strong style={{ color: '#2563eb', font: '800 18px Manrope', marginTop: 10 }}>${i.price.toFixed(2)}</strong>
            <button className="primary" style={{ marginTop: 14 }}>
              Reorder Now ＋
            </button>
          </div>
        ))}
      </div>
    </RoleShell>
  )
}
