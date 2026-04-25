import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

function createCustomIcon(p) {
  let color = "#10b981"; // green-500 (EMPTY)

  if (p.segregationType === "E_WASTE" || p.status === "FULL") {
    color = "#ef4444"; // red-500
  } else if (p.status === "MEDIUM") {
    color = "#eab308"; // yellow-500
  }

  const html = `
    <svg class="animate-pulse" style="filter: drop-shadow(0 0 8px ${color}); overflow: visible;" width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C12 22 4 15 4 9C4 4.58172 7.58172 1 12 1C16.4183 1 20 4.58172 20 9C20 15 12 22 12 22ZM12 13C14.2091 13 16 11.2091 16 9C16 6.79086 14.2091 5 12 5C9.79086 5 8 6.79086 8 9C8 11.2091 9.79086 13 12 13Z" fill="${color}"/>
    </svg>
  `;
  
  return new L.divIcon({
    html,
    className: "custom-map-marker bg-transparent border-none",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

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
        segregationType: b.segregationType,
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

  const indiaBounds = [
    [6.4626999, 68.1097], // South-West point
    [35.513327, 97.3953586], // North-East point
  ];

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 px-6 py-4 gap-4">
        <div>
          <p className="text-sm font-bold text-gray-800">Bins Map</p>
          <p className="text-xs text-gray-500">
            {points.length} bin{points.length === 1 ? "" : "s"} shown
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C12 22 4 15 4 9C4 4.58172 7.58172 1 12 1C16.4183 1 20 4.58172 20 9C20 15 12 22 12 22ZM12 13C14.2091 13 16 11.2091 16 9C16 6.79086 14.2091 5 12 5C9.79086 5 8 6.79086 8 9C8 11.2091 9.79086 13 12 13Z" fill="#ef4444"/></svg>
            <span className="text-xs font-semibold text-gray-700">Full / Hazardous</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C12 22 4 15 4 9C4 4.58172 7.58172 1 12 1C16.4183 1 20 4.58172 20 9C20 15 12 22 12 22ZM12 13C14.2091 13 16 11.2091 16 9C16 6.79086 14.2091 5 12 5C9.79086 5 8 6.79086 8 9C8 11.2091 9.79086 13 12 13Z" fill="#eab308"/></svg>
            <span className="text-xs font-semibold text-gray-700">Partially Filled</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C12 22 4 15 4 9C4 4.58172 7.58172 1 12 1C16.4183 1 20 4.58172 20 9C20 15 12 22 12 22ZM12 13C14.2091 13 16 11.2091 16 9C16 6.79086 14.2091 5 12 5C9.79086 5 8 6.79086 8 9C8 11.2091 9.79086 13 12 13Z" fill="#10b981"/></svg>
            <span className="text-xs font-semibold text-gray-700">Empty</span>
          </div>
        </div>
      </div>

      <div className="h-[380px] w-full">
        <MapContainer
          center={center}
          zoom={12}
          minZoom={4.5}
          maxBounds={indiaBounds}
          maxBoundsViscosity={1.0}
          scrollWheelZoom={true}
          className="h-full w-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {points.map((p) => (
            <Marker
              key={p.id}
              position={[p.lat, p.lng]}
              icon={createCustomIcon(p)}
            >
              <Popup>
                <div className="space-y-1">
                  <div className="text-sm font-semibold">Bin Details</div>
                  <div className="text-xs text-gray-600">
                    {p.lat.toFixed(4)}, {p.lng.toFixed(4)}
                  </div>
                  <div className="text-xs">
                    Status: <b>{p.status}</b>
                  </div>
                  <div className="text-xs">
                    Fill: <b>{p.fillLevel}%</b>
                  </div>
                  <div className="text-xs">
                    Type: <b>{p.segregationType}</b>
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

