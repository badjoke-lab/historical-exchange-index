export type AnalyticsEventParams = Record<string, string | number | boolean>

type GtagFunction = (
  command: 'event',
  eventName: string,
  params: AnalyticsEventParams,
) => void

declare global {
  interface Window {
    gtag?: GtagFunction
  }
}

export function trackAnalyticsEvent(eventName: string, params: AnalyticsEventParams) {
  if (typeof window === 'undefined') return
  window.gtag?.('event', eventName, params)
}
