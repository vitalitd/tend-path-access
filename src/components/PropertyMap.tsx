import { useEffect, useRef } from "react";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const layerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !ref.current || mapRef.current) return;

    let cancelled = false;

    void (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (cancelled || !ref.current) return;

      // Fix default marker icons (Leaflet's defaults break with bundlers)
      delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const initialCenter: [number, number] =
        center ??
        (markers.length > 0 ? [markers[0].lat, markers[0].lng] : [54.5, -3.5]);

      const map = L.map(ref.current, { scrollWheelZoom: false }).setView(initialCenter, zoom);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      LRef.current = L;

      if (onClick) {
        map.on("click", (e: { latlng: { lat: number; lng: number } }) =>
          onClick(e.latlng.lat, e.latlng.lng)
        );
      }

      renderMarkers();
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderMarkers = () => {
    const L = LRef.current;
    if (!mapRef.current || !layerRef.current || !L) return;
    layerRef.current.clearLayers();

    markers.forEach((m) => {
      const marker = L.marker([m.lat, m.lng]).addTo(layerRef.current);
      if (m.label) marker.bindPopup(m.label);
    });

    if (picker && markers.length > 0) {
      mapRef.current.setView([markers[0].lat, markers[0].lng], 12);
    } else if (markers.length > 1) {
      const bounds = L.latLngBounds(
        markers.map((m) => [m.lat, m.lng] as [number, number])
      );
      mapRef.current.fitBounds(bounds, { padding: [40, 40] });
    } else if (markers.length === 1) {
      mapRef.current.setView([markers[0].lat, markers[0].lng], 10);
    }
  };

  useEffect(() => {
    renderMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers, picker]);

  return (
    <div
      ref={ref}
      style={{ height }}
      className="w-full border border-ink/40 shadow-[4px_4px_0_0_rgba(43,42,39,0.12)]"
    />
  );
}
