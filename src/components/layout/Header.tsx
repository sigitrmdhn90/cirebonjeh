import Link from "next/link";
import { CalendarDays, Info, MapPinned, Plus } from "lucide-react";

export function Header({ openCount }: { openCount: number }) {
  return <header className="mobile-header">
    <Link href="/" className="brand"><span className="brand-icon">🍴</span><span className="brand-copy"><strong>Jajan Apa di Cirebon</strong><small>Jajanan rumahan yang buka hari ini</small></span></Link>
    <div className="header-actions">
      <span className="open-count"><i className="dot open" />{openCount} buka</span>
      <button className="icon-button event-action" aria-label="Lihat event"><CalendarDays size={18} /><span>Event apa?</span></button>
      <Link href="/add-place" className="icon-button primary register-action" aria-label="Daftarkan UMKM"><Plus size={21} /><span>Daftarkan UMKM</span></Link>
      <button className="icon-button desktop-header-icon" aria-label="Informasi area peta"><MapPinned size={18} /><Info size={11} /></button>
    </div>
  </header>;
}
