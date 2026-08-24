import { Eye, Heart, MapPin } from "lucide-react";
import { categoryById } from "@/data/categories";
import { formatPrice } from "@/lib/format";
import { getPlaceOpenStatus } from "@/lib/openingHours";
import type { Place } from "@/types/place";

export function DesktopPlaceCard({ place, selected, onSelect, cardRef }: { place: Place; selected: boolean; onSelect: () => void; cardRef: (node: HTMLButtonElement | null) => void }) {
  const category = categoryById[place.categoryId];
  const open = getPlaceOpenStatus(place.openingHours);
  const preorder = ["dessert", "frozen-food", "umkm"].includes(place.categoryId);
  const delivery = place.id.length % 2 === 0;
  return <button ref={cardRef} type="button" className={`desktop-place-card ${selected ? "selected" : ""}`} onClick={onSelect} aria-pressed={selected}>
    <span className="desktop-card-image" style={{ background: `linear-gradient(145deg, ${category.color}20, ${category.color}55)` }} aria-hidden>{category.icon}</span>
    <span className="desktop-card-content">
      <span className={`desktop-card-status ${open.isOpen ? "is-open" : ""}`}><i className={`dot ${open.isOpen ? "open-status-dot legend-status-dot" : "closed-status-dot"}`} />{open.label}</span>
      <strong>{place.name}</strong>
      <span className="desktop-card-location"><MapPin size={12} />{place.district}, {place.regency}</span>
      <span className="desktop-card-tags">{category.name} • {preorder ? "Pre-order" : "Siap ambil"}{delivery ? " • Diantar" : ""}</span>
      <span className="desktop-card-price">mulai {formatPrice(place.priceMin)}</span>
      <span className="desktop-card-description">{place.description}</span>
      <span className="desktop-card-stats"><span><Eye size={12} />{Number(place.views || 0).toLocaleString("id-ID")} dilihat</span><span><Heart size={12} />{Number(place.favoriteCount || 0).toLocaleString("id-ID")} favorit</span></span>
    </span>
  </button>;
}
