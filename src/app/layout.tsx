import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { themeInitializationScript } from "@/lib/themeByTime";
import "leaflet/dist/leaflet.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Jajan Apa di Cirebon", template: "%s • Jajan Apa di Cirebon" },
  description: "Temukan kuliner, jajanan, dan UMKM favorit di Kota dan Kabupaten Cirebon.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Jajan Cirebon" },
  icons: { apple: "/icons/apple-touch-icon.svg" },
};

export const viewport: Viewport = { themeColor: "#8F2D4E", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} /></head><body><ThemeProvider>{children}</ThemeProvider><script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js'))}` }} /></body></html>;
}
