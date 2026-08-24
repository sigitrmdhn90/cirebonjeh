"use client";
import Link from "next/link";
import { useEffect,useMemo,useState } from "react";
import { Search,Trash2 } from "lucide-react";
import { deleteSubmissionPermanently,subscribeSubmissions } from "@/lib/adminData";
import { categoryById } from "@/data/categories";
import type { AdminSubmission,AdminSubmissionStatus } from "@/types/admin";
import { useAdminAuth } from "./AdminAuthProvider";

export const statusLabels:Record<AdminSubmissionStatus,string>={pending:"Pending",reviewing:"Reviewing",revision_required:"Perlu Revisi",approved:"Approved",rejected:"Rejected"};

export function SubmissionList({limit}:{limit?:number}){
  const{admin}=useAdminAuth();
  const[rows,setRows]=useState<AdminSubmission[]>([]);
  const[search,setSearch]=useState("");
  const[status,setStatus]=useState<"all"|AdminSubmissionStatus>("all");
  const[region,setRegion]=useState("all");
  const[deleting,setDeleting]=useState<AdminSubmission|null>(null);
  const[confirmation,setConfirmation]=useState("");
  const[busy,setBusy]=useState(false);
  const[toast,setToast]=useState("");
  useEffect(()=>subscribeSubmissions(setRows),[]);
  const counts=useMemo(()=>Object.fromEntries(Object.keys(statusLabels).map(value=>[value,rows.filter(row=>row.status===value).length])),[rows]);
  const filtered=useMemo(()=>rows.filter(row=>{const query=`${row.submissionCode} ${row.name} ${row.submitterName} ${row.submitterWhatsapp} ${row.district} ${row.regency}`.toLowerCase();return query.includes(search.toLowerCase())&&(status==="all"||row.status===status)&&(region==="all"||row.regency===region)}).slice(0,limit),[rows,search,status,region,limit]);
  const remove=async()=>{if(!deleting||confirmation!=="HAPUS"||admin?.role!=="super_admin")return;setBusy(true);try{await deleteSubmissionPermanently(deleting.id,deleting.submissionCode);setToast(`Submission ${deleting.submissionCode} dihapus permanen.`);setDeleting(null);setConfirmation("")}catch(error){setToast(error instanceof Error?error.message:"Gagal menghapus submission.")}finally{setBusy(false)}};
  return <div>{toast&&<div className="admin-toast">{toast}<button type="button" onClick={()=>setToast("")}>×</button></div>}<div className="admin-status-grid">{(Object.keys(statusLabels) as AdminSubmissionStatus[]).map(value=><button className={status===value?"active":""} key={value} onClick={()=>setStatus(status===value?"all":value)}><span>{statusLabels[value]}</span><strong>{counts[value]||0}</strong></button>)}</div>{!limit&&<div className="admin-filters"><label><Search size={15}/><input placeholder="Cari kode, nama UMKM, atau pengaju..." value={search} onChange={event=>setSearch(event.target.value)}/></label><select value={status} onChange={event=>setStatus(event.target.value as typeof status)}><option value="all">Semua status</option>{Object.entries(statusLabels).map(([value,label])=><option value={value} key={value}>{label}</option>)}</select><select value={region} onChange={event=>setRegion(event.target.value)}><option value="all">Semua wilayah</option><option>Kota Cirebon</option><option>Kabupaten Cirebon</option></select></div>}<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Kode</th><th>Nama UMKM</th><th>Kategori</th><th>Wilayah</th><th>Pengaju</th><th>Tanggal</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{filtered.map(row=><tr key={row.id}><td data-label="Kode">{row.submissionCode}</td><td data-label="Nama"><strong>{row.name}</strong></td><td data-label="Kategori">{categoryById[row.categoryId]?.name||row.categoryId}</td><td data-label="Wilayah">{row.district}<small>{row.regency}</small></td><td data-label="Pengaju">{row.submitterName}</td><td data-label="Tanggal">{formatDate(row.createdAt)}</td><td data-label="Status"><span className={`status-badge ${row.status}`}>{statusLabels[row.status]}</span></td><td data-label="Aksi"><div className="admin-row-actions"><Link href={`/admin/submissions/${row.id}`}>Lihat</Link>{!limit&&admin?.role==="super_admin"&&row.status!=="approved"&&<button type="button" className="permanent-delete" onClick={()=>{setDeleting(row);setConfirmation("")}}><Trash2 size={13}/> Hapus</button>}</div></td></tr>)}</tbody></table>{!filtered.length&&<div className="admin-empty">Belum ada submission yang sesuai.</div>}</div>{deleting&&<div className="admin-modal-backdrop"><div className="admin-modal permanent-delete-modal"><h2>Hapus submission permanen?</h2><p><strong>{deleting.name}</strong> ({deleting.submissionCode}) beserta produk dan status publiknya akan dihapus. Tindakan ini tidak dapat dibatalkan.</p><label>Ketik <b>HAPUS</b> untuk konfirmasi<input autoFocus value={confirmation} onChange={event=>setConfirmation(event.target.value)} placeholder="HAPUS"/></label><div><button type="button" onClick={()=>{setDeleting(null);setConfirmation("")}}>Batal</button><button type="button" className="danger" disabled={confirmation!=="HAPUS"||busy} onClick={()=>void remove()}>{busy?"Menghapus…":"Hapus Permanen"}</button></div></div></div>}</div>;
}

export function formatDate(value:unknown){if(!value)return "—";const date=typeof value==="object"&&value!==null&&"toDate" in value?(value as{toDate:()=>Date}).toDate():new Date(String(value));return Number.isNaN(date.getTime())?"—":new Intl.DateTimeFormat("id-ID").format(date)}