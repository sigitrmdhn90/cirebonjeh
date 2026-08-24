"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type L from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useDailyVisits } from "@/hooks/useDailyVisits";
import { useOnlinePresence } from "@/hooks/useOnlinePresence";
import type { Coordinates } from "@/lib/distance";
import type { Place } from "@/types/place";
import { useAppTheme } from "@/components/theme/ThemeProvider";
import { MapControls } from "./MapControls";
import { PlaceMarker } from "./PlaceMarker";
import { UserLocationMarker } from "./UserLocationMarker";

const CIREBON: [number, number] = [-6.732, 108.552];

function MapResizeHandler() {
  const map = useMap();
  useEffect(() => {
    const invalidate = () => map.invalidateSize({ animate: false });
    const timeout = window.setTimeout(invalidate, 100);
    window.addEventListener("resize", invalidate);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("resize", invalidate);
    };
  }, [map]);
  return null;
}

interface FoodMapProps {
  places: Place[];
  selectedPlaceId: string | null;
  onSelectPlace: (id: string) => void;
  userLocation: Coordinates | null;
  onLocationChange: (location: Coordinates) => void;
  openCount: number;
  closedCount: number;
}

export default function FoodMap({ places, selectedPlaceId, onSelectPlace, userLocation, onLocationChange, openCount, closedCount }: FoodMapProps) {
  const { theme } = useAppTheme();
  const mapRef = useRef<L.Map | null>(null);
  const [toast, setToast] = useState("");
  const { visits } = useDailyVisits();
  const online = useOnlinePresence();
  const locate = useCallback(() => {
    if (!navigator.geolocation) { setToast("Lokasi tidak dapat diakses."); return; }
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const location = { latitude: coords.latitude, longitude: coords.longitude };
      onLocationChange(location);
      mapRef.current?.flyTo([location.latitude, location.longitude], 15, { duration: 1.1 });
    }, () => setToast("Lokasi tidak dapat diakses."), { enableHighAccuracy: true, timeout: 10000 });
  }, [onLocationChange]);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(""), 2600); return () => window.clearTimeout(timer); }, [toast]);
  useEffect(() => {
    const selected = places.find((place) => place.id === selectedPlaceId);
    if (selected) mapRef.current?.flyTo([selected.latitude, selected.longitude], 15, { duration: .8 });
  }, [places, selectedPlaceId]);
  return <div className="map-canvas">
    <MapContainer center={CIREBON} zoom={12} minZoom={10} maxZoom={19} scrollWheelZoom zoomControl={false} ref={mapRef} style={{ height: "100%", width: "100%" }}>
      <MapResizeHandler />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url={`https://{s}.basemaps.cartocdn.com/${theme === "dark" ? "dark_all" : "light_all"}/{z}/{x}/{y}{r}.png`}
      />
      {places.map((place) => <PlaceMarker key={place.id} place={place} userLocation={userLocation} selected={selectedPlaceId === place.id} onSelect={onSelectPlace} />)}
      {userLocation && <UserLocationMarker position={userLocation} />}
    </MapContainer>
    <MapControls onLocate={locate} onZoomIn={() => mapRef.current?.zoomIn()} onZoomOut={() => mapRef.current?.zoomOut()} />
    <div className="map-info">
      <div className="info-pill">👁 {new Intl.NumberFormat("id-ID").format(visits)} kunjungan&nbsp;&nbsp;•&nbsp;&nbsp;<span className="online-label"><i className="dot online-status-dot" />{online} online</span></div>
      <div className="info-pill legend"><span><i className="dot open-status-dot legend-status-dot" />{openCount} buka sekarang</span><span><i className="dot closed-status-dot" />{closedCount} tutup</span></div>
    </div>
    {toast && <div className="map-toast" role="status">{toast}</div>}
  </div>;
}
