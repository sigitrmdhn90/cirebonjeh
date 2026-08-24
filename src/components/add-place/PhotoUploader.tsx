"use client";
import Image from "next/image";
import { ImagePlus,Trash2 } from "lucide-react";
import { useFilePreview } from "@/hooks/useFilePreview";
function Preview({file,onRemove,cover}:{file:File;onRemove:()=>void;cover?:boolean}){const src=useFilePreview(file);return <div className="photo-preview"><Image unoptimized fill src={src} alt={cover?"Pratinjau foto utama":"Pratinjau galeri"}/><button type="button" aria-label="Hapus foto" onClick={onRemove}><Trash2 size={15}/></button>{cover&&<span>Utama</span>}</div>}
export async function prepareImage(file:File):Promise<File>{
  const bitmap=await createImageBitmap(file,{imageOrientation:"from-image"});
  try{
    const scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));
    const canvas=document.createElement("canvas");
    canvas.width=Math.max(1,Math.round(bitmap.width*scale));
    canvas.height=Math.max(1,Math.round(bitmap.height*scale));
    const context=canvas.getContext("2d");
    if(!context)throw new Error("Foto tidak dapat diproses di perangkat ini.");
    context.drawImage(bitmap,0,0,canvas.width,canvas.height);
    const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/webp",.82));
    if(!blob)throw new Error("Foto gagal dikonversi.");
    return new File([blob],file.name.replace(/\.[^.]+$/,".webp"),{type:"image/webp",lastModified:file.lastModified});
  }finally{bitmap.close()}
}
export function PhotoUploader({cover,gallery,onCover,onGallery,error,onError}:{cover:File|null;gallery:File[];onCover:(f:File|null)=>void;onGallery:(f:File[])=>void;error?:string;onError:(v:string)=>void}){const accept=async(files:FileList|null,kind:"cover"|"gallery")=>{if(!files)return;const raw=Array.from(files);const invalid=raw.find(f=>!/[\/](jpeg|png|webp)$/.test(f.type)||f.size>5*1024*1024);if(invalid){onError("Gunakan JPG, PNG, atau WebP maksimal 5 MB.");return}onError("");const ready=await Promise.all(raw.map(prepareImage));if(kind==="cover")onCover(ready[0]??null);else onGallery([...gallery,...ready].slice(0,5))};return <div className="photo-uploader"><div className="photo-block"><strong>Foto utama <em>*</em></strong><p>Foto horizontal yang paling mewakili usaha.</p>{cover?<Preview file={cover} cover onRemove={()=>onCover(null)}/>:<label className="photo-drop"><ImagePlus size={22}/><span>Pilih foto utama</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>void accept(e.target.files,"cover")}/></label>}</div><div className="photo-block"><strong>Galeri <small>{gallery.length}/5</small></strong><p>Tambahkan hingga 5 foto menu atau suasana.</p><div className="photo-grid">{gallery.map((f,i)=><Preview key={`${f.name}-${f.lastModified}-${i}`} file={f} onRemove={()=>onGallery(gallery.filter((_,j)=>j!==i))}/>) }{gallery.length<5&&<label className="photo-add"><ImagePlus size={20}/><span>Tambah</span><input multiple type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>void accept(e.target.files,"gallery")}/></label>}</div></div>{error&&<p className="field-error">{error}</p>}</div>}