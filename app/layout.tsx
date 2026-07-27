import './globals.css'

export const metadata = { title: 'Mediflow — Pharmacy, in rhythm.', description: 'A calm operating system for modern pharmacies.' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}
