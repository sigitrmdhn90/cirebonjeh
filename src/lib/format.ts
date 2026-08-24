export const formatPrice = (value?: number) => value == null ? "—" : new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

export const formatPriceRange = (min?: number, max?: number) => `${formatPrice(min)} – ${formatPrice(max)}`;
