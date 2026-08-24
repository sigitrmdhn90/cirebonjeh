"use client";
import { createContext,useContext,useEffect,useState } from "react";
import { onAuthStateChanged,signInWithEmailAndPassword,signOut,type User } from "firebase/auth";
import { auth,firebaseConfigured } from "@/lib/firebase/client";
import { getAdminProfile } from "@/lib/adminAuth";
import type { AdminProfile } from "@/types/admin";
interface State{user:User|null;admin:AdminProfile|null;adminProfile:AdminProfile|null;isAdmin:boolean;loading:boolean;error:string;login:(email:string,password:string)=>Promise<void>;logout:()=>Promise<void>}
const Context=createContext<State|null>(null);
export function AdminAuthProvider({children}:{children:React.ReactNode}){const [user,setUser]=useState<User|null>(null);const [admin,setAdmin]=useState<AdminProfile|null>(null);const [loading,setLoading]=useState(firebaseConfigured);const [error,setError]=useState("");useEffect(()=>{if(!auth)return;return onAuthStateChanged(auth,async u=>{setLoading(true);setUser(u);setAdmin(u?await getAdminProfile(u.uid):null);setLoading(false)})},[]);const login=async(email:string,password:string)=>{if(!auth)throw new Error("Firebase belum dikonfigurasi.");setError("");try{const result=await signInWithEmailAndPassword(auth,email,password);const profile=await getAdminProfile(result.user.uid);if(!profile){await signOut(auth);throw new Error("Akses tidak diizinkan.")}setAdmin(profile)}catch(e){const message=e instanceof Error?e.message:"Login gagal.";setError(message);throw e}};const logout=async()=>{if(auth)await signOut(auth)};return <Context.Provider value={{user,admin,adminProfile:admin,isAdmin:Boolean(admin),loading,error,login,logout}}>{children}</Context.Provider>}
export function useAdminAuth(){const v=useContext(Context);if(!v)throw new Error("AdminAuthProvider tidak tersedia");return v}