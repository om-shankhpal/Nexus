import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, Truck, Eye, EyeOff, ArrowLeft } from "lucide-react";
import * as api from "../api";

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("redirect") || "/dashboard";
  }, [location.search]);

  const [mode, setMode] = useState("USER"); // USER | WORKER
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res =
        mode === "WORKER"
          ? await api.loginWorker(email, password)
          : await api.login(email, password);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate(redirectTo);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                Sign in
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Choose your role and login to access the dashboard.
              </p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setMode("USER")}
                className={classNames(
                  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition",
                  mode === "USER"
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                )}
              >
                <User size={16} />
                User
              </button>
              <button
                type="button"
                onClick={() => setMode("WORKER")}
                className={classNames(
                  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition",
                  mode === "WORKER"
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                )}
              >
                <Truck size={16} />
                Worker
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={show ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-11 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute inset-y-0 right-0 inline-flex items-center justify-center px-3 text-gray-400 hover:text-gray-600"
                    aria-label={show ? "Hide password" : "Show password"}
                  >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-gray-500">
              Don’t have an account? Use the{" "}
              <span className="font-semibold text-gray-700">register API</span>{" "}
              first.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

