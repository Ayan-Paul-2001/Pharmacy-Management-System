'use client'

import { useState } from 'react'
import { RoleShell } from '@/components/RoleShell'

export default function EmployeeTasksPage() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Verify 3 pending doctor prescriptions in queue', category: 'Prescriptions', priority: 'High', done: false },
    { id: 2, text: 'Process online order #ORD-8821 for pickup', category: 'Fulfillment', priority: 'High', done: true },
    { id: 3, text: 'Restock Amoxicillin 500mg from warehouse', category: 'Inventory', priority: 'Medium', done: false },
    { id: 4, text: 'Perform end-of-shift register drawer count', category: 'Register', priority: 'Medium', done: false },
  ])

  const [newTaskText, setNewTaskText] = useState('')
  const [toast, setToast] = useState('')

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  function handleAddTask(e: React.FormEvent) {
    e.preventDefault()
    if (!newTaskText) return
    setTasks([...tasks, { id: Date.now(), text: newTaskText, category: 'General', priority: 'Normal', done: false }])
    notify('Added new shift task')
    setNewTaskText('')
  }

  return (
    <RoleShell role="employee" title="Shift Tasks">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Shift Operations & Task Tracking</div>
          <h1>My Daily Shift Tasks</h1>
          <p>Organize daily pharmacy operations, register counts, stock replenishments, and customer callbacks.</p>
        </div>
      </div>

      <div className="panel" style={{ maxWidth: 700, margin: '0 auto' }}>
        <form onSubmit={handleAddTask} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Add a new task for this shift..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            style={{ flex: 1, padding: 11, border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12 }}
          />
          <button className="primary">Add Task ＋</button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tasks.map((t) => (
            <div
              key={t.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: t.done ? '#f8fafc' : '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', flex: 1 }}>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => {
                    setTasks(tasks.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))
                    notify(t.done ? 'Task marked incomplete' : 'Completed task! Great job 🎉')
                  }}
                />
                <span style={{ fontSize: 13, textDecoration: t.done ? 'line-through' : 'none', color: t.done ? '#94a3b8' : '#1e293b' }}>
                  {t.text}
                </span>
              </label>

              <span className={`status ${t.priority === 'High' ? 'amber' : 'blue'}`} style={{ fontSize: 9 }}>
                {t.priority}
              </span>
            </div>
          ))}
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
