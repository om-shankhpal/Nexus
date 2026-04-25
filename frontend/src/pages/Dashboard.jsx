import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Trash2,
  Route,
  BarChart3,
  Plus,
  RefreshCw,
  Fuel,
  Timer,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Navigation,
  ChevronDown,
  ChevronUp,
  X,
  ShieldAlert,
} from "lucide-react";
import * as api from "../api";
import BinMap from "../components/BinMap";

/* ─────────────────────── helpers ─────────────────────── */
const statusColor = {
  EMPTY: "bg-emerald-100 text-emerald-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  FULL: "bg-red-100 text-red-700",
};

const statusIcon = {
  EMPTY: <CheckCircle2 size={14} />,
  MEDIUM: <AlertTriangle size={14} />,
  FULL: <AlertTriangle size={14} />,
};

function fillBar(level) {
  const pct = Math.min(100, Math.max(0, level));
  let color = "bg-emerald-500";
  if (pct > 70) color = "bg-red-500";
  else if (pct > 30) color = "bg-amber-500";
  return (
    <div className="h-2 w-full rounded-full bg-gray-100">
      <div
        className={`h-2 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ─────────────────── StatsCards ─────────────────── */
function StatsCards({ analytics, bins, isWorker }) {
  const fullBins = bins.filter((b) => b.status === "FULL").length;
  const hazardousBins = bins.filter((b) => b.segregationType === "E_WASTE").length;
  const collectedBins = bins.filter((b) => b.status === "EMPTY").length;

  const cards = [
    {
      label: "Total Bins",
      value: bins.length,
      icon: Trash2,
      accent: "text-primary-600 bg-primary-50",
    },
    {
      label: "Collected Bins",
      value: collectedBins,
      icon: CheckCircle2,
      accent: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Full Bins",
      value: fullBins,
      icon: AlertTriangle,
      accent: "text-red-600 bg-red-50",
    },
    {
      label: "Hazardous Bins",
      value: hazardousBins,
      icon: ShieldAlert,
      accent: "text-orange-600 bg-orange-50",
    },
  ];

  if (isWorker) {
    cards.push({
      label: "Routes Executed",
      value: analytics?.totalRoutesExecuted ?? 0,
      icon: Route,
      accent: "text-violet-600 bg-violet-50",
    });
    cards.push({
      label: "Avg Distance (km)",
      value: (analytics?.averageRouteDistance ?? 0).toFixed(1),
      icon: Navigation,
      accent: "text-accent-600 bg-emerald-50",
    });
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
        >
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${c.accent} transition group-hover:scale-110`}
          >
            <c.icon size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{c.value}</p>
            <p className="text-xs text-gray-500">{c.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────── AddBinModal ─────────────────── */
function AddBinModal({ onClose, onCreated }) {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [fillLevel, setFillLevel] = useState(0);
  const [segregationType, setSegregationType] = useState("MIXED");
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGetLocation = () => {
    setError("");
    setLocLoading(true);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLocLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setLocLoading(false);
      },
      (err) => {
        setError("Unable to retrieve your location");
        setLocLoading(false);
      }
    );
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (lat === "" || lng === "") return setError("Latitude and longitude are required");
    setLoading(true);
    try {
      await api.createBin({
        location: { lat: Number(lat), lng: Number(lng) },
        fillLevel: Number(fillLevel),
        segregationType,
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-fade-up"
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Add New Bin</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
        )}

        <div className="mb-4 flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <button
            type="button"
            onClick={handleGetLocation}
            disabled={locLoading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-50"
          >
            <MapPin size={14} />
            {locLoading ? "Detecting..." : "Use Live Location"}
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs text-gray-500">Latitude</label>
            <input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              placeholder="e.g. 19.0760"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Longitude</label>
            <input
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              placeholder="e.g. 72.8777"
            />
          </div>
        </div>

        <label className="mb-1 block text-sm font-medium text-gray-700">
          Fill Level ({fillLevel}%)
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={fillLevel}
          onChange={(e) => setFillLevel(e.target.value)}
          className="mb-4 w-full accent-primary-600"
          id="add-bin-fill"
        />

        <label className="mb-1 block text-sm font-medium text-gray-700">Segregation Type</label>
        <select
          value={segregationType}
          onChange={(e) => setSegregationType(e.target.value)}
          className="mb-6 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        >
          <option value="WET">WET</option>
          <option value="DRY">DRY</option>
          <option value="PLASTIC">PLASTIC</option>
          <option value="E_WASTE">E_WASTE</option>
          <option value="MIXED">MIXED</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-50"
          id="add-bin-submit"
        >
          {loading ? "Creating…" : "Create Bin"}
        </button>
      </form>
    </div>
  );
}

/* ─────────────────── BinTable ─────────────────── */
function BinTable({ bins, onRefresh }) {
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState(0);
  const [busy, setBusy] = useState(false);

  async function handleUpdate(id) {
    setBusy(true);
    try {
      await api.updateBinFillLevel(id, Number(editValue));
      setEditId(null);
      onRefresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this bin?")) return;
    try {
      await api.deleteBin(id);
      onRefresh();
    } catch (err) {
      alert(err.message);
    }
  }

  if (!bins.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-100">
        <Trash2 size={40} className="mb-3 text-gray-300" />
        <p className="text-gray-400">No bins yet. Add your first bin above.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" id="bin-table">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Fill Level</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Last Collected</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bins.map((bin) => (
              <tr
                key={bin._id}
                className="border-b border-gray-50 transition hover:bg-gray-50/50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="font-medium text-gray-700">
                      {bin.location.lat.toFixed(4)}, {bin.location.lng.toFixed(4)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 w-40">
                  {editId === bin._id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-sm outline-none focus:border-primary-400"
                      />
                      <button
                        onClick={() => handleUpdate(bin._id)}
                        disabled={busy}
                        className="rounded-lg bg-primary-600 px-2 py-1 text-xs text-white hover:bg-primary-700 disabled:opacity-50"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setEditId(bin._id);
                        setEditValue(bin.fillLevel);
                      }}
                      title="Click to edit"
                    >
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-medium text-gray-600">{bin.fillLevel}%</span>
                      </div>
                      {fillBar(bin.fillLevel)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor[bin.status]
                      }`}
                  >
                    {statusIcon[bin.status]}
                    {bin.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-xs">
                  {bin.lastCollectedAt
                    ? new Date(bin.lastCollectedAt).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(bin._id)}
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                    title="Delete bin"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════ DASHBOARD PAGE ═══════════════════ */
export default function Dashboard() {
  const [bins, setBins] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [tab, setTab] = useState("bins"); // bins | routes
  const [driverLocation, setDriverLocation] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isWorker = user.role === "WORKER";

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [binsRes, statsRes] = await Promise.all([
        api.getBins(),
        api.getAnalytics(),
      ]);
      setBins(binsRes.data || []);
      setAnalytics(statsRes.data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const tabs = [
    { key: "bins", label: "Bins", icon: Trash2 },
    ...(isWorker ? [{ key: "routes", label: "Routes", icon: Route }] : []),
  ];

  // Extracted RoutePanel logic to share driverLocation state with Map
  const [routeData, setRouteData] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [routeError, setRouteError] = useState("");

  async function handleGenerate() {
    setGenerating(true);
    setRouteError("");

    try {
      const dLat = 19.855;
      const dLng = 75.335;
      setDriverLocation({ lat: dLat, lng: dLng });

      const res = await api.generateRoute({
        driverLat: dLat,
        driverLng: dLng,
        driverId: user.id,
      });
      setRouteData(res.data);
      await fetchData();
      setTab("routes"); // Auto-switch to routes tab to see result
    } catch (err) {
      setRouteError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  async function loadHistory() {
    setLoadingHistory(true);
    try {
      const res = await api.getRouteHistory();
      setHistory(res.data || []);
    } catch (err) {
      setRouteError(err.message);
    } finally {
      setLoadingHistory(false);
    }
  }

  useEffect(() => {
    if (showHistory) loadHistory();
  }, [showHistory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-400 transition hover:text-primary-600"
              id="dashboard-back"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-2">
              <LayoutDashboard size={20} className="text-primary-600" />
              <h1 className="text-lg font-bold text-gray-900">
                {isWorker ? "Driver Dashboard" : "User Dashboard"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-primary-300 hover:text-primary-600"
              id="refresh-btn"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-primary-700"
              id="add-bin-btn"
            >
              <Plus size={16} />
              Add Bin
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        {/* Stats row */}
        <StatsCards analytics={analytics} bins={bins} isWorker={isWorker} />

        {/* Live Map (Always visible for workers) */}
        {isWorker && (
          <div className="animate-fade-up">
            <BinMap
              bins={bins}
              driverLocation={driverLocation}
              routePath={routeData?.optimizedPath}
            />
          </div>
        )}

        {/* Tabs */}
        {tabs.length > 1 && (
          <div className="flex gap-1 rounded-xl bg-gray-100 p-1 w-fit">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition ${tab === t.key
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                <t.icon size={16} />
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {tab === "bins" && (
          <div className="animate-fade-up">
            <BinTable bins={bins} onRefresh={fetchData} />
          </div>
        )}

        {tab === "routes" && (
          <div className="animate-fade-up space-y-4">
            {/* Generate button */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary-700 disabled:opacity-50"
                id="generate-route-btn"
              >
                <Navigation size={16} className={generating ? "animate-spin" : ""} />
                {generating ? "Optimizing…" : "Generate Optimized Route"}
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:border-primary-300 hover:text-primary-600"
              >
                {showHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {showHistory ? "Hide History" : "View History"}
              </button>
            </div>

            {routeError && (
              <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{routeError}</p>
            )}

            {/* Latest generated route */}
            {routeData && (
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 animate-fade-up">
                <h4 className="mb-4 text-sm font-bold text-gray-800">Generated Route</h4>
                {routeData.optimizedPath?.length === 0 ? (
                  <p className="text-sm text-gray-400">No priority bins found — no route generated.</p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-3 rounded-xl bg-primary-50 p-4">
                      <MapPin size={20} className="text-primary-600" />
                      <div>
                        <p className="text-lg font-bold text-primary-700">
                          {routeData.optimizedPath?.length ?? 0}
                        </p>
                        <p className="text-xs text-primary-500">Stops</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4">
                      <Fuel size={20} className="text-emerald-600" />
                      <div>
                        <p className="text-lg font-bold text-emerald-700">
                          {(routeData.totalDistance ?? 0).toFixed(2)} km
                        </p>
                        <p className="text-xs text-emerald-500">Total Distance</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-violet-50 p-4">
                      <Timer size={20} className="text-violet-600" />
                      <div>
                        <p className="text-lg font-bold text-violet-700">
                          {routeData.route?.estimatedTime ?? 0} min
                        </p>
                        <p className="text-xs text-violet-500">Est. Time</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Path waypoints */}
                {routeData.optimizedPath?.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Waypoints (Starting from Your Location)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {routeData.optimizedPath.map((pt, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                        >
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                            {i + 1}
                          </span>
                          {pt.lat.toFixed(4)}, {pt.lng.toFixed(4)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Route history */}
            {showHistory && (
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 animate-fade-up">
                <h4 className="mb-4 text-sm font-bold text-gray-800">Route History</h4>
                {loadingHistory ? (
                  <p className="text-sm text-gray-400">Loading…</p>
                ) : history.length === 0 ? (
                  <p className="text-sm text-gray-400">No routes generated yet.</p>
                ) : (
                  <div className="space-y-3">
                    {history.slice(0, 10).map((r) => (
                      <div
                        key={r._id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 p-4 transition hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4">
                          <Route size={16} className="text-primary-500" />
                          <div>
                            <p className="text-sm font-semibold text-gray-700">
                              {r.bins?.length ?? 0} bins · {(r.totalDistance ?? 0).toFixed(2)} km
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(r.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-600">
                          {r.estimatedTime ?? 0} min
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add bin modal */}
      {showAddModal && (
        <AddBinModal
          onClose={() => setShowAddModal(false)}
          onCreated={fetchData}
        />
      )}
    </div>
  );
}
