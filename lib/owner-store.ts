'use client'

export interface MedicineItem {
  id: string
  barcode: string
  name: string
  genericName: string
  brand: string
  manufacturer: string
  category: string
  purchasePrice: number
  sellingPrice: number
  taxRate: number
  stockQuantity: number
  reorderLevel: number
  expiryDate: string
  storage: string
  requiresPrescription: boolean
  image: string
}

export interface TransactionItem {
  id: string
  type: string
  customer: string
  items: number
  total: string
  totalAmount: number
  status: string
  time: string
  paymentMethod: string
  timestamp: string
}

export interface PurchaseOrder {
  id: string
  supplier: string
  itemsCount: number
  total: number
  status: 'Pending' | 'Ordered' | 'Received' | 'Cancelled'
  date: string
}

export interface SupplierItem {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  category: string
  status: 'Active' | 'Inactive'
  totalOrders: number
}

export interface CustomerRecord {
  id: string
  name: string
  email: string
  phone: string
  tier: 'Gold' | 'Silver' | 'Platinum' | 'Regular'
  totalSpent: number
  ordersCount: number
  joinedDate: string
}

export interface EmployeeRecord {
  id: string
  name: string
  role: 'Pharmacist' | 'Cashier' | 'Store Manager' | 'Inventory Lead'
  email: string
  phone: string
  shift: 'Morning' | 'Evening' | 'Night'
  status: 'Active' | 'On Leave'
  salary: number
}

export interface PrescriptionQueueItem {
  id: string
  patientName: string
  doctorName: string
  medicineName: string
  dosage: string
  status: 'Pending' | 'Approved' | 'Rejected'
  date: string
  imageUrl: string
}

const defaultMedicines: MedicineItem[] = [
  {
    id: 'MED-1001',
    barcode: '8901234567890',
    name: 'Amoxicillin 500mg Capsule',
    genericName: 'Amoxicillin Trihydrate',
    brand: 'Amoxil',
    manufacturer: 'GSK Pharmaceuticals',
    category: 'Antibiotics',
    purchasePrice: 8.5,
    sellingPrice: 12.4,
    taxRate: 5,
    stockQuantity: 145,
    reorderLevel: 30,
    expiryDate: '2027-08-15',
    storage: 'Store below 25°C',
    requiresPrescription: true,
    image: '/pharma-hero.png',
  },
  {
    id: 'MED-1002',
    barcode: '8901234567891',
    name: 'Paracetamol 500mg Tablet',
    genericName: 'Acetaminophen',
    brand: 'Panadol',
    manufacturer: 'Haleon Healthcare',
    category: 'Pain Relief',
    purchasePrice: 2.1,
    sellingPrice: 4.8,
    taxRate: 5,
    stockQuantity: 320,
    reorderLevel: 50,
    expiryDate: '2028-02-10',
    storage: 'Store in a dry place',
    requiresPrescription: false,
    image: '/pharma-hero.png',
  },
  {
    id: 'MED-1003',
    barcode: '8901234567892',
    name: 'Metformin 850mg Tablet',
    genericName: 'Metformin Hydrochloride',
    brand: 'Glucophage',
    manufacturer: 'Merck Group',
    category: 'Diabetes',
    purchasePrice: 5.2,
    sellingPrice: 8.2,
    taxRate: 5,
    stockQuantity: 18,
    reorderLevel: 40,
    expiryDate: '2026-11-20',
    storage: 'Store below 30°C',
    requiresPrescription: true,
    image: '/pharma-hero.png',
  },
  {
    id: 'MED-1004',
    barcode: '8901234567893',
    name: 'Omeprazole 20mg Capsule',
    genericName: 'Omeprazole Magnesium',
    brand: 'Prilosec',
    manufacturer: 'AstraZeneca',
    category: 'Gastrointestinal',
    purchasePrice: 6.0,
    sellingPrice: 9.6,
    taxRate: 5,
    stockQuantity: 82,
    reorderLevel: 25,
    expiryDate: '2026-09-05',
    storage: 'Protect from light',
    requiresPrescription: false,
    image: '/pharma-hero.png',
  },
  {
    id: 'MED-1005',
    barcode: '8901234567894',
    name: 'Atorvastatin 20mg Tablet',
    genericName: 'Atorvastatin Calcium',
    brand: 'Lipitor',
    manufacturer: 'Pfizer Inc.',
    category: 'Cardiovascular',
    purchasePrice: 9.4,
    sellingPrice: 14.2,
    taxRate: 5,
    stockQuantity: 12,
    reorderLevel: 20,
    expiryDate: '2026-08-18',
    storage: 'Store below 25°C',
    requiresPrescription: true,
    image: '/pharma-hero.png',
  },
  {
    id: 'MED-1006',
    barcode: '8901234567895',
    name: 'Vitamin D3 1000IU Softgel',
    genericName: 'Cholecalciferol',
    brand: 'D-3 Vital',
    manufacturer: 'Bayer Healthcare',
    category: 'Supplements',
    purchasePrice: 7.0,
    sellingPrice: 11.8,
    taxRate: 5,
    stockQuantity: 210,
    reorderLevel: 35,
    expiryDate: '2027-12-30',
    storage: 'Store in cool place',
    requiresPrescription: false,
    image: '/pharma-hero.png',
  },
]

