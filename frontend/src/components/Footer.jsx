import { Send } from "lucide-react";

const columns = [
  {
    heading: "Regions",
    links: ["Maharashtra", "Karnataka", "Tamil Nadu", "Delhi NCR", "Gujarat"],
  },
  {
    heading: "Company",
    links: ["About", "Careers", "Blog", "Press", "Contact"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-16">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-4">
        {/* Brand */}
        <div>
          <a href="#" className="text-2xl font-extrabold tracking-tight">
            <span className="gradient-text">CrowdBin</span>
          </a>
          <p className="mt-4 text-sm leading-relaxed text-gray-500">
            AI-powered waste management for smarter, cleaner, and more sustainable cities.
          </p>
        </div>

        {/* Link columns */}
        {columns.map((col) => (
          <div key={col.heading}>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
              {col.heading}
            </h4>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-gray-600 transition hover:text-primary-600"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Newsletter */}
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Newsletter
          </h4>
          <p className="mb-4 text-sm text-gray-500">
            Get the latest updates on smart city tech.
          </p>
          <form
            className="flex overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-primary-400"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="you@email.com"
              className="flex-1 bg-transparent px-4 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400"
              id="footer-email"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-primary-600 px-5 text-sm font-semibold text-white transition hover:bg-primary-700"
              id="footer-subscribe"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto mt-12 max-w-7xl border-t border-gray-100 px-6 pt-6">
        <p className="text-center text-xs text-gray-400">
          © {new Date().getFullYear()} CrowdBin. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
