"use client";

import L from "leaflet";
import Link from "next/link";
import { memo, useEffect, useRef } from "react";
import { MapPin, Star } from "lucide-react";
import { Marker, Popup } from "react-leaflet";
import { categoryById } from "@/data/categories";
import { calculateDistance, type Coordinates } from "@/lib/distance";
import { formatPriceRange } from "@/lib/format";
import { getPlaceOpenStatus } from "@/lib/openingHours";
import type { Place } from "@/types/place";

function PlaceMarkerComponent({ place, userLocation, selected, onSelect }: { place: Place; userLocation: Coordinates | null; selected: boolean; onSelect: (id: string) => void }) {
  const markerRef = useRef<L.Marker | null>(null);
  const category = categoryById[place.categoryId];
  const status = getPlaceOpenStatus(place.openingHours);
  const icon = L.divIcon({
    className: "", iconSize: [48, 48], iconAnchor: [24, 24], popupAnchor: [0, -27],
    html: `<div class="food-marker ${status.isOpen ? "place-marker--open" : "place-marker--closed"}${selected ? " selected" : ""}" style="background:${category.color}22"><span>${category.icon}</span><i class="status-dot ${status.isOpen ? "open-status-dot" : "closed-status-dot"}"></i></div>`,
  });
  useEffect(() => { if (selected) markerRef.current?.openPopup(); else markerRef.current?.closePopup(); }, [selected]);
  return <Marker ref={markerRef} position={[place.latitude, place.longitude]} icon={icon} eventHandlers={{ click: () => onSelect(place.id) }}>
    <Popup className="map-popup" closeButton={false}>
      <div className="popup-card">
        <span className="popup-category">{category.name}</span><h3>{place.name}</h3>
        <div className="popup-meta">
          <span className="popup-row"><Star size={14} fill="#F2B84B" color="#F2B84B" /> <strong>{place.rating}</strong> • <i className={`dot ${status.isOpen ? "open" : ""}`} /> {status.label}</span>
          <span className="popup-row"><MapPin size={14} />{place.district}, {place.regency}{userLocation ? ` • ${calculateDistance(userLocation, place)}` : ""}</span>
          <strong>{formatPriceRange(place.priceMin, place.priceMax)}</strong>
        </div>
        <Link className="popup-detail" href={`/place/${place.id}`}>Lihat Detail</Link>
      </div>
    </Popup>
  </Marker>;
}

export const PlaceMarker = memo(PlaceMarkerComponent);
