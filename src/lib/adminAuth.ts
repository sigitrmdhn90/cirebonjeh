import { doc,getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { AdminProfile } from "@/types/admin";
export async function getAdminProfile(uid:string):Promise<AdminProfile|null>{if(!db)return null;const snap=await getDoc(doc(db,"admins",uid));if(!snap.exists())return null;const value={...snap.data(),uid:snap.id} as AdminProfile;return value.active&&(value.role==="admin"||value.role==="super_admin")?value:null}