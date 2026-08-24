import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { MapScreen } from "@/components/map/MapScreen";
import { places } from "@/data/places";
import { getPlaceOpenStatus } from "@/lib/openingHours";

export default function Home() {
  const openCount = places.filter((place) => getPlaceOpenStatus(place.openingHours).isOpen).length;
  return <main className="app-shell"><Header openCount={openCount} /><MapScreen /><BottomNavigation active="map" /></main>;
}
