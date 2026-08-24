"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, MapPin, MessageCircle, Navigation, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { categoryById } from "@/data/categories";
import { trackEvent } from "@/lib/analytics";
import { formatPriceRange } from "@/lib/format";
import { getPlaceOpenStatus } from "@/lib/openingHours";
import { getFavoriteStatus, toggleFavorite, trackDirectionClick, trackPlaceView, trackWhatsAppClick } from "@/lib/placeAnalytics";
import type { Place } from "@/types/place";

export function PlaceQuickDetail({ place, onClose }: { place: Place; onClose: () => void }) {
  const category = categoryById[place.categoryId];
  const openStatus = getPlaceOpenStatus(place.openingHours);
  const [favorite, setFavorite] = useState(false);
  const [favoriteBusy, setFavoriteBusy] = useState(false);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
  const whatsappUrl = place.whatsapp ? `https://wa.me/${place.whatsapp}` : undefined;

  useEffect(() => {
    trackEvent("place_view", place.id);
    void trackPlaceView(place.id);
    void getFavoriteStatus(place.id).then(setFavorite);
  }, [place.id]);

  const handleFavorite = async () => {
    if (favoriteBusy) return;
    setFavoriteBusy(true);
    setFavorite(await toggleFavorite(place.id));
    setFavoriteBusy(false);
  };

  return <aside className="place-detail-panel" aria-label={`Detail ${place.name}`}>
    <div className="quick-detail-cover">
      <Image src={place.coverImage} alt={`Ilustrasi ${place.name}`} fill sizes="420px" priority />
      <button type="button" className="quick-detail-close" onClick={onClose} aria-label="Tutup detail"><X size={20} /></button>
    </div>
    <div className="quick-detail-content">
      <div className="quick-detail-heading"><h2>{place.name}</h2><span>{category.name} • {place.district}</span></div>
      <div className={`quick-detail-status ${openStatus.isOpen ? "is-open" : ""}`}><i className={`dot ${openStatus.isOpen ? "open-status-dot legend-status-dot" : "closed-status-dot"}`} />{openStatus.isOpen ? openStatus.label : "Tutup hari ini"}</div>
      <div className="quick-detail-facts">
        <span><Star size={16} fill="#F2B84B" color="#F2B84B" /><strong>{place.rating}</strong> • {place.totalReviews} ulasan</span>
        <strong>{formatPriceRange(place.priceMin, place.priceMax)}</strong>
      </div>
      <div className="quick-detail-address"><MapPin size={18} /><span><strong>{place.address}</strong><small>{place.district}, {place.regency}</small></span></div>
      <div className="quick-detail-actions">
        {whatsappUrl && <a className="quick-detail-whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => { trackEvent("whatsapp_click", place.id); trackWhatsAppClick(place.id); }}><MessageCircle size={18} />Chat WhatsApp</a>}
        <a className="quick-detail-directions" href={directionsUrl} target="_blank" rel="noopener noreferrer" onClick={() => { trackEvent("direction_click", place.id); trackDirectionClick(place.id); }}><Navigation size={18} />Petunjuk Arah</a>
        <button type="button" className={`quick-detail-favorite ${favorite ? "saved" : ""}`} onClick={() => void handleFavorite()} disabled={favoriteBusy} aria-pressed={favorite}><Heart size={18} fill={favorite ? "currentColor" : "none"} />{favorite ? "Tersimpan" : "Simpan"}</button>
      </div>
      <p className="quick-detail-disclaimer">Pesanan dan pembayaran dilakukan langsung dengan penjual. Platform ini tidak memproses transaksi.</p>
      <Link className="quick-detail-full-link" href={`/place/${place.id}`}>Buka halaman lengkap <ArrowRight size={16} /></Link>
    </div>
  </aside>;
}