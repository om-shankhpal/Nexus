const BASE = "/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Request failed");
  return json;
}

/* ── Bins ── */
export const getBins = () => request("/bins");

export const createBin = (data) =>
  request("/bins", { method: "POST", body: JSON.stringify(data) });

export const updateBinFillLevel = (id, fillLevel) =>
  request(`/bins/${id}`, {
    method: "PUT",
    body: JSON.stringify({ fillLevel }),
  });

export const deleteBin = (id) =>
  request(`/bins/${id}`, { method: "DELETE" });

/* ── Routes ── */
export const generateRoute = (coords) =>
  request("/route/generate", {
    method: "POST",
    body: JSON.stringify(coords || {}),
  });

export const getRouteHistory = () => request("/route/history");

/* ── Complaints ── */
export const createComplaint = (data) =>
  request("/complaints", { method: "POST", body: JSON.stringify(data) });

export const getMyComplaints = () => request("/complaints/mine");

/* ── Stats ── */
export const getAnalytics = () => request("/stats");

/* ── Auth ── */
export const register = (data) =>
  request("/auth/register", { method: "POST", body: JSON.stringify(data) });

export const login = (email, password) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const loginWorker = (email, password) =>
  request("/auth/worker/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
