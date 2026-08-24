"use client";
import { LocateFixed, Minus, Plus } from "lucide-react";

export function MapControls({ onLocate, onZoomIn, onZoomOut }: { onLocate: () => void; onZoomIn: () => void; onZoomOut: () => void }) {
  return <div className="map-tools">
    <button onClick={onLocate} aria-label="Gunakan lokasi saya"><LocateFixed size={20} /></button>
    <button onClick={onZoomIn} aria-label="Perbesar peta"><Plus size={20} /></button>
    <button onClick={onZoomOut} aria-label="Perkecil peta"><Minus size={20} /></button>
  </div>;
}
