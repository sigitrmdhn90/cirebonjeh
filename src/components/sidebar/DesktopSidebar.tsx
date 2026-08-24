import { SearchBar } from "@/components/filter/SearchBar";
import type { Place } from "@/types/place";
import { CollaborationCTA } from "./CollaborationCTA";
import { DesktopPlaceCard } from "./DesktopPlaceCard";
import { FilterPanel, type DesktopFilters } from "./FilterPanel";

interface DesktopSidebarProps {
  places: Place[];
  allPlaces: Place[];
  query: string;
  onQueryChange: (value: string) => void;
  filters: DesktopFilters;
  onFiltersChange: (value: DesktopFilters) => void;
  onToggleNearMe: () => void;
  selectedPlaceId: string | null;
  onSelectPlace: (id: string) => void;
  cardRefs: React.MutableRefObject<Record<string, HTMLButtonElement | null>>;
}

export function DesktopSidebar(props: DesktopSidebarProps) {
  return <aside className="desktop-sidebar" aria-label="Daftar UMKM">
    <div className="desktop-sidebar-inner">
      <div className="sidebar-eyebrow">DAFTAR UMKM</div>
      <SearchBar value={props.query} onChange={props.onQueryChange} placeholder="Cari warung, menu, atau daerah" />
      <FilterPanel value={props.filters} onChange={props.onFiltersChange} onToggleNearMe={props.onToggleNearMe} resultCount={props.places.length} places={props.allPlaces} resultPlaces={props.places} onSelectPlace={props.onSelectPlace} />
      <div className="sidebar-results"><strong>{props.places.length} UMKM ditemukan</strong></div>
      <div className="desktop-card-list">{props.places.length ? props.places.map((place) => <DesktopPlaceCard key={place.id} place={place} selected={props.selectedPlaceId === place.id} onSelect={() => props.onSelectPlace(place.id)} cardRef={(node) => { props.cardRefs.current[place.id] = node; }} />) : <div className="sidebar-empty">Belum ada UMKM yang cocok dengan filter ini.</div>}</div>
      <CollaborationCTA />
    </div>
  </aside>;
}
