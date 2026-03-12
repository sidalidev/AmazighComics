"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ComicPanel } from "./comic-panel"
import { useSoundEngine } from "./sound-engine"
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
  const [showIntro, setShowIntro] = useState(true)
  const [headerVisible, setHeaderVisible] = useState(false)
  const sound = useSoundEngine()

  // Barre de progression
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        const p = Math.min((scrollTop / docHeight) * 100, 100)
        setProgress(p)
        // Montrer le header après avoir scrollé un peu
        setHeaderVisible(scrollTop > 200)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Ref pour savoir si la lecture a commencé (évite le trigger prématuré)
  const readingStartedRef = useRef(false)
  // Tracker quels panels ont déjà été joués (pour les panels 2+)
  const playedPanelsRef = useRef(new Set<number>())

  // Quand un panel entre en vue — jouer le son d'ambiance + narration vocale
  const handlePanelEnterView = useCallback((mood: string, narration?: string, panelIndex?: number) => {
    // Ne rien faire tant que la lecture n'a pas commencé
    if (!readingStartedRef.current) return
    // Éviter les doublons (le panel 0 est géré par startReading)
    if (panelIndex !== undefined && playedPanelsRef.current.has(panelIndex)) return
    if (panelIndex !== undefined) playedPanelsRef.current.add(panelIndex)
    sound.playMoodSound(mood)
    // Lire la narration à voix haute
    if (narration) {
      setTimeout(() => {
        sound.speakNarration(narration)
      }, 800)
    }
  }, [sound])

  // Lancer l'intro cinématique
  const startReading = useCallback(() => {
    setShowIntro(false)
    sound.enableSound()
    readingStartedRef.current = true
    // Lancer la BGM après un court délai
    setTimeout(() => {
      sound.playBGM("/audio/ambient-kabyle.mp3", 0.2)
    }, 500)
    // Déclencher le premier panel manuellement (il est déjà en vue)
    playedPanelsRef.current.add(0)
    const firstPanel = episode.panels[0]
    if (firstPanel) {
      setTimeout(() => {
        sound.playMoodSound(firstPanel.mood)
        if (firstPanel.narration) {
          setTimeout(() => sound.speakNarration(firstPanel.narration!), 800)
        }
      }, 1500)
    }
  }, [sound, episode.panels])

  return (
    <div className="relative bg-[rgb(var(--charbon))] min-h-screen">
      {/* Barre de progression — fine et dorée */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px]">
        <motion.div
          className="h-full bg-gradient-to-r from-[rgb(var(--ocre))] via-[rgb(var(--olive))] to-[rgb(var(--djurdjura))]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header minimal — apparaît après scroll */}
      <AnimatePresence>
        {headerVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-2 left-0 right-0 z-40 px-4"
          >
            <div className="mx-auto max-w-3xl flex items-center justify-between bg-[rgb(var(--charbon)_/_0.85)] backdrop-blur-md rounded-full px-5 py-2 text-sm border border-white/5">
              <Link
                href="/"
                className="text-[rgb(var(--creme)_/_0.5)] hover:text-[rgb(var(--creme))] transition-colors"
              >
                ← Retour
              </Link>
              <span className="text-[rgb(var(--creme)_/_0.7)] font-medium">
                <span className="text-[rgb(var(--primary))]">Ép. {episode.number}</span>
                {" — "}{episode.title}
              </span>
              <div className="flex items-center gap-3">
                {/* Bouton son */}
                <button
                  onClick={sound.toggleSound}
                  className="text-[rgb(var(--creme)_/_0.5)] hover:text-[rgb(var(--creme))] transition-colors"
                >
                  {sound.isEnabled ? "🔊" : "🔇"}
                </button>
                <span className="text-[rgb(var(--creme)_/_0.4)] tabular-nums text-xs">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== INTRO CINÉMATIQUE ===== */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 bg-[rgb(var(--charbon))] flex items-center justify-center"
          >
            <div className="text-center px-6">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-xs tracking-[0.4em] uppercase text-[rgb(var(--primary)_/_0.6)] mb-6"
              >
                Amazigh Comics présente
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
                className="text-sm tracking-[0.2em] uppercase text-[rgb(var(--creme)_/_0.5)] mb-4"
              >
                Épisode {episode.number}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.5, duration: 1.2, ease: "easeOut" }}
                className="text-4xl sm:text-6xl md:text-7xl font-bold text-[rgb(var(--creme))] font-[var(--font-display)] mb-8"
              >
                {episode.title}
              </motion.h1>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 2.5, duration: 0.8 }}
                className="h-px w-32 mx-auto bg-[rgb(var(--primary)_/_0.4)] mb-10"
              />

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3, duration: 0.8 }}
                onClick={startReading}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-[rgb(var(--primary)_/_0.4)] text-[rgb(var(--creme))] font-medium hover:bg-[rgb(var(--primary))] hover:border-[rgb(var(--primary))] transition-all duration-300"
              >
                <span>Commencer la lecture</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.5, duration: 1 }}
                className="mt-6 text-xs text-[rgb(var(--creme)_/_0.3)]"
              >
                🎧 Meilleure expérience avec le son
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== CONTENU PRINCIPAL ===== */}
      <div className="relative">
        {/* Espace initial après l'intro */}
        <div className="h-[30vh]" />

        {/* Cases de BD — pleine largeur, immersif */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-4">
          {episode.panels.map((panel, i) => (
            <ComicPanel
              key={i}
              panel={panel}
              priority={i < 3}
              index={i}
              onEnterView={handlePanelEnterView}
            />
          ))}
        </div>

        {/* ===== FIN D'ÉPISODE ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="relative py-32"
        >
          <div className="text-center px-6">
            {/* Séparateur amazigh doré */}
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="h-px w-16 bg-[rgb(var(--primary)_/_0.3)]" />
              <svg viewBox="0 0 60 80" className="w-8 h-10 text-[rgb(var(--primary)_/_0.4)]">
                <line x1="30" y1="5" x2="30" y2="75" stroke="currentColor" strokeWidth="2.5" />
                <line x1="10" y1="25" x2="50" y2="55" stroke="currentColor" strokeWidth="2.5" />
                <line x1="50" y1="25" x2="10" y2="55" stroke="currentColor" strokeWidth="2.5" />
              </svg>
              <div className="h-px w-16 bg-[rgb(var(--primary)_/_0.3)]" />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-[rgb(var(--creme)_/_0.4)] mb-3 italic text-sm tracking-wide"
            >
              Fin de l&apos;épisode {episode.number}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="text-2xl sm:text-3xl font-bold text-[rgb(var(--creme))] mb-3 font-[var(--font-display)]"
            >
              L&apos;histoire continue...
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
              className="text-sm text-[rgb(var(--creme)_/_0.4)] mb-10"
            >
              ⵜⴰⵎⵓⵔⵜ ⵏ ⵉⵎⴰⵣⵉⵖⴻⵏ — La terre des Amazighs
            </motion.p>

            {nextSlug ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.2 }}
              >
                <Link
                  href={`/episodes/${nextSlug}`}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--primary))] text-white font-semibold hover:bg-[rgb(var(--primary-dark))] transition-all hover:scale-105"
                >
                  Épisode suivant →
                </Link>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.2 }}
              >
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-[rgb(var(--primary)_/_0.4)] text-[rgb(var(--creme))] font-medium hover:bg-[rgb(var(--primary))] hover:border-[rgb(var(--primary))] transition-all"
                >
                  Retour à l&apos;accueil
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Espace final */}
        <div className="h-[20vh]" />
      </div>
    </div>
  )
}
