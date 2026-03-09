"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ComicPanel } from "./comic-panel"
import type { Episode } from "@/lib/episodes"
import Link from "next/link"

export function WebtoonReader({
  episode,
  nextSlug,
}: {
  episode: Episode
  nextSlug?: string
}) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        setProgress(Math.min((scrollTop / docHeight) * 100, 100))
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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

      {/* Titre cinématique d'intro */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="mx-auto max-w-[var(--reader-max-width)] px-4 pt-12 pb-8"
      >
        <div className="text-center space-y-4">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xs tracking-[0.3em] uppercase text-[rgb(var(--muted))]"
          >
            Épisode {episode.number}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-3xl sm:text-5xl font-bold text-[rgb(var(--primary))] font-[var(--font-display)]"
          >
            {episode.title}
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="h-px w-24 mx-auto bg-[rgb(var(--primary)_/_0.3)]"
          />
        </div>
      </motion.div>

      {/* Cases de BD */}
      <div className="mx-auto max-w-[var(--reader-max-width)] px-4 pb-8 space-y-8">
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
          {/* Séparateur amazigh */}
          <div className="flex items-center justify-center gap-3 mb-6 text-[rgb(var(--primary)_/_0.4)]">
            <div className="h-px w-12 bg-current" />
            <svg viewBox="0 0 60 80" className="w-6 h-8">
              <line x1="30" y1="5" x2="30" y2="75" stroke="currentColor" strokeWidth="3" />
              <line x1="10" y1="25" x2="50" y2="55" stroke="currentColor" strokeWidth="3" />
              <line x1="50" y1="25" x2="10" y2="55" stroke="currentColor" strokeWidth="3" />
            </svg>
            <div className="h-px w-12 bg-current" />
          </div>

          <p className="text-[rgb(var(--muted))] mb-2 italic text-sm">
            Fin de l&apos;épisode {episode.number}
          </p>
          <p className="text-lg font-medium text-[rgb(var(--foreground))] mb-6">
            L&apos;histoire continue...
          </p>

          {nextSlug ? (
            <Link
              href={`/episodes/${nextSlug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[rgb(var(--primary))] text-white font-medium hover:bg-[rgb(var(--primary-dark))] transition-colors"
            >
              Épisode suivant →
            </Link>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-[rgb(var(--muted))]">
                Prochain épisode bientôt...
              </p>
              <p className="text-xs text-[rgb(var(--muted)_/_0.6)]">
                ⵜⴰⵎⵓⵔⵜ ⵏ ⵉⵎⴰⵣⵉⵖⴻⵏ — La terre des Amazighs
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
