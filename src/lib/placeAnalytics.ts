import { doc, getDoc, increment, runTransaction, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

const VISITOR_KEY = "cirebonjeh_visitor_id";

type CounterField = "views" | "whatsappClicks" | "directionClicks";

function report(error: unknown) {
  console.error("Tenant analytics gagal:", error);
}

function visitorId(): string {
  const existing = window.localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;
  const generated = typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(VISITOR_KEY, generated);
  return generated;
}

async function incrementCounter(placeId: string, field: CounterField): Promise<void> {
  if (!db || typeof window === "undefined") return;
  try {
    await updateDoc(doc(db, "places", placeId), { [field]: increment(1) });
  } catch (error) {
    report(error);
  }
}

export async function trackPlaceView(placeId: string): Promise<void> {
  if (!db || typeof window === "undefined") return;
  const key = `place-viewed-${placeId}`;
  if (window.sessionStorage.getItem(key)) return;
  window.sessionStorage.setItem(key, "true");
  try {
    await updateDoc(doc(db, "places", placeId), { views: increment(1) });
  } catch (error) {
    window.sessionStorage.removeItem(key);
    report(error);
  }
}

export function trackWhatsAppClick(placeId: string): void {
  void incrementCounter(placeId, "whatsappClicks");
}

export function trackDirectionClick(placeId: string): void {
  void incrementCounter(placeId, "directionClicks");
}

export async function getFavoriteStatus(placeId: string): Promise<boolean> {
  if (!db || typeof window === "undefined") return false;
  try {
    return (await getDoc(doc(db, "places", placeId, "favorites", visitorId()))).exists();
  } catch (error) {
    report(error);
    return false;
  }
}

export async function toggleFavorite(placeId: string): Promise<boolean> {
  if (!db || typeof window === "undefined") return false;
  const id = visitorId();
  const placeRef = doc(db, "places", placeId);
  const favoriteRef = doc(db, "places", placeId, "favorites", id);
  try {
    return await runTransaction(db, async (transaction) => {
      const [placeSnap, favoriteSnap] = await Promise.all([transaction.get(placeRef), transaction.get(favoriteRef)]);
      if (!placeSnap.exists()) throw new Error("UMKM tidak ditemukan.");
      const count = Math.max(0, Number(placeSnap.data().favoriteCount) || 0);
      if (favoriteSnap.exists()) {
        transaction.delete(favoriteRef);
        transaction.update(placeRef, { favoriteCount: Math.max(0, count - 1) });
        return false;
      }
      transaction.set(favoriteRef, { visitorId: id, createdAt: serverTimestamp() });
      transaction.update(placeRef, { favoriteCount: count + 1 });
      return true;
    });
  } catch (error) {
    report(error);
    return getFavoriteStatus(placeId);
  }
}