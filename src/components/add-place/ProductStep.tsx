"use client";

import Image from "next/image";
import { ImagePlus, Pencil, Plus, Store, Trash2, X } from "lucide-react";
import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { useFilePreview } from "@/hooks/useFilePreview";
import { MAX_INITIAL_PRODUCTS, type SubmissionProductDraft } from "@/types/menuItem";
import { prepareImage } from "./PhotoUploader";

const emptyProduct = (order: number): SubmissionProductDraft => ({
  id: crypto.randomUUID(), name: "", category: "", price: "", description: "",
  imageFile: null, available: true, bestseller: false, preorder: false, order,
});

function ProductImage({ product }: { product: SubmissionProductDraft }) {
  const src = useFilePreview(product.imageFile);
  return <span className="product-draft-image">{src ? <Image unoptimized fill src={src} alt={`Foto ${product.name || "produk"}`} /> : <Store size={22} />}</span>;
}

export function ProductStep({ products, onChange, error, onError }: { products: SubmissionProductDraft[]; onChange: (products: SubmissionProductDraft[]) => void; error?: string; onError: (message: string) => void }) {
  const [editing, setEditing] = useState<SubmissionProductDraft | null>(null);
  const [formError, setFormError] = useState("");
  const openNew = () => { if (products.length < MAX_INITIAL_PRODUCTS) { setFormError(""); setEditing(emptyProduct(products.length)); } };
  const save = () => {
    if (!editing) return;
    if (editing.name.trim().length < 2) { setFormError("Nama produk minimal 2 karakter."); return; }
    const price = Number(editing.price);
    if (!Number.isFinite(price) || price <= 0) { setFormError("Harga produk wajib lebih dari 0."); return; }
    const exists = products.some((product) => product.id === editing.id);
    const next = exists ? products.map((product) => product.id === editing.id ? editing : product) : [...products, editing];
    onChange(next.map((product, order) => ({ ...product, order })));
    onError(""); setEditing(null); setFormError("");
  };
  const remove = (id: string) => onChange(products.filter((product) => product.id !== id).map((product, order) => ({ ...product, order })));
  const chooseImage = async (files: FileList | null) => {
    const file = files?.[0]; if (!file || !editing) return;
    if (!/[\/](jpeg|png|webp)$/.test(file.type) || file.size > 5 * 1024 * 1024) { setFormError("Gunakan JPG, PNG, atau WebP maksimal 5 MB."); return; }
    try { setEditing({ ...editing, imageFile: await prepareImage(file) }); setFormError(""); } catch { setFormError("Foto tidak dapat dibaca. Coba pilih foto lain."); }
  };
  return <div className="product-step">
    <div className="product-step-intro"><div><strong>Produk / Menu</strong><p>Tambahkan produk atau menu yang ingin ditampilkan di halaman usaha Anda.</p></div><button type="button" onClick={openNew} disabled={products.length >= MAX_INITIAL_PRODUCTS}><Plus size={15} /> Tambah Produk</button></div>
    <div className="product-limit"><span>Minimal 1 produk</span><b>{products.length}/{MAX_INITIAL_PRODUCTS}</b></div>
    {products.length ? <div className="product-draft-list">{products.map((product) => <article key={product.id}><ProductImage product={product} /><div><strong>{product.name}</strong><span>{formatPrice(Number(product.price))}</span><small>{[product.bestseller&&"Best Seller",product.preorder&&"Pre-order",!product.available&&"Tidak tersedia"].filter(Boolean).join(" • ")||"Tersedia"}</small></div><div className="product-draft-actions"><button type="button" onClick={() => { setFormError(""); setEditing({ ...product }); }} aria-label={`Edit ${product.name}`}><Pencil size={14} /></button><button type="button" onClick={() => remove(product.id)} aria-label={`Hapus ${product.name}`}><Trash2 size={14} /></button></div></article>)}</div> : <div className="product-empty"><Store size={25} /><strong>Belum ada produk</strong><span>Tambahkan minimal satu produk sebelum melanjutkan.</span></div>}
    {error && <p className="field-error">{error}</p>}
    {editing && <div className="product-modal-backdrop"><section className="product-modal" role="dialog" aria-modal="true" aria-label="Form produk"><header><div><strong>{products.some((product) => product.id === editing.id) ? "Edit Produk" : "Tambah Produk"}</strong><span>Lengkapi informasi produk.</span></div><button type="button" onClick={() => setEditing(null)} aria-label="Tutup"><X size={18} /></button></header><div className="product-modal-fields"><label><span>Nama Produk *</span><input value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} placeholder="Contoh: Nugget Ayam" /></label><label><span>Kategori Produk</span><input value={editing.category} onChange={(event) => setEditing({ ...editing, category: event.target.value })} placeholder="Contoh: Frozen Food" /></label><label><span>Harga *</span><input type="number" min="1" value={editing.price} onChange={(event) => setEditing({ ...editing, price: event.target.value })} placeholder="28000" /></label><label className="full"><span>Deskripsi singkat</span><textarea rows={3} maxLength={250} value={editing.description} onChange={(event) => setEditing({ ...editing, description: event.target.value })} placeholder="Nugget ayam homemade." /></label><label className="product-image-input full"><span>Foto Produk</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void chooseImage(event.target.files)} /><ImagePlus size={16} />{editing.imageFile ? editing.imageFile.name : "Pilih foto produk"}</label><label className="product-switch"><input type="checkbox" checked={editing.bestseller} onChange={(event) => setEditing({ ...editing, bestseller: event.target.checked })} /><span>Best Seller</span></label><label className="product-switch"><input type="checkbox" checked={editing.preorder} onChange={(event) => setEditing({ ...editing, preorder: event.target.checked })} /><span>Pre-order</span></label><label className="product-switch"><input type="checkbox" checked={editing.available} onChange={(event) => setEditing({ ...editing, available: event.target.checked })} /><span>Status tersedia</span></label></div>{formError && <p className="field-error">{formError}</p>}<footer><button type="button" className="add-back" onClick={() => setEditing(null)}>Batal</button><button type="button" className="add-next" onClick={save}>Simpan Produk</button></footer></section></div>}
  </div>;
}