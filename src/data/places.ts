import type { OpeningHours, Place } from "@/types/place";

const daily = (open: string, close: string, sundayClosed = false): OpeningHours => ({
  monday: { open, close, closed: false }, tuesday: { open, close, closed: false },
  wednesday: { open, close, closed: false }, thursday: { open, close, closed: false },
  friday: { open, close, closed: false }, saturday: { open, close, closed: false },
  sunday: { open, close, closed: sundayClosed },
});

const seeds = [
  ["bakso-pak-kumis", "Bakso Pak Kumis", "bakso-mie", "Kota Cirebon", "city", "Kesambi", "Karyamulya", -6.7246, 108.5421, 10000, 30000, 4.8, "08:00", "22:00"],
  ["nasi-jamblang-ibu-nur", "Nasi Jamblang Ibu Nur", "nasi", "Kota Cirebon", "city", "Kejaksan", "Kejaksan", -6.7135, 108.5585, 12000, 45000, 4.7, "07:00", "21:00"],
  ["empal-gentong-mang-darma", "Empal Gentong Mang Darma", "nasi", "Kota Cirebon", "city", "Pekalipan", "Pekalipan", -6.7198, 108.5651, 20000, 50000, 4.9, "09:00", "21:30"],
  ["mie-koclok-panjunan", "Mie Koclok Panjunan", "bakso-mie", "Kota Cirebon", "city", "Lemahwungkuk", "Panjunan", -6.7211, 108.5716, 15000, 30000, 4.6, "10:00", "22:00"],
  ["kopi-pesisir", "Kopi Pesisir", "coffee", "Kota Cirebon", "city", "Kejaksan", "Sukapura", -6.7068, 108.5662, 18000, 45000, 4.8, "08:00", "23:30"],
  ["ayam-geprek-harjamukti", "Ayam Geprek Harjamukti", "ayam", "Kota Cirebon", "city", "Harjamukti", "Kalijaga", -6.7541, 108.5582, 12000, 32000, 4.5, "10:00", "22:00"],
  ["es-cuwing-ade-irma", "Es Cuwing Ade Irma", "dessert", "Kota Cirebon", "city", "Pekalipan", "Pekalangan", -6.7262, 108.5607, 8000, 22000, 4.7, "10:00", "20:00"],
  ["tahu-gejrot-kanoman", "Tahu Gejrot Kanoman", "street-food", "Kota Cirebon", "city", "Lemahwungkuk", "Lemahwungkuk", -6.7227, 108.5692, 7000, 18000, 4.8, "09:00", "19:00"],
  ["seblak-teh-iis", "Seblak Teh Iis", "street-food", "Kota Cirebon", "city", "Kesambi", "Sunyaragi", -6.7352, 108.5483, 10000, 25000, 4.6, "11:00", "23:00"],
  ["susu-murni-kesambi", "Susu Murni Kesambi", "minuman", "Kota Cirebon", "city", "Kesambi", "Drajat", -6.7316, 108.5602, 8000, 25000, 4.4, "16:00", "00:00"],
  ["kedai-kedawung", "Kedai Kedawung", "coffee", "Kabupaten Cirebon", "regency", "Kedawung", "Kedawung", -6.7051, 108.5381, 15000, 40000, 4.5, "09:00", "23:00"],
  ["sate-kalong-weru", "Sate Kalong Weru", "street-food", "Kabupaten Cirebon", "regency", "Weru", "Weru Kidul", -6.7359, 108.5134, 18000, 45000, 4.7, "17:00", "01:00"],
  ["roti-bakar-sumber", "Roti Bakar Sumber", "dessert", "Kabupaten Cirebon", "regency", "Sumber", "Sumber", -6.7624, 108.4795, 10000, 28000, 4.3, "15:00", "23:00"],
  ["ayam-bakar-talun", "Ayam Bakar Talun", "ayam", "Kabupaten Cirebon", "regency", "Talun", "Cirebon Girang", -6.7606, 108.5164, 18000, 48000, 4.8, "10:00", "21:30"],
  ["dapur-frozen-plumbon", "Dapur Frozen Plumbon", "frozen-food", "Kabupaten Cirebon", "regency", "Plumbon", "Kebarepan", -6.7048, 108.4752, 20000, 85000, 4.6, "08:00", "20:00"],
  ["serabi-pulasaren", "Serabi Pulasaren", "dessert", "Kota Cirebon", "city", "Pekalipan", "Pulasaren", -6.7278, 108.5562, 6000, 18000, 4.7, "06:00", "11:00"],
  ["nasi-lengko-bahagia", "Nasi Lengko Bahagia", "nasi", "Kota Cirebon", "city", "Kejaksan", "Kebonbaru", -6.7095, 108.5603, 10000, 25000, 4.6, "06:30", "15:00"],
  ["warung-udang-pesisir", "Warung Udang Pesisir", "umkm", "Kota Cirebon", "city", "Lemahwungkuk", "Kasepuhan", -6.7311, 108.5754, 25000, 75000, 4.7, "10:00", "21:00"],
  ["martabak-stasiun", "Martabak Stasiun", "street-food", "Kota Cirebon", "city", "Kejaksan", "Kejaksan", -6.7057, 108.5553, 18000, 65000, 4.5, "16:00", "00:00"],
  ["jus-segar-perumnas", "Jus Segar Perumnas", "minuman", "Kota Cirebon", "city", "Harjamukti", "Kecapi", -6.7427, 108.5674, 7000, 18000, 4.4, "09:00", "21:00"],
] as const;

export const places: Place[] = seeds.map((seed, index) => {
  const [id, name, categoryId, regency, regencyType, district, village, latitude, longitude, priceMin, priceMax, rating, open, close] = seed;
  return {
    id, name, slug: id, categoryId, description: `${name} menyajikan pilihan kuliner khas dan favorit warga Cirebon.`,
    province: "Jawa Barat", regencyType, regency, district, village,
    address: `Jl. ${district} No. ${index + 3}`, latitude, longitude,
    coverImage: `/images/categories/${categoryId}.svg`, images: [`/images/categories/${categoryId}.svg`],
    phone: `628123450${String(index).padStart(3, "0")}`, whatsapp: `628123450${String(index).padStart(3, "0")}`,
    instagram: `jajancirebon.${id}`, priceMin, priceMax, openingHours: daily(open, close, index % 7 === 0),
    rating, totalReviews: 28 + index * 9, status: "active", verificationStatus: index % 4 === 0 ? "unverified" : "verified",
    ownershipStatus: index % 3 === 0 ? "unclaimed" : "claimed", plan: "free", featured: false, featuredUntil: null,
    views: 245 + index * 83, whatsappClicks: 10 + index * 2, directionClicks: 8 + index * 3, favoriteCount: 4 + index * 2,
    createdAt: new Date(Date.UTC(2026, 5, 1 + index)).toISOString(), updatedAt: new Date(Date.UTC(2026, 7, 1 + index)).toISOString(),
  };
});
