import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Luma – dein schlauer Freund fürs Kinderzimmer',
  description: 'Luma beantwortet Fragen, hört zu und begleitet Kinder spielerisch durch den Alltag.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}

