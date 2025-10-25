"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Props = { height?: string; city?: string };

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const masterIcon = L.icon({
  iconUrl:
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 24 24' fill='black'>
         <path d='M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z'/>
       </svg>`
    ),
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

export default function MapWithMasters({ height = "320px", city = "Калуга" }: Props) {
  const { data } = useSWR<{ center: [number, number]; members: string[] }>(
    `/api/masters/all?city=${encodeURIComponent(city)}`,
    fetcher,
    { refreshInterval: 5000, revalidateOnFocus: true }
  );

  const center = data?.center ?? [54.5138, 36.2612]; // Калуга дефолт
  const positions = useMemo<[number, number][]>(() => {
    if (!data?.members) return [];
    // ожидаем members как ["lon,lat", "..."]; меняем на [lat, lon]
    return data.members
      .map((s) => s.split(",").map((n) => Number(n.trim())) as [number, number])
      .filter((p) => Number.isFinite(p[0]) && Number.isFinite(p[1]))
      .map(([lon, lat]) => [lat, lon]);
  }, [data?.members]);

  return (
    <div style={{ height }} className="w-full overflow-hidden rounded-2xl">
      <MapContainer center={center as any} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap, &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {positions.map(([lat, lon], idx) => (
          <Marker key={idx} position={[lat, lon]} icon={masterIcon}>
            <Popup>Мастер #{idx + 1}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
