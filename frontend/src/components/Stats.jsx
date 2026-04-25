import { Fuel, Zap, IndianRupee } from "lucide-react";

const stats = [
  {
    icon: Fuel,
    value: "43%",
    label: "Fuel Saved",
    sub: "Reduced fleet fuel consumption",
  },
  {
    icon: Zap,
    value: "2.5×",
    label: "Faster Routes",
    sub: "AI-optimized collection paths",
  },
  {
    icon: IndianRupee,
    value: "₹2.7M",
    label: "Monthly Savings",
    sub: "Operational cost reduction",
  },
];

export default function Stats() {
  return (
    <section id="stats" className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`group relative flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-md ring-1 ring-gray-100 transition hover:shadow-xl hover:-translate-y-1 animate-fade-up ${
                i === 0
                  ? "animate-delay-100"
                  : i === 1
                  ? "animate-delay-200"
                  : "animate-delay-300"
              }`}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500/10 text-accent-600 transition group-hover:scale-110">
                <s.icon size={24} />
              </div>
              <p className="text-3xl font-extrabold text-accent-600">{s.value}</p>
              <p className="mt-1 text-sm font-semibold text-gray-800">{s.label}</p>
              <p className="mt-2 text-xs text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
