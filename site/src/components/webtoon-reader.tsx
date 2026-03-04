"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ComicPanel } from "./comic-panel";
import type { Episode } from "@/lib/episodes";
import Link from "next/link";

export function WebtoonReader({
  episode,
  nextSlug,
}: {
  episode: Episode;
  nextSlug?: string;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress(Math.min((scrollTop / docHeight) * 100, 100));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative">
      {/* Barre de progression */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1">
        <div
          className="h-full progress-bar transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header sticky épisode */}
      <div className="sticky top-1 z-40 mx-auto max-w-[var(--reader-max-width)] px-4 pt-2">
        <div className="glass rounded-full px-4 py-2 flex items-center justify-between text-sm border border-[rgb(var(--border)_/_0.5)]">
          <Link
            href="/"
            className="text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] transition-colors"
          >
            ← Retour
          </Link>
          <span className="font-medium text-[rgb(var(--foreground))]">
            <span className="text-[rgb(var(--primary))]">
              Ép. {episode.number}
            </span>{" "}
            — {episode.title}
          </span>
          <span className="text-[rgb(var(--muted))] tabular-nums">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Cases de BD */}
      <div className="mx-auto max-w-[var(--reader-max-width)] px-4 py-8 space-y-6">
        {episode.panels.map((panel, i) => (
          <ComicPanel key={i} panel={panel} priority={i < 3} />
        ))}
      </div>

      {/* Fin d'épisode */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mx-auto max-w-[var(--reader-max-width)] px-4 pb-16"
      >
        <div className="text-center py-12 border-t border-[rgb(var(--border))]">
          <p className="text-2xl font-bold text-[rgb(var(--primary))] mb-2">
            ⵣ
          </p>
          <p className="text-[rgb(var(--muted))] mb-6">
            Fin de l&apos;épisode {episode.number}
          </p>

          {nextSlug ? (
            <Link
              href={`/episodes/${nextSlug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[rgb(var(--primary))] text-white font-medium hover:bg-[rgb(var(--primary-dark))] transition-colors"
            >
              Épisode suivant →
            </Link>
          ) : (
            <p className="text-sm text-[rgb(var(--muted))] italic">
              Prochain épisode bientôt...
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
