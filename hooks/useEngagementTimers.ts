'use client'

import { useEffect, useRef } from 'react'
import { track } from '@/lib/analytics'

/**
 * Hook to track engagement time events (5s and 10s)
 * Fires each event only once per pageview
 */
export function useEngagementTimers(): void {
  const hasTracked5s = useRef(false)
  const hasTracked10s = useRef(false)

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') {
      return
    }

    // Track 5s engagement
    const timer5s = setTimeout(() => {
      if (!hasTracked5s.current) {
        track('engagement_5s')
        hasTracked5s.current = true
      }
    }, 5000)

    // Track 10s engagement
    const timer10s = setTimeout(() => {
      if (!hasTracked10s.current) {
        track('engagement_10s')
        hasTracked10s.current = true
      }
    }, 10000)

    // Cleanup timers on unmount
    return () => {
      clearTimeout(timer5s)
      clearTimeout(timer10s)
    }
  }, [])
}

