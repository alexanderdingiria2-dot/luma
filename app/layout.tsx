import type { Metadata } from 'next'
import './globals.css'
import { GoogleTagManager } from '@/lib/gtm'
import { GoogleAnalytics4 } from '@/lib/ga4'

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
      <body>
        <GoogleTagManager />
        <GoogleAnalytics4 />
        {children}
      </body>
    </html>
  )
}

