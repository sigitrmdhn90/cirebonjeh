import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { PlaceListScreen } from "@/components/place/PlaceListScreen";
import { places } from "@/data/places";
import { getPlaceOpenStatus } from "@/lib/openingHours";

export const metadata: Metadata = { title: "Daftar Kuliner" };
export default function ListPage() {
  const openCount = places.filter((place) => getPlaceOpenStatus(place.openingHours).isOpen).length;
  return <div className="list-page"><Header openCount={openCount} /><PlaceListScreen /><BottomNavigation active="list" /></div>;
}
