import { Database, Brain, Route } from "lucide-react";

const steps = [
  {
    icon: Database,
    title: "Data Integration",
    desc: "Ingests citizen complaint data, municipal records, and historical collection patterns into a unified pipeline.",
    highlighted: false,
  },
  {
    icon: Brain,
    title: "AI Prediction",
    desc: "Predicts real-time bin fill levels using machine learning — zero IoT hardware required.",
    highlighted: true,
  },
  {
    icon: Route,
    title: "Route Optimization",
    desc: "Generates the shortest, priority-weighted collection routes that save fuel and time every day.",
    highlighted: false,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center animate-fade-up">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            How it <span className="gradient-text">Works</span>
          </h2>
          <p className="mt-4 text-gray-500">
            Next-generation optimization without hardware cost
          </p>
        </div>

        {/* Step cards */}
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className={`group relative flex flex-col items-start rounded-2xl p-8 transition hover:-translate-y-1 hover:shadow-xl animate-fade-up ${
                step.highlighted
                  ? "bg-primary-600 text-white shadow-xl shadow-primary-600/20"
                  : "bg-white text-gray-800 shadow-md ring-1 ring-gray-100"
              } ${
                i === 0
                  ? "animate-delay-100"
                  : i === 1
                  ? "animate-delay-200"
                  : "animate-delay-300"
              }`}
            >
              {/* Step number */}
              <span
                className={`absolute top-6 right-6 text-5xl font-extrabold ${
                  step.highlighted ? "text-white/10" : "text-gray-100"
                }`}
              >
                0{i + 1}
              </span>

              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl transition group-hover:scale-110 ${
                  step.highlighted
                    ? "bg-white/20 text-white"
                    : "bg-primary-50 text-primary-600"
                }`}
              >
                <step.icon size={28} />
              </div>
              <h3 className="text-lg font-bold">{step.title}</h3>
              <p
                className={`mt-3 text-sm leading-relaxed ${
                  step.highlighted ? "text-primary-100" : "text-gray-500"
                }`}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
