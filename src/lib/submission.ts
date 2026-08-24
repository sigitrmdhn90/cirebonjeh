import { collection, doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db, firebaseConfigured } from "@/lib/firebase/client";
import { uploadPlaceImage } from "@/lib/imageStorage";
import type { SubmissionProductDraft } from "@/types/menuItem";
import { MAX_INITIAL_PRODUCTS } from "@/types/menuItem";
import type { PlaceSubmissionDraft, PlaceSubmissionPayload } from "@/types/placeSubmission";
import { normalizeIndonesianPhone } from "@/lib/whatsapp";

export interface SubmissionResult { reference: string; mode: "dummy" | "firebase" }

export function buildSubmissionPayload(data: PlaceSubmissionDraft): PlaceSubmissionPayload {
  const { priceMin, priceMax, ...rest } = data;
  return {
    ...rest,
    ...(priceMin ? { priceMin: Number(priceMin) } : {}),
    ...(priceMax ? { priceMax: Number(priceMax) } : {}),
    whatsapp: normalizeIndonesianPhone(data.whatsapp),
    phone: normalizeIndonesianPhone(data.phone),
    submitterWhatsapp: normalizeIndonesianPhone(data.submitterWhatsapp),
    coverImage: "", images: [], status: "pending", verificationStatus: "unverified",
    ownershipStatus: "unclaimed", plan: "free", featured: false, createdAt: new Date().toISOString(),
  };
}

function code() {
  const date = new Date();
  return `UMKM-${String(date.getFullYear()).slice(-2)}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}-${Math.floor(10000 + Math.random() * 90000)}`;
}

export async function submitPlace(data: PlaceSubmissionDraft, cover: File | null | undefined, gallery: File[] = [], products: SubmissionProductDraft[] = []): Promise<SubmissionResult> {
  const reference = code();
  if (products.length < 1 || products.length > MAX_INITIAL_PRODUCTS) throw new Error(`Tambahkan 1–${MAX_INITIAL_PRODUCTS} produk.`);
  if (!firebaseConfigured || !db) { await new Promise((resolve) => window.setTimeout(resolve, 650)); return { reference, mode: "dummy" }; }
  if (!cover) throw new Error("Foto utama wajib ditambahkan.");
  const invalidProduct = products.find((product) => product.name.trim().length < 2 || !Number.isFinite(Number(product.price)) || Number(product.price) <= 0);
  if (invalidProduct) throw new Error("Periksa nama dan harga produk sebelum mengirim.");

  const payload = buildSubmissionPayload(data);
  const submission = doc(collection(db, "place_submissions"));
  const folder = `cirebonjeh/place-submissions/${submission.id}`;
  const coverImage = await uploadPlaceImage(cover, folder);
  const images: string[] = [];
  for (const file of gallery) images.push(await uploadPlaceImage(file, folder));
  const uploadedProducts = [];
  for (const [order, product] of products.entries()) {
    uploadedProducts.push({
      product,
      order,
      imageUrl: product.imageFile ? await uploadPlaceImage(product.imageFile, `${folder}/products/${product.id}`) : "",
    });
  }

  const batch = writeBatch(db);
  batch.set(submission, { ...payload, submissionCode: reference, coverImage, images, createdAt: serverTimestamp() });
  uploadedProducts.forEach(({ product, order, imageUrl }) => {
    const productRef = doc(collection(submission, "products"));
    batch.set(productRef, {
      name: product.name.trim(),
      ...(product.category.trim() ? { category: product.category.trim() } : {}),
      ...(product.description.trim() ? { description: product.description.trim() } : {}),
      price: Number(product.price),
      ...(imageUrl ? { imageUrl } : {}),
      available: product.available,
      bestseller: product.bestseller,
      preorder: product.preorder,
      order,
      createdAt: serverTimestamp(),
    });
  });
  batch.set(doc(db, "submission_status_public", reference), { submissionCode: reference, name: data.name, status: "pending", updatedAt: serverTimestamp() });
  await batch.commit();
  return { reference, mode: "firebase" };
}