import type { Category } from "@/types/category";

export const categories: Category[] = [
  { id: "bakso-mie", name: "Bakso & Mie", icon: "🍜", color: "#E36B45" },
  { id: "nasi", name: "Nasi", icon: "🍚", color: "#D08A2D" },
  { id: "ayam", name: "Ayam", icon: "🍗", color: "#B85C38" },
  { id: "coffee", name: "Coffee", icon: "☕", color: "#765343" },
  { id: "dessert", name: "Dessert", icon: "🍰", color: "#D55B89" },
  { id: "minuman", name: "Minuman", icon: "🧋", color: "#328C91" },
  { id: "street-food", name: "Street Food", icon: "🥟", color: "#C96C2D" },
  { id: "frozen-food", name: "Frozen Food", icon: "❄️", color: "#4B81B8" },
  { id: "umkm", name: "UMKM", icon: "🏪", color: "#8F2D4E" },
  { id: "lainnya", name: "Lainnya", icon: "🍴", color: "#6A746B" },
];

export const categoryById = Object.fromEntries(categories.map((item) => [item.id, item]));
