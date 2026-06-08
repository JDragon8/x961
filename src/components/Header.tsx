"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            JSysTeM
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-8" aria-label="Main navigation">
            <a href="#files" className="hover:text-blue-400 transition-colors">
              Files
            </a>
            <a href="#contact" className="hover:text-blue-400 transition-colors">
              Contact Us
            </a>
          </nav>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-700 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="md:hidden pb-4 space-y-2" aria-label="Mobile navigation">
            <a href="#files" className="block px-3 py-2 rounded-md hover:bg-gray-700 transition-colors" onClick={() => setMenuOpen(false)}>
              Files
            </a>
            <a href="#contact" className="block px-3 py-2 rounded-md hover:bg-gray-700 transition-colors" onClick={() => setMenuOpen(false)}>
              Contact Us
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
