export const MAX_INITIAL_PRODUCTS = 10;

export interface SubmissionProductDraft {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  imageFile: File | null;
  available: boolean;
  bestseller: boolean;
  order: number;
}

export interface SubmissionProductPayload {
  name: string;
  category?: string;
  description?: string;
  price: number;
  imageUrl?: string;
  available: boolean;
  bestseller: boolean;
  order: number;
}