import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons (Leaflet's defaults break with bundlers)
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  link?: string;
}

interface Props {
  markers: Marker[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onClick?: (lat: number, lng: number) => void;
  picker?: boolean;
}

export function PropertyMap({
  markers,
  center,
  zoom = 6,
  height = "400px",
  onClick,
  picker = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;

    const initialCenter: [number, number] =
      center ??
      (markers.length > 0 ? [markers[0].lat, markers[0].lng] : [54.5, -3.5]);

    const map = L.map(ref.current, { scrollWheelZoom: false }).setView(initialCenter, zoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    if (onClick) {
      map.on("click", (e) => onClick(e.latlng.lat, e.latlng.lng));
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current || !layerRef.current) return;
    layerRef.current.clearLayers();

    markers.forEach((m) => {
      const marker = L.marker([m.lat, m.lng]).addTo(layerRef.current!);
      if (m.label) marker.bindPopup(m.label);
    });

    if (picker && markers.length > 0) {
      mapRef.current.setView([markers[0].lat, markers[0].lng], 12);
    } else if (markers.length > 1) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng] as [number, number]));
      mapRef.current.fitBounds(bounds, { padding: [40, 40] });
    } else if (markers.length === 1) {
      mapRef.current.setView([markers[0].lat, markers[0].lng], 10);
    }
  }, [markers, picker]);

  return (
    <div
      ref={ref}
      style={{ height }}
      className="w-full border border-ink/40 shadow-[4px_4px_0_0_rgba(43,42,39,0.12)]"
    />
  );
}
