"use client";

import { useEffect, useMemo, useState } from "react";
import { CategoryFilter } from "@/components/filter/CategoryFilter";
import { SearchBar } from "@/components/filter/SearchBar";
import { PlaceCard } from "@/components/place/PlaceCard";
import type { Place } from "@/types/place";
import { distanceInKm, type Coordinates } from "@/lib/distance";
import { getPlaceOpenStatus } from "@/lib/openingHours";

export function PlaceListScreen({ places }: { places: Place[] }) {
  const [query, setQuery] = useState(""); const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true); const [location, setLocation] = useState<Coordinates | null>(null);
  useEffect(() => { const timer = window.setTimeout(() => setLoading(false), 450); navigator.geolocation?.getCurrentPosition(({ coords }) => setLocation({ latitude: coords.latitude, longitude: coords.longitude }), () => undefined, { timeout: 4000 }); return () => window.clearTimeout(timer); }, []);
  const visible = useMemo(() => {
    const result = places.filter((place) => {
      const categoryName = place.categoryId.replaceAll("-", " ");
      const searchable = `${place.name} ${categoryName} ${place.district} ${place.village ?? ""} ${place.regency}`.toLocaleLowerCase("id");
      const categoryFilter = !["all", "open", "nearest", "newest", "rating", "cheapest"].includes(filter);
      return searchable.includes(query.toLocaleLowerCase("id").trim()) && (!categoryFilter || place.categoryId === filter) && (filter !== "open" || getPlaceOpenStatus(place.openingHours).isOpen);
    });
    if (filter === "nearest" && location) return result.sort((a, b) => distanceInKm(location, a) - distanceInKm(location, b));
    if (filter === "newest") return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (filter === "rating") return result.sort((a, b) => b.rating - a.rating);
    if (filter === "cheapest") return result.sort((a, b) => (a.priceMin ?? Infinity) - (b.priceMin ?? Infinity));
    return result;
  }, [query, filter, location, places]);
  return <main className="list-content">
    <div className="page-intro"><h1>Mau jajan apa?</h1><p>Temukan rasa enak dari tetangga sendiri.</p></div>
    <SearchBar value={query} onChange={setQuery} /><CategoryFilter value={filter} onChange={setFilter} />
    <div className="results-head"><span>{visible.length} tempat ditemukan</span><span>Kota & Kabupaten Cirebon</span></div>
    <div className="place-grid">{loading ? Array.from({ length: 4 }, (_, index) => <div className="skeleton" key={index} />) : visible.length ? visible.map((place) => <PlaceCard key={place.id} place={place} userLocation={location} />) : <div className="empty-state"><span>🍽️</span><strong>Belum ketemu yang cocok</strong><p>Coba kata kunci atau kategori lain.</p></div>}</div>
  </main>;
}
