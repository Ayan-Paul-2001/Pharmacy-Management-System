'use client'

import { useEffect, useState } from 'react'
import { RoleShell } from '@/components/RoleShell'
import { getInitialOwnerStore, saveEmployeesStore, EmployeeRecord } from '@/lib/owner-store'

export default function OwnerEmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeRecord[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [toast, setToast] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<'Pharmacist' | 'Cashier' | 'Store Manager' | 'Inventory Lead'>('Pharmacist')
  const [shift, setShift] = useState<'Morning' | 'Evening' | 'Night'>('Morning')
  const [salary, setSalary] = useState(3000)

  useEffect(() => {
    const store = getInitialOwnerStore()
    setEmployees(store.employees)
  }, [])

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  function updateAndSaveEmployees(newEmployees: EmployeeRecord[]) {
    setEmployees(newEmployees)
    saveEmployeesStore(newEmployees)
  }

  function handleAddEmployee(e: React.FormEvent) {
    e.preventDefault()
    const newEmp: EmployeeRecord = {
      id: 'EMP-' + Math.floor(10 + Math.random() * 90),
      name: name || 'New Staff Member',
      role: role,
      email: email || 'staff@northstar.com',
      phone: phone || '+880 1715-000000',
      shift: shift,
      status: 'Active',
      salary: Number(salary) || 2500,
    }
    const updated = [newEmp, ...employees]
    updateAndSaveEmployees(updated)
    notify(`Added ${newEmp.name} to staff roster`)
    setShowAddModal(false)
    setName('')
    setEmail('')
    setPhone('')
  }

  return (
    <RoleShell role="owner" title="Employee Directory">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Human Resources & Staff Roster</div>
          <h1>Staff & Employee Management</h1>
          <p>Manage pharmacists, cashiers, shift schedules, salary packages, and active status.</p>
        </div>
        <button className="primary" onClick={() => setShowAddModal(true)}>
          Add Employee <span>＋</span>
        </button>
      </div>

      <div className="stat-strip three">
        <div>
          <span>Total Pharmacy Staff</span>
          <b>{employees.length} Employees</b>
          <em>Active workforce</em>
        </div>
        <div>
          <span>Licensed Pharmacists</span>
          <b className="blue-text">{employees.filter((e) => e.role === 'Pharmacist').length} Pharmacists</b>
          <em>Clinical staff</em>
        </div>
        <div>
          <span>Monthly Payroll Estimate</span>
          <b>৳{employees.reduce((acc, e) => acc + e.salary, 0).toLocaleString()}</b>
          <em>Monthly salary expense</em>
        </div>
      </div>

      <div className="panel table-panel">
        <div className="table-toolbar">
          <div>
            <h2>Staff Roster ({employees.length})</h2>
            <p>Role assignments, active shift schedules, and contact details</p>
          </div>
        </div>

        <div className="data-table">
          <div className="table-row table-head">
            <span>Employee Name / ID</span>
            <span>Assigned Role</span>
            <span>Work Shift</span>
            <span>Contact Lines</span>
            <span>Monthly Salary</span>
            <span>Status</span>
          </div>

          {employees.map((e) => (
            <div className="table-row" key={e.id}>
              <div>
                <b style={{ color: '#ffffff' }}>{e.name}</b>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>ID: {e.id}</div>
              </div>

              <div>
                <span className="status blue">{e.role}</span>
              </div>

              <span style={{ color: '#cbd5e1' }}>{e.shift} Shift</span>

              <div>
                <span className="mono" style={{ fontSize: 11, color: '#e2e8f0' }}>{e.phone}</span>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{e.email}</div>
              </div>

              <span style={{ fontWeight: 700, color: '#34d399' }}>৳{e.salary.toLocaleString()}</span>

              <div>
                <span className={`status ${e.status === 'Active' ? 'mint' : 'amber'}`}>
                  {e.status === 'Active' ? '✓ Active' : 'On Leave'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button className="close-modal-btn" onClick={() => setShowAddModal(false)}>
              ×
            </button>
            <h2>Add New Staff Member</h2>
            <p>Assign roles, shift schedules, and salary details.</p>

            <form onSubmit={handleAddEmployee}>
              <label style={{ fontSize: 11, color: '#475569' }}>
                Employee Full Name
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Lee"
                  style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                />
              </label>

              <div className="form-two" style={{ marginTop: 10 }}>
                <label style={{ fontSize: 11, color: '#475569' }}>
                  Work Role
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                  >
                    <option value="Pharmacist">Pharmacist</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Inventory Lead">Inventory Lead</option>
                    <option value="Store Manager">Store Manager</option>
                  </select>
                </label>

                <label style={{ fontSize: 11, color: '#475569' }}>
                  Shift Schedule
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as any)}
                    style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                  >
                    <option value="Morning">Morning Shift (08:00 - 16:00)</option>
                    <option value="Evening">Evening Shift (16:00 - 00:00)</option>
                    <option value="Night">Night Shift (00:00 - 08:00)</option>
                  </select>
                </label>
              </div>

              <div className="form-two" style={{ marginTop: 10 }}>
                <label style={{ fontSize: 11, color: '#475569' }}>
                  Email Address
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jordan.lee@northstar.com"
                    style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                  />
                </label>

                <label style={{ fontSize: 11, color: '#475569' }}>
                  Phone Number
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1715-112233"
                    style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                  />
                </label>
              </div>

              <div style={{ marginTop: 10 }}>
                <label style={{ fontSize: 11, color: '#475569' }}>
                  Monthly Salary ($)
                  <input
                    type="number"
                    required
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                  />
                </label>
              </div>

              <button className="primary" style={{ width: '100%', marginTop: 18 }}>
                Save Employee Record
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