const defaultTransactions: TransactionItem[] = [
  { id: 'INV-9821', type: 'POS Sale', customer: 'Walk-in Customer', items: 3, total: '৳ 48.50', totalAmount: 48.5, status: 'Completed', time: '10 min ago', paymentMethod: 'Cash', timestamp: new Date().toISOString() },
  { id: 'INV-9820', type: 'Online Order', customer: 'Sarah Mitchell', items: 2, total: '৳ 34.20', totalAmount: 34.2, status: 'Processing', time: '24 min ago', paymentMethod: 'bKash', timestamp: new Date().toISOString() },
  { id: 'PO-4402', type: 'Supplier Purchase', customer: 'AstraZeneca Pharma', items: 150, total: '৳ 3,850.00', totalAmount: 3850.0, status: 'Received', time: '1 hr ago', paymentMethod: 'Bank Transfer', timestamp: new Date().toISOString() },
  { id: 'INV-9819', type: 'POS Sale', customer: 'David Miller', items: 5, total: '৳ 112.00', totalAmount: 112.0, status: 'Completed', time: '2 hrs ago', paymentMethod: 'Card', timestamp: new Date().toISOString() },
]

const defaultPurchases: PurchaseOrder[] = [
  { id: 'PO-4402', supplier: 'AstraZeneca Pharma', itemsCount: 150, total: 3850.0, status: 'Received', date: '2026-08-01' },
  { id: 'PO-4403', supplier: 'GSK Pharmaceuticals', itemsCount: 200, total: 2400.0, status: 'Ordered', date: '2026-08-02' },
  { id: 'PO-4404', supplier: 'Bayer Healthcare', itemsCount: 80, total: 1150.0, status: 'Pending', date: '2026-08-02' },
]

const defaultSuppliers: SupplierItem[] = [
  { id: 'SUP-01', name: 'GSK Pharmaceuticals', contactPerson: 'Robert Vance', email: 'orders@gsk.com', phone: '+880 1711-002233', category: 'Antibiotics & Rx', status: 'Active', totalOrders: 28 },
  { id: 'SUP-02', name: 'AstraZeneca Bangladesh', contactPerson: 'Helen Davis', email: 'supply@az.com', phone: '+880 1819-445566', category: 'Cardiovascular & Gastro', status: 'Active', totalOrders: 34 },
  { id: 'SUP-03', name: 'Bayer Healthcare', contactPerson: 'Michael Chang', email: 'sales@bayer.com', phone: '+880 1912-778899', category: 'Supplements & OTC', status: 'Active', totalOrders: 19 },
]

const defaultCustomers: CustomerRecord[] = [
  { id: 'CUST-101', name: 'Sarah Mitchell', email: 'sarah.mitchell@email.com', phone: '+880 1712-345678', tier: 'Gold', totalSpent: 1420.5, ordersCount: 18, joinedDate: '2025-03-12' },
  { id: 'CUST-102', name: 'David Miller', email: 'david.m@gmail.com', phone: '+880 1815-998877', tier: 'Platinum', totalSpent: 2890.0, ordersCount: 32, joinedDate: '2024-11-05' },
  { id: 'CUST-103', name: 'Emily Watson', email: 'emily.w@yahoo.com', phone: '+880 1913-223344', tier: 'Silver', totalSpent: 560.25, ordersCount: 8, joinedDate: '2025-08-20' },
]

const defaultEmployees: EmployeeRecord[] = [
  { id: 'EMP-01', name: 'Jordan Lee', role: 'Pharmacist', email: 'jordan.lee@northstar.com', phone: '+880 1715-112233', shift: 'Morning', status: 'Active', salary: 3500 },
  { id: 'EMP-02', name: 'Tariq Ahmed', role: 'Cashier', email: 'tariq@northstar.com', phone: '+880 1812-445566', shift: 'Evening', status: 'Active', salary: 2200 },
  { id: 'EMP-03', name: 'Nusrat Jahan', role: 'Inventory Lead', email: 'nusrat@northstar.com', phone: '+880 1911-889900', shift: 'Morning', status: 'Active', salary: 2800 },
]

