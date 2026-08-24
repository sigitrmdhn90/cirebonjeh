import Link from "next/link";
import { List, Map } from "lucide-react";

export function BottomNavigation({ active }: { active: "map" | "list" }) {
  return <nav className="bottom-nav" aria-label="Navigasi utama">
    <Link href="/list" className={active === "list" ? "active" : ""}><List size={18} />List</Link>
    <Link href="/" className={active === "map" ? "active" : ""}><Map size={18} />Peta</Link>
  </nav>;
}
