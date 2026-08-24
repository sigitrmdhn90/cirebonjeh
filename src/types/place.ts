export type DaySchedule = { open: string; close: string; closed: boolean };
export type OpeningHours = Record<
  "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday",
  DaySchedule
>;

export interface Place {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  province: string;
  regencyType: "city" | "regency";
  regency: string;
  district: string;
  village?: string;
  address: string;
  latitude: number;
  longitude: number;
  coverImage: string;
  images: string[];
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  priceMin?: number;
  priceMax?: number;
  serviceTypes?: string[];
  halalStatus?: "halal" | "non_halal" | "unknown";
  openingHours: OpeningHours;
  rating: number;
  totalReviews: number;
  status: "active" | "inactive";
  verificationStatus: "verified" | "unverified";
  ownershipStatus: "claimed" | "unclaimed";
  ownerId?: string;
  plan: "free" | "premium" | "business";
  featured: boolean;
  featuredUntil?: string | null;
  views: number;
  whatsappClicks: number;
  directionClicks: number;
  favoriteCount: number;
  createdAt: string;
  updatedAt: string;
}
