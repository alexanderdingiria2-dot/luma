'use client'

import { useEffect, useRef } from 'react'
import { track } from '@/lib/analytics'

/**
 * Hook to track scroll depth events (25%, 50%, 75%)
 * Fires each event only once per pageview
 */
export function useScrollDepth(): void {
  const hasTracked25 = useRef(false)
  const hasTracked50 = useRef(false)
  const hasTracked75 = useRef(false)

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') {
      return
    }

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercentage = (scrollTop / documentHeight) * 100

      // Track 25% scroll
      if (scrollPercentage >= 25 && !hasTracked25.current) {
        track('scroll_25')
        hasTracked25.current = true
      }

      // Track 50% scroll
      if (scrollPercentage >= 50 && !hasTracked50.current) {
        track('scroll_50')
        hasTracked50.current = true
      }

      // Track 75% scroll
      if (scrollPercentage >= 75 && !hasTracked75.current) {
        track('scroll_75')
        hasTracked75.current = true
      }
    }

    // Throttle scroll events for better performance
    let ticking = false
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledHandleScroll, { passive: true })

    // Cleanup on unmount
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [])
}

