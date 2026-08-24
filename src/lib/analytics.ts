export type AnalyticsEvent = "place_view" | "whatsapp_click" | "direction_click" | "collaboration_click" | "add_place_click";

export function trackEvent(event: AnalyticsEvent, placeId?: string): void {
  if (process.env.NODE_ENV !== "production") console.log("[analytics]", { event, placeId, timestamp: new Date().toISOString() });
}
