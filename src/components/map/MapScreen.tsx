"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DesktopSidebar } from "@/components/sidebar/DesktopSidebar";
import { FilterPanel, filterCategories, type DesktopFilters } from "@/components/sidebar/FilterPanel";
import { PlaceQuickDetail } from "@/components/place/PlaceQuickDetail";
import type { Place } from "@/types/place";
import { categoryById } from "@/data/categories";
import { distanceInKm, type Coordinates } from "@/lib/distance";
import { getPlaceOpenStatus } from "@/lib/openingHours";

const FoodMap = dynamic(() => import("./FoodMap"), { ssr: false, loading: () => <div className="map-canvas skeleton" aria-label="Memuat peta" /> });

export function MapScreen({ places, openStats }: { places: Place[]; openStats: { openCount:number; closedCount:number } }) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<DesktopFilters>({ availability: "all", selectedCategoryIds: [], nearMeEnabled: false, selectedRegency: null, selectedDistrict: null });
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [filterToast, setFilterToast] = useState("");
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const visible = useMemo(() => {
    const selectedPlaceCategoryIds: string[] = filterCategories.filter((item) => filters.selectedCategoryIds.includes(item.id)).flatMap((item) => [...item.placeCategoryIds]);
    const filtered = places.filter((place) => {
    const category = categoryById[place.categoryId];
    const searchable = `${place.name} ${category.name} ${place.description} ${place.district} ${place.village ?? ""} ${place.regency}`.toLocaleLowerCase("id");
    const matchesQuery = searchable.includes(query.toLocaleLowerCase("id").trim());
    const matchesAvailability = filters.availability === "all" || getPlaceOpenStatus(place.openingHours).isOpen;
    const matchesCategory = selectedPlaceCategoryIds.length === 0 || selectedPlaceCategoryIds.includes(place.categoryId);
    const matchesRegency = !filters.selectedRegency || place.regency === filters.selectedRegency;
    const matchesDistrict = !filters.selectedDistrict || place.district === filters.selectedDistrict;
    return matchesQuery && matchesAvailability && matchesCategory && matchesRegency && matchesDistrict;
    });
    return filters.nearMeEnabled && userLocation ? [...filtered].sort((a, b) => distanceInKm(userLocation, a) - distanceInKm(userLocation, b)) : filtered;
  }, [query, filters, userLocation, places]);
  const selectedPlace = useMemo(() => places.find((place) => place.id === selectedPlaceId) ?? null, [selectedPlaceId, places]);
  const selectPlace = useCallback((id: string) => setSelectedPlaceId(id), []);
  const toggleNearMe = useCallback(() => {
    if (filters.nearMeEnabled) { setFilters((current) => ({ ...current, nearMeEnabled: false })); return; }
    if (userLocation) { setFilters((current) => ({ ...current, nearMeEnabled: true })); return; }
    if (!navigator.geolocation) { setFilterToast("Izinkan akses lokasi untuk melihat UMKM terdekat."); return; }
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setUserLocation({ latitude: coords.latitude, longitude: coords.longitude });
      setFilters((current) => ({ ...current, nearMeEnabled: true }));
    }, () => setFilterToast("Izinkan akses lokasi untuk melihat UMKM terdekat."), { enableHighAccuracy: true, timeout: 10000 });
  }, [filters.nearMeEnabled, userLocation]);
  useEffect(() => {
    if (!selectedPlaceId) return;
    cardRefs.current[selectedPlaceId]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selectedPlaceId, places]);
  useEffect(() => { if (!filterToast) return; const timer = window.setTimeout(() => setFilterToast(""), 3000); return () => window.clearTimeout(timer); }, [filterToast]);
  return <div className="map-frame">
    <DesktopSidebar places={visible} query={query} onQueryChange={setQuery} filters={filters} onFiltersChange={setFilters} onToggleNearMe={toggleNearMe} selectedPlaceId={selectedPlaceId} onSelectPlace={selectPlace} cardRefs={cardRefs} />
    <div className="mobile-map-filter"><FilterPanel value={filters} onChange={setFilters} onToggleNearMe={toggleNearMe} resultCount={visible.length} defaultExpanded={false} compact /></div>
    <FoodMap places={visible} openCount={openStats.openCount} closedCount={openStats.closedCount} selectedPlaceId={selectedPlaceId} onSelectPlace={selectPlace} userLocation={userLocation} onLocationChange={setUserLocation} />
    {selectedPlace && <PlaceQuickDetail place={selectedPlace} onClose={() => setSelectedPlaceId(null)} />}
    {filterToast && <div className="map-toast filter-toast" role="status">{filterToast}</div>}
  </div>;
}
