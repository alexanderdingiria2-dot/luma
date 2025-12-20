import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Luma – your smart friend for the kids\' room',
  description: 'Luma answers questions, listens, and playfully accompanies children through everyday life.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

