import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix default marker icons for bundlers (Vite/React).
const markerIcon = new L.Icon({
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url
  ).href,
  shadowUrl: new URL(
    "leaflet/dist/images/marker-shadow.png",
    import.meta.url
  ).href,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function safeNumber(n) {
  const x = Number(n);
  return Number.isFinite(x) ? x : null;
}

export default function BinMap({ bins = [] }) {
  const points = useMemo(() => {
    return (bins || [])
      .map((b) => ({
        id: b._id,
        status: b.status,
        fillLevel: b.fillLevel,
        lat: safeNumber(b?.location?.lat),
        lng: safeNumber(b?.location?.lng),
      }))
      .filter((p) => p.lat !== null && p.lng !== null);
  }, [bins]);

  const center = useMemo(() => {
    if (points.length) return [points[0].lat, points[0].lng];
    // Default: Pune
    return [18.5204, 73.8567];
  }, [points]);

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div>
          <p className="text-sm font-bold text-gray-800">Bins Map</p>
          <p className="text-xs text-gray-500">
            {points.length} bin{points.length === 1 ? "" : "s"} shown
          </p>
        </div>
      </div>

      <div className="h-[380px] w-full">
        <MapContainer
          center={center}
          zoom={12}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {points.map((p) => (
            <Marker
              key={p.id}
              position={[p.lat, p.lng]}
              icon={markerIcon}
            >
              <Popup>
                <div className="space-y-1">
                  <div className="text-sm font-semibold">Bin</div>
                  <div className="text-xs text-gray-600">
                    {p.lat.toFixed(4)}, {p.lng.toFixed(4)}
                  </div>
                  <div className="text-xs">
                    Status: <b>{p.status}</b>
                  </div>
                  <div className="text-xs">
                    Fill: <b>{p.fillLevel}%</b>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

