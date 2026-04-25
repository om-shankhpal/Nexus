import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section id="cta" className="py-20">
      <div className="mx-auto max-w-4xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 px-8 py-16 text-center shadow-2xl shadow-primary-700/30 sm:px-16 animate-fade-up">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/5" />

          <h2 className="relative text-3xl font-extrabold text-white sm:text-4xl">
            Ready to optimize your city?
          </h2>
          <p className="relative mt-4 text-primary-200">
            Join municipalities across India saving millions monthly with CrowdBin.
          </p>
          <div className="relative mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-primary-700 shadow-lg transition hover:bg-primary-50 hover:shadow-xl"
              id="cta-demo"
            >
              Request a Demo
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </a>
            <a
              href="#"
              className="inline-flex items-center rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              id="cta-sales"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
