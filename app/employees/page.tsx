'use client'

import { useState } from 'react'
import { RoleShell } from '@/components/RoleShell'

interface Employee {
  id: string
  name: string
  role: 'Pharmacist' | 'Senior Pharmacist' | 'POS Cashier' | 'Inventory Specialist'
  email: string
  phone: string
  salary: number
  joiningDate: string
  status: 'Active' | 'Disabled'
}

const initialEmployees: Employee[] = [
  { id: 'EMP-201', name: 'Jordan Lee', role: 'Senior Pharmacist', email: 'jordan.lee@northstar.com', phone: '+1 (555) 443-1029', salary: 4800, joiningDate: '2024-03-15', status: 'Active' },
  { id: 'EMP-202', name: 'Marcus Taylor', role: 'Pharmacist', email: 'marcus.t@northstar.com', phone: '+1 (555) 554-9812', salary: 4200, joiningDate: '2025-01-10', status: 'Active' },
  { id: 'EMP-203', name: 'Chloe Bennett', role: 'POS Cashier', email: 'chloe.b@northstar.com', phone: '+1 (555) 667-2341', salary: 3200, joiningDate: '2025-06-01', status: 'Active' },
]

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
  const [showAddModal, setShowAddModal] = useState(false)
  const [toast, setToast] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<'Pharmacist' | 'Senior Pharmacist' | 'POS Cashier' | 'Inventory Specialist'>('Pharmacist')
  const [salary, setSalary] = useState(4000)

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  function handleAddEmployee(e: React.FormEvent) {
    e.preventDefault()
    const emp: Employee = {
      id: 'EMP-' + Math.floor(200 + Math.random() * 800),
      name,
      email,
      phone,
      role,
      salary: Number(salary),
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'Active',
    }
    setEmployees([emp, ...employees])
    notify(`Hired ${name} as ${role}`)
    setShowAddModal(false)
  }

  function toggleStatus(id: string) {
    setEmployees(employees.map((e) => (e.id === id ? { ...e, status: e.status === 'Active' ? 'Disabled' : 'Active' } : e)))
    notify('Updated employee account status')
  }

  return (
    <RoleShell role="owner" title="Employee Administration">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Pharmacy Staff & Access Administration</div>
          <h1>Staff & Employee Management</h1>
          <p>Recruit pharmacists, assign system roles, track attendance, and manage payroll.</p>
        </div>
        <button className="primary" onClick={() => setShowAddModal(true)}>
          Hire Employee <span>＋</span>
        </button>
      </div>

      <div className="stat-strip three">
        <div>
          <span>Total Pharmacy Staff</span>
          <b>{employees.length} Employees</b>
          <em>Active staff accounts</em>
        </div>
        <div>
          <span>Monthly Staff Payroll</span>
          <b>${employees.reduce((acc, e) => acc + e.salary, 0).toLocaleString()} / mo</b>
          <em>Total salaries</em>
        </div>
        <div>
          <span>Licensed Pharmacists</span>
          <b className="mint-text">{employees.filter((e) => e.role.includes('Pharmacist')).length} Licensed</b>
          <em>Prescription authorized</em>
        </div>
      </div>

      <div className="panel table-panel">
        <div className="table-toolbar">
          <div>
            <h2>Staff Roster ({employees.length})</h2>
            <p>Administer operational permissions and status</p>
          </div>
        </div>

        <div className="data-table">
          <div className="table-row table-head">
            <span>Staff Name / ID</span>
            <span>Assigned Role</span>
            <span>Contact Information</span>
            <span>Monthly Salary</span>
            <span>Joining Date</span>
            <span style={{ textAlign: 'right' }}>Account Access</span>
          </div>

          {employees.map((e) => (
            <div className="table-row" key={e.id}>
              <div>
                <b style={{ color: '#1e293b' }}>{e.name}</b>
                <div style={{ fontSize: 10, color: '#64748b' }}>ID: {e.id}</div>
              </div>

              <span className="status blue">{e.role}</span>

              <div>
                <span>{e.email}</span>
                <div style={{ fontSize: 10, color: '#64748b' }}>{e.phone}</div>
              </div>

              <span style={{ fontWeight: 700, color: '#0f172a' }}>${e.salary.toLocaleString()} / mo</span>

              <span className="mono">{e.joiningDate}</span>

              <div style={{ textAlign: 'right' }}>
                <button
                  className="filter-btn"
                  style={{
                    background: e.status === 'Active' ? '#e8f8f1' : '#fff0f1',
                    color: e.status === 'Active' ? '#35ad80' : '#d75f69',
                    fontWeight: 700,
                  }}
                  onClick={() => toggleStatus(e.id)}
                >
                  {e.status === 'Active' ? '✓ Active' : '✕ Disabled'}
                </button>
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
            <h2>Add New Employee Account</h2>
            <p>Provision credentials for new pharmacy staff members.</p>

            <form onSubmit={handleAddEmployee}>
              <label style={{ fontSize: 11, color: '#475569' }}>
                Full Employee Name
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
                  Email Address
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="staff@northstar.com"
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
                    placeholder="+1 (555) 000-0000"
                    style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                  />
                </label>
              </div>

              <div className="form-two" style={{ marginTop: 10 }}>
                <label style={{ fontSize: 11, color: '#475569' }}>
                  System Role
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                  >
                    <option value="Pharmacist">Pharmacist</option>
                    <option value="Senior Pharmacist">Senior Pharmacist</option>
                    <option value="POS Cashier">POS Cashier</option>
                    <option value="Inventory Specialist">Inventory Specialist</option>
                  </select>
                </label>

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
                Provision Staff Account
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
