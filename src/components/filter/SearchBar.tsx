import { Search } from "lucide-react";

export function SearchBar({ value, onChange, placeholder = "Cari makanan atau tempat..." }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="search-wrap"><Search size={19} /><span className="sr-only">Cari</span><input className="search-input" type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}
