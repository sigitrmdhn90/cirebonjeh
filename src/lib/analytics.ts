export type AnalyticsEvent = "place_view" | "whatsapp_click" | "direction_click" | "collaboration_click" | "add_place_click" | "add_place_start" | "add_place_step_completed" | "add_place_location_selected" | "add_place_submit" | "add_place_success" | "add_place_error";

export function trackEvent(event: AnalyticsEvent, placeId?: string): void {
  if (process.env.NODE_ENV !== "production") console.log("[analytics]", { event, placeId, timestamp: new Date().toISOString() });
}