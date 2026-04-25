import { Leaf, TrendingDown, Building2 } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "Sustainability First",
    desc: "Reduce carbon emissions and landfill overflow through data-driven scheduling and smarter resource allocation.",
    color: "text-accent-600",
    bg: "bg-accent-500/10",
  },
  {
    icon: TrendingDown,
    title: "Cost Reduction",
    desc: "Cut operational expenses by up to 40% with AI-optimized routes that minimize fuel usage and overtime.",
    color: "text-primary-600",
    bg: "bg-primary-50",
  },
  {
    icon: Building2,
    title: "Municipal Efficiency",
    desc: "Give city administrators real-time dashboards, predictive alerts, and one-click route generation.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

export default function Features() {
  return (
    <section id="product" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center animate-fade-up">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Built for <span className="gradient-text">Impact</span>
          </h2>
          <p className="mt-4 text-gray-500">
            Every feature designed to make cities cleaner, greener, and more efficient
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`group flex flex-col rounded-2xl bg-white p-8 shadow-md ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-xl animate-fade-up ${
                i === 0
                  ? "animate-delay-100"
                  : i === 1
                  ? "animate-delay-200"
                  : "animate-delay-300"
              }`}
            >
              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${f.bg} ${f.color} transition group-hover:scale-110`}
              >
                <f.icon size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{f.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-500">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
