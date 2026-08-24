"use client";
import Image from "next/image";
import { ImagePlus,Trash2 } from "lucide-react";
import { useFilePreview } from "@/hooks/useFilePreview";
function Preview({file,onRemove,cover}:{file:File;onRemove:()=>void;cover?:boolean}){const src=useFilePreview(file);return <div className="photo-preview"><Image unoptimized fill src={src} alt={cover?"Pratinjau foto utama":"Pratinjau galeri"}/><button type="button" aria-label="Hapus foto" onClick={onRemove}><Trash2 size={15}/></button>{cover&&<span>Utama</span>}</div>}
export async function prepareImage(file:File):Promise<File>{
  try{
    const source=await new Promise<string>((resolve,reject)=>{
      const reader=new FileReader();
      reader.onload=()=>typeof reader.result==="string"?resolve(reader.result):reject(new Error("Foto tidak dapat dibaca."));
      reader.onerror=()=>reject(reader.error??new Error("Foto tidak dapat dibaca."));
      reader.readAsDataURL(file);
    });
    const image=await new Promise<HTMLImageElement>((resolve,reject)=>{
      const element=new window.Image();
      element.onload=()=>resolve(element);
      element.onerror=()=>reject(new Error("Format foto tidak dapat diproses."));
      element.src=source;
    });
    const scale=Math.min(1,1600/Math.max(image.naturalWidth,image.naturalHeight));
    const canvas=document.createElement("canvas");
    canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));
    canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
    const context=canvas.getContext("2d");
    if(!context)return file;
    context.drawImage(image,0,0,canvas.width,canvas.height);
    const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/webp",.82));
    if(!blob)return file;
    return new File([blob],file.name.replace(/\.[^.]+$/,".webp"),{type:"image/webp",lastModified:file.lastModified});
  }catch{return file}
}export function PhotoUploader({cover,gallery,onCover,onGallery,error,onError}:{cover:File|null;gallery:File[];onCover:(f:File|null)=>void;onGallery:(f:File[])=>void;error?:string;onError:(v:string)=>void}){const accept=async(files:FileList|null,kind:"cover"|"gallery")=>{if(!files)return;const raw=Array.from(files);const invalid=raw.find(f=>!/[\/](jpeg|png|webp)$/.test(f.type)||f.size>5*1024*1024);if(invalid){onError("Gunakan JPG, PNG, atau WebP maksimal 5 MB.");return}onError("");try{const ready=await Promise.all(raw.map(prepareImage));if(kind==="cover")onCover(ready[0]??null);else onGallery([...gallery,...ready].slice(0,5))}catch{onError("Foto tidak dapat dibaca. Coba pilih foto lain.")}};return <div className="photo-uploader"><div className="photo-block"><strong>Foto utama <em>*</em></strong><p>Foto horizontal yang paling mewakili usaha.</p>{cover?<Preview file={cover} cover onRemove={()=>onCover(null)}/>:<label className="photo-drop"><ImagePlus size={22}/><span>Pilih foto utama</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>void accept(e.target.files,"cover")}/></label>}</div><div className="photo-block"><strong>Galeri <small>{gallery.length}/5</small></strong><p>Tambahkan hingga 5 foto menu atau suasana.</p><div className="photo-grid">{gallery.map((f,i)=><Preview key={`${f.name}-${f.lastModified}-${i}`} file={f} onRemove={()=>onGallery(gallery.filter((_,j)=>j!==i))}/>) }{gallery.length<5&&<label className="photo-add"><ImagePlus size={20}/><span>Tambah</span><input multiple type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>void accept(e.target.files,"gallery")}/></label>}</div></div>{error&&<p className="field-error">{error}</p>}</div>}