const defaultPrescriptions: PrescriptionQueueItem[] = [
  { id: 'RX-901', patientName: 'Sarah Mitchell', doctorName: 'Dr. K. Rahman (Cardiologist)', medicineName: 'Atorvastatin 20mg', dosage: '1 tablet daily at night', status: 'Pending', date: '2026-08-02', imageUrl: '/pharma-hero.png' },
  { id: 'RX-902', patientName: 'Kamal Hossain', doctorName: 'Dr. M. Chowdhury (ENT)', medicineName: 'Amoxicillin 500mg', dosage: '1 capsule 8 hourly for 7 days', status: 'Approved', date: '2026-08-01', imageUrl: '/pharma-hero.png' },
]

export function getInitialOwnerStore() {
  if (typeof window === 'undefined') {
    return {
      medicines: defaultMedicines,
      transactions: defaultTransactions,
      purchases: defaultPurchases,
      suppliers: defaultSuppliers,
      customers: defaultCustomers,
      employees: defaultEmployees,
      prescriptions: defaultPrescriptions,
    }
  }

  const storedMeds = localStorage.getItem('mediflow_medicines')
  const storedTx = localStorage.getItem('mediflow_transactions')
  const storedPurchases = localStorage.getItem('mediflow_purchases')
  const storedSuppliers = localStorage.getItem('mediflow_suppliers')
  const storedCustomers = localStorage.getItem('mediflow_customers')
  const storedEmployees = localStorage.getItem('mediflow_employees')
  const storedRx = localStorage.getItem('mediflow_prescriptions_queue')

  return {
    medicines: storedMeds ? JSON.parse(storedMeds) : defaultMedicines,
    transactions: storedTx ? JSON.parse(storedTx) : defaultTransactions,
    purchases: storedPurchases ? JSON.parse(storedPurchases) : defaultPurchases,
    suppliers: storedSuppliers ? JSON.parse(storedSuppliers) : defaultSuppliers,
    customers: storedCustomers ? JSON.parse(storedCustomers) : defaultCustomers,
    employees: storedEmployees ? JSON.parse(storedEmployees) : defaultEmployees,
    prescriptions: storedRx ? JSON.parse(storedRx) : defaultPrescriptions,
  }
}

export function saveMedicinesStore(meds: MedicineItem[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mediflow_medicines', JSON.stringify(meds))
  }
}

export function saveTransactionsStore(txs: TransactionItem[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mediflow_transactions', JSON.stringify(txs))
  }
}

export function savePurchasesStore(purchases: PurchaseOrder[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mediflow_purchases', JSON.stringify(purchases))
  }
}

export function saveSuppliersStore(suppliers: SupplierItem[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mediflow_suppliers', JSON.stringify(suppliers))
  }
}

export function saveCustomersStore(customers: CustomerRecord[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mediflow_customers', JSON.stringify(customers))
  }
}

export function saveEmployeesStore(employees: EmployeeRecord[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mediflow_employees', JSON.stringify(employees))
  }
}

export interface CategoryItem {
  id: string
  name: string
  description: string
  color: string
  icon: string
  itemCount?: number
}

export const defaultCategories: CategoryItem[] = [
  { id: 'CAT-1', name: 'Antibiotics', description: 'Anti-bacterial medication & prescription drugs', color: '#38bdf8', icon: 'Pill' },
  { id: 'CAT-2', name: 'Pain Relief', description: 'Analgesics, antipyretics & anti-inflammatory tablets', color: '#34d399', icon: 'Stethoscope' },
  { id: 'CAT-3', name: 'Diabetes', description: 'Insulin & blood sugar regulation therapies', color: '#f87171', icon: 'Activity' },
  { id: 'CAT-4', name: 'Cardiovascular', description: 'Heart, cholesterol & blood pressure medications', color: '#c084fc', icon: 'Heart' },
  { id: 'CAT-5', name: 'Gastrointestinal', description: 'Antacids, PPIs & digestive health formulations', color: '#fbbf24', icon: 'TestTube' },
  { id: 'CAT-6', name: 'Supplements', description: 'Multivitamins, minerals & immune boosters', color: '#4ade80', icon: 'Sparkles' },
]

export function getCategoriesStore(): CategoryItem[] {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('mediflow_categories')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (e) {}
    }
  }
  return defaultCategories
}

export function saveCategoriesStore(cats: CategoryItem[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mediflow_categories', JSON.stringify(cats))
  }
}

export function savePrescriptionsStore(prescriptions: PrescriptionQueueItem[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mediflow_prescriptions_queue', JSON.stringify(prescriptions))
  }
}
