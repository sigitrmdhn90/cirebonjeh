"use client";

import { ChevronDown, Crosshair, Filter, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { places } from "@/data/places";

export interface DesktopFilters {
  availability: "open" | "all";
  selectedCategoryIds: string[];
  nearMeEnabled: boolean;
  selectedRegency: string | null;
  selectedDistrict: string | null;
}

export const filterCategories = [
  { id: "bakso-mie", label: "Bakso & mie", icon: "🍜", placeCategoryIds: ["bakso-mie"] },
  { id: "nasi", label: "Nasi & makanan berat", icon: "🍚", placeCategoryIds: ["nasi"] },
  { id: "ayam", label: "Ayam & lauk", icon: "🍗", placeCategoryIds: ["ayam"] },
  { id: "camilan-gorengan", label: "Camilan & gorengan", icon: "🥟", placeCategoryIds: ["street-food"] },
  { id: "minuman", label: "Minuman", icon: "🥤", placeCategoryIds: ["minuman"] },
  { id: "jajanan-tradisional", label: "Jajanan tradisional", icon: "🍡", placeCategoryIds: ["umkm"] },
  { id: "coffee", label: "Coffee", icon: "☕", placeCategoryIds: ["coffee"] },
  { id: "sayur-sehat", label: "Sayur & sehat", icon: "🥗", placeCategoryIds: ["lainnya"] },
  { id: "dessert", label: "Dessert", icon: "🍨", placeCategoryIds: ["dessert"] },
  { id: "frozen-food", label: "Frozen food", icon: "🧊", placeCategoryIds: ["frozen-food"] },
  { id: "oleh-oleh", label: "Oleh-oleh", icon: "🎁", placeCategoryIds: ["umkm"] },
  { id: "lainnya", label: "Lainnya", icon: "🍴", placeCategoryIds: ["lainnya"] },
] as const;

interface FilterPanelProps {
  value: DesktopFilters;
  onChange: (value: DesktopFilters) => void;
  onToggleNearMe: () => void;
  resultCount: number;
  defaultExpanded?: boolean;
  compact?: boolean;
}

export function FilterPanel({ value, onChange, onToggleNearMe, resultCount, defaultExpanded = true, compact = false }: FilterPanelProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const districts = useMemo(() => value.selectedRegency ? [...new Set(places.filter((place) => place.regency === value.selectedRegency).map((place) => place.district))].sort() : [], [value.selectedRegency]);
  const hasActiveFilters = value.availability === "open" || value.selectedCategoryIds.length > 0 || value.nearMeEnabled || value.selectedRegency !== null || value.selectedDistrict !== null;
  const toggleCategory = (id: string) => onChange({ ...value, selectedCategoryIds: value.selectedCategoryIds.includes(id) ? value.selectedCategoryIds.filter((item) => item !== id) : [...value.selectedCategoryIds, id] });
  const reset = () => onChange({ availability: "all", selectedCategoryIds: [], nearMeEnabled: false, selectedRegency: null, selectedDistrict: null });

  return <section className={`expandable-filter ${compact ? "compact" : ""}`}>
    <div className="filter-panel-header">
      <button type="button" className="filter-panel-toggle" onClick={() => setExpanded((current) => !current)} aria-expanded={expanded}><Filter size={16} /><strong>Filter</strong>{hasActiveFilters && <span className="filter-active-count">{value.selectedCategoryIds.length + Number(value.nearMeEnabled) + Number(Boolean(value.selectedRegency)) + Number(Boolean(value.selectedDistrict)) + Number(value.availability === "open")}</span>}<ChevronDown className={expanded ? "rotated" : ""} size={17} /></button>
      {hasActiveFilters && <button type="button" className="filter-reset" onClick={reset}><RotateCcw size={12} />Reset</button>}
    </div>
    <div className={`filter-collapsible ${expanded ? "expanded" : ""}`}><div className="filter-collapsible-inner">
      <div className="filter-section"><span className="filter-label">KETERSEDIAAN</span><div className="filter-chip-wrap">
        <button type="button" className={`filter-chip ${value.availability === "all" ? "active" : ""}`} onClick={() => onChange({ ...value, availability: "all" })} aria-pressed={value.availability === "all"}>Semua</button>
        <button type="button" className={`filter-chip ${value.availability === "open" ? "active" : ""}`} onClick={() => onChange({ ...value, availability: "open" })} aria-pressed={value.availability === "open"}>● Buka sekarang</button>
      </div></div>
      <div className="filter-section"><span className="filter-label">KATEGORI</span><div className="filter-chip-wrap">
        <button type="button" className={`filter-chip near-me ${value.nearMeEnabled ? "active" : ""}`} onClick={onToggleNearMe} aria-pressed={value.nearMeEnabled}><Crosshair size={14} />Dekat saya</button>
        {filterCategories.map((category) => <button type="button" key={category.id} className={`filter-chip ${value.selectedCategoryIds.includes(category.id) ? "active" : ""}`} onClick={() => toggleCategory(category.id)} aria-pressed={value.selectedCategoryIds.includes(category.id)}>{category.icon} {category.label}</button>)}
      </div></div>
      <div className="filter-region-fields">
        <label><span>WILAYAH</span><select value={value.selectedRegency ?? ""} onChange={(event) => onChange({ ...value, selectedRegency: event.target.value || null, selectedDistrict: null })}><option value="">Semua wilayah</option><option value="Kota Cirebon">Kota Cirebon</option><option value="Kabupaten Cirebon">Kabupaten Cirebon</option></select></label>
        {value.selectedRegency && <label><span>KECAMATAN</span><select value={value.selectedDistrict ?? ""} onChange={(event) => onChange({ ...value, selectedDistrict: event.target.value || null })}><option value="">Semua kecamatan</option>{districts.map((district) => <option key={district} value={district}>{district}</option>)}</select></label>}
      </div>
      <div className="filter-result-count">{resultCount} tempat ditemukan</div>
    </div></div>
  </section>;
}
