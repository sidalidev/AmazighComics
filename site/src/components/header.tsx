"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-[rgb(var(--border))] bg-[rgb(var(--background))]">
      <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          {/* Yaz ⵣ — symbole amazigh */}
          <span className="text-2xl font-bold text-[rgb(var(--primary))]">
            ⵣ
          </span>
          <span className="font-semibold text-[rgb(var(--foreground))]">
            Amazigh Comics
          </span>
        </Link>

        <div className="flex items-center gap-4 text-sm text-[rgb(var(--muted))]">
          <Link
            href="/"
            className="hover:text-[rgb(var(--foreground))] transition-colors"
          >
            Épisodes
          </Link>
        </div>
      </nav>
    </header>
  );
}
