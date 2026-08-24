import { categories } from "@/data/categories";

export function CategoryFilter({ value, onChange, showSort = true }: { value: string; onChange: (value: string) => void; showSort?: boolean }) {
  const filters = [
    { id: "all", name: "Semua" }, { id: "open", name: "Buka" },
    ...(showSort ? [{ id: "nearest", name: "Terdekat" }, { id: "newest", name: "Terbaru" }, { id: "rating", name: "Rating tertinggi" }, { id: "cheapest", name: "Harga termurah" }] : []),
    ...categories,
  ];
  return <div className="chips" role="list" aria-label="Filter tempat">{filters.map((filter) => <button key={filter.id} className={`chip ${value === filter.id ? "active" : ""}`} onClick={() => onChange(filter.id)}>{"icon" in filter ? `${filter.icon} ` : ""}{filter.name}</button>)}</div>;
}
