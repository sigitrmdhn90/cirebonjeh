import Link from "next/link";
import { Camera, MessageCircle } from "lucide-react";

export function CollaborationCTA() {
  return <footer className="sidebar-cta">
    <strong>Punya usaha?</strong><p>Daftarkan UMKM Anda secara gratis.</p>
    <Link href="/add-place" className="sidebar-primary-cta">Daftarkan UMKM Gratis</Link>
    <p className="sidebar-collab-copy">Butuh Website, POS, atau Digital Menu?</p>
    <button type="button" className="sidebar-secondary-cta">Kolaborasi dengan Kami</button>
    <div className="sidebar-socials"><span><MessageCircle size={13} /> WhatsApp</span><span><Camera size={13} /> Instagram</span></div>
    <small>© 2026 Jajan Apa ning Cirebon</small>
  </footer>;
}
