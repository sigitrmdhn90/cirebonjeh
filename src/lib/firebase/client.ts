import { getApp,getApps,initializeApp,type FirebaseApp } from "firebase/app";
import { getAuth,type Auth } from "firebase/auth";
import { getFirestore,type Firestore } from "firebase/firestore";
import { getStorage,type FirebaseStorage } from "firebase/storage";

const requiredEnv={
  apiKey:process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
} as const;

export const firebaseConfigured=Object.values(requiredEnv).every(Boolean);
export const missingFirebaseEnv=Object.entries(requiredEnv).filter(([,value])=>!value).map(([key])=>key);
const firebaseConfig={...requiredEnv,measurementId:process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID};

export let firebaseApp:FirebaseApp|null=null;
export let auth:Auth|null=null;
export let db:Firestore|null=null;
export let storage:FirebaseStorage|null=null;

if(firebaseConfigured){
  firebaseApp=getApps().length?getApp():initializeApp(firebaseConfig);
  auth=getAuth(firebaseApp);
  db=getFirestore(firebaseApp);
  storage=getStorage(firebaseApp);
}