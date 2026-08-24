import { MapPin, Star } from "lucide-react";
import Link from "next/link";
import { categoryById } from "@/data/categories";
import { calculateDistance, type Coordinates } from "@/lib/distance";
import { formatPriceRange } from "@/lib/format";
import { getPlaceOpenStatus } from "@/lib/openingHours";
import type { Place } from "@/types/place";

export function PlaceCard({ place, userLocation }: { place: Place; userLocation?: Coordinates | null }) {
  const category = categoryById[place.categoryId];
  const open = getPlaceOpenStatus(place.openingHours);
  return <Link href={`/place/${place.id}`} className="place-card">
    <div className="place-image" style={{ background: `linear-gradient(145deg, ${category.color}20, ${category.color}55)` }} aria-hidden>{category.icon}</div>
    <div className="place-card-body">
      <div className="place-category">{category.name}</div><h2>{place.name}</h2>
      <div className="card-line"><Star size={13} fill="#F2B84B" color="#F2B84B" /> <strong>{place.rating}</strong> <span>({place.totalReviews})</span></div>
      <div className={`card-line ${open.isOpen ? "status-open" : ""}`}><i className={`dot ${open.isOpen ? "open" : ""}`} />{open.label}</div>
      <div className="card-line"><MapPin size={13} />{place.district}{userLocation ? ` • ${calculateDistance(userLocation, place)}` : ""}</div>
      <p className="price">{formatPriceRange(place.priceMin, place.priceMax)}</p>
    </div>
  </Link>;
}
