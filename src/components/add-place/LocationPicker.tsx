"use client";
import { useEffect } from "react";
import L from "leaflet";
import { MapContainer,Marker,TileLayer,useMap,useMapEvents } from "react-leaflet";
import { useAppTheme } from "@/components/theme/ThemeProvider";
const center:[number,number]=[-6.732,108.552];
const icon=L.divIcon({className:"add-location-icon",html:"<span></span>",iconSize:[26,26],iconAnchor:[13,13]});
function Events({onChange}:{onChange:(lat:number,lng:number)=>void}){useMapEvents({click:e=>onChange(e.latlng.lat,e.latlng.lng)});return null}
function Recenter({position}:{position:[number,number]|null}){const map=useMap();useEffect(()=>{if(position)map.flyTo(position,16,{duration:.5})},[map,position]);return null}
export default function LocationPicker({latitude,longitude,onChange}:{latitude:number|null;longitude:number|null;onChange:(lat:number,lng:number)=>void}){const {theme}=useAppTheme();const position: [number,number]|null=latitude!==null&&longitude!==null?[latitude,longitude]:null;return <div className="add-location-map"><MapContainer center={position??center} zoom={13} scrollWheelZoom><TileLayer key={theme} attribution='&copy; OpenStreetMap contributors &copy; CARTO' url={`https://{s}.basemaps.cartocdn.com/${theme==="dark"?"dark_all":"light_all"}/{z}/{x}/{y}{r}.png`}/><Events onChange={onChange}/><Recenter position={position}/>{position&&<Marker draggable icon={icon} position={position} eventHandlers={{dragend:e=>{const p=e.target.getLatLng();onChange(p.lat,p.lng)}}}/>}</MapContainer></div>}