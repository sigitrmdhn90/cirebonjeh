"use client";
import L from "leaflet";
import { Marker } from "react-leaflet";
import type { Coordinates } from "@/lib/distance";

const userIcon = L.divIcon({ className: "", iconSize: [17, 17], iconAnchor: [8, 8], html: '<div class="user-dot"></div>' });
export function UserLocationMarker({ position }: { position: Coordinates }) {
  return <Marker position={[position.latitude, position.longitude]} icon={userIcon} zIndexOffset={1000} />;
}
