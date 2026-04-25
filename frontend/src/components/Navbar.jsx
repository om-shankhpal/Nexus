import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = ["Product", "Solutions", "Impact"];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 glass-card shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight" id="navbar-logo">
          <span className="gradient-text">CrowdBin</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" id="navbar-links">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm font-medium text-gray-600 transition hover:text-primary-600"
            >
              {link}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <Link
          to="/login"
          className="hidden rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-primary-700 hover:shadow-lg md:inline-flex"
          id="navbar-login"
        >
          Login
        </Link>

        {/* Mobile toggle */}
        <button
          className="inline-flex md:hidden text-gray-700"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          id="navbar-mobile-toggle"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-gray-100 bg-white px-6 pb-4 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="block py-3 text-sm font-medium text-gray-600 transition hover:text-primary-600"
              onClick={() => setOpen(false)}
            >
              {link}
            </a>
          ))}
          <Link
            to="/login"
            className="mt-2 block w-full rounded-full bg-primary-600 py-2.5 text-center text-sm font-semibold text-white shadow-md transition hover:bg-primary-700"
            onClick={() => setOpen(false)}
          >
            Login
          </Link>
        </div>
      )}
    </header>
  );
}
