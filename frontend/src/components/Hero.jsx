import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28"
    >
      {/* Decorative blurs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-primary-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-[320px] w-[320px] rounded-full bg-accent-400/20 blur-3xl" />

      <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-12 px-6 md:flex-row md:gap-16">
        {/* Left — Copy */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 animate-fade-up sm:text-5xl lg:text-6xl">
            Smarter Cities,{" "}
            <span className="gradient-text">Cleaner Streets.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-gray-500 animate-fade-up animate-delay-100 md:text-xl">
            Optimize municipal waste collection using AI and citizen data. No
            sensors required.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 animate-fade-up animate-delay-200 md:justify-start">
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 rounded-full bg-primary-600 px-7 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-700 hover:shadow-xl"
              id="hero-get-started"
            >
              Get Started
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-7 py-3 text-sm font-semibold text-gray-700 transition hover:border-primary-400 hover:text-primary-600"
              id="hero-learn-more"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Right — Hero image card */}
        <div className="relative flex-1 animate-fade-up animate-delay-300">
          <div className="relative mx-auto max-w-md overflow-hidden rounded-2xl shadow-2xl ring-1 ring-gray-200/60 animate-float">
            <img
              src="/hero-truck.png"
              alt="Smart waste collection truck in a clean city"
              className="h-auto w-full object-cover"
              loading="eager"
            />
            {/* Badge overlay */}
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-primary-700 shadow backdrop-blur-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-accent-500" />
              Sustainable City Initiative
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
