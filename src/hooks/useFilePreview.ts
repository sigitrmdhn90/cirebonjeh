"use client";
import { useEffect,useState } from "react";

export function useFilePreview(file:File|null){
  const[src,setSrc]=useState("");
  useEffect(()=>{
    if(!file)return
    let active=true;
    const reader=new FileReader();
    reader.onload=()=>{if(active&&typeof reader.result==="string")setSrc(reader.result)};
    reader.onerror=()=>{if(active)setSrc("")};
    reader.readAsDataURL(file);
    return()=>{active=false;if(reader.readyState===FileReader.LOADING)reader.abort()};
  },[file]);
  return file?src:"";
}