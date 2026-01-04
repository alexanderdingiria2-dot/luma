/**
 * Analytics Tracking Utility
 * 
 * Provides a type-safe interface for tracking events via Google Tag Manager.
 * All tracking happens client-side only.
 */

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
    gtag?: (
      command: 'config' | 'set' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void
  }
}

export interface TrackParams {
  [key: string]: string | number | boolean | undefined
}

/**
 * Tracks an event to Google Tag Manager dataLayer
 * 
 * @param eventName - The name of the event to track
 * @param params - Optional parameters to attach to the event
 * 
 * @example
 * track('cta_now_click', { location: 'hero' })
 * track('engagement_5s')
 */
export function track(eventName: string, params?: TrackParams): void {
  // SSR-safe: only run on client
  if (typeof window === 'undefined') {
    return
  }

  // Ensure dataLayer exists
  if (!window.dataLayer) {
    window.dataLayer = []
  }

  const eventData: Record<string, unknown> = {
    event: eventName,
    ...params,
  }

  // Push to dataLayer (for GTM)
  window.dataLayer.push(eventData)

  // Also send directly to GA4 via gtag if available
  if (window.gtag) {
    window.gtag('event', eventName, params || {})
  }

  // Debug mode: log to console if enabled
  const isDebug = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true'
  if (isDebug) {
    console.log('[Analytics]', eventName, params || {})
  }
}

