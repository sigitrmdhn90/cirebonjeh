"use client";
import Link from "next/link";
import {useRouter}from"next/navigation";
import{Store}from"lucide-react";
import{useAdminAuth}from"./AdminAuthProvider";
export function AdminLoginForm(){const router=useRouter();const{error,login}=useAdminAuth();return <main className="admin-gate"><form onSubmit={e=>{e.preventDefault();const f=new FormData(e.currentTarget);void login(String(f.get("email")),String(f.get("password"))).then(()=>router.replace("/admin")).catch(()=>{})}}><Store size={27}/><h1>Login Admin</h1><p>Gunakan akun Firebase yang terdaftar aktif pada collection admins.</p><label>Email<input name="email" type="email" autoComplete="email" required/></label><label>Password<input name="password" type="password" autoComplete="current-password" required/></label>{error&&<p className="admin-error">{error}</p>}<button type="submit">Masuk</button><Link href="/">Kembali ke aplikasi publik</Link></form></main>}