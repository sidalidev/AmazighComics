"use client"

import { useRef, useEffect, useState, useMemo } from "react"
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion"
import type { PanelData } from "@/lib/episodes"

// Animations d'entrée par mood — chaque panel a sa propre personnalité
const PANEL_TRANSITIONS: Record<string, {
  initial: Record<string, number | string>
  animate: Record<string, number | string>
  transition: Record<string, unknown>
}> = {
  dawn: {
    initial: { opacity: 0, scale: 1.15, filter: "brightness(1.5) blur(8px)" },
    animate: { opacity: 1, scale: 1.05, filter: "brightness(1) blur(0px)" },
    transition: { duration: 2, ease: "easeOut" },
  },
  warm: {
    initial: { opacity: 0, x: -60, scale: 1.02 },
    animate: { opacity: 1, x: 0, scale: 1 },
    transition: { duration: 1.4, ease: [0.25, 0.1, 0, 1] },
  },
  earth: {
    initial: { opacity: 0, scale: 0.92, filter: "contrast(1.5) brightness(0.5)" },
    animate: { opacity: 1, scale: 1, filter: "contrast(1) brightness(1)" },
    transition: { duration: 1.2, ease: "easeOut" },
  },
  cool: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
  },
  forest: {
    initial: { opacity: 0, scale: 1.08, filter: "saturate(0) brightness(0.7)" },
    animate: { opacity: 1, scale: 1.02, filter: "saturate(1.2) brightness(1)" },
    transition: { duration: 1.8, ease: "easeOut" },
  },
  night: {
    initial: { opacity: 0, filter: "brightness(0) blur(4px)" },
    animate: { opacity: 1, filter: "brightness(1) blur(0px)" },
    transition: { duration: 2.5, ease: "easeInOut" },
  },
}

// Particules par mood
const PARTICLE_CONFIG: Record<string, { emoji: string; count: number; speed: number }> = {
  dawn: { emoji: "✦", count: 8, speed: 4 },
  warm: { emoji: "·", count: 12, speed: 3 },
  earth: { emoji: "✧", count: 6, speed: 2 },
  cool: { emoji: "·", count: 10, speed: 3 },
  forest: { emoji: "✦", count: 10, speed: 5 },
  night: { emoji: "✦", count: 15, speed: 6 },
}

export function ComicPanel({
  panel,
  priority = false,
  index = 0,
  onEnterView,
}: {
  panel: PanelData
  priority?: boolean
  index?: number
  onEnterView?: (mood: string, narration?: string, panelIndex?: number) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { amount: 0.3, once: false })
  const hasTriggeredRef = useRef(false)

  // Parallax scroll — plus prononcé
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Ken Burns : zoom lent continu pendant que le panel est visible
  const kenBurnsScale = useTransform(scrollYProgress, [0.2, 0.8], [1.0, 1.08])
  const smoothScale = useSpring(kenBurnsScale, { stiffness: 50, damping: 30 })

  // Parallax image — mouvement inverse au scroll
  const imageY = useTransform(scrollYProgress, [0, 1], ["5%", "-20%"])

  // Narration — flotte plus fort
  const narrationY = useTransform(scrollYProgress, [0, 1], ["40px", "-40px"])
  const narrationOpacity = useTransform(scrollYProgress, [0.05, 0.25, 0.65, 0.85], [0, 1, 1, 0])

  // Notifier le parent (son + narration) quand le panel entre en vue
  useEffect(() => {
    if (isInView && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true
      onEnterView?.(panel.mood, panel.narration, index)
    }
  }, [isInView, onEnterView, panel.mood, panel.narration])

  const isFullWidth = panel.type === "image" && panel.src
  const panelTransition = PANEL_TRANSITIONS[panel.mood] || PANEL_TRANSITIONS.warm

  return (
    <div ref={containerRef} className="relative">
      {/* Narration flottante avec parallax */}
      {panel.narration && (
        <motion.div
          style={{ y: narrationY, opacity: narrationOpacity }}
          className="relative z-20 py-16 sm:py-24 px-6"
        >
          <NarrationText text={panel.narration} isInView={isInView} />
        </motion.div>
      )}

      {/* Panel image */}
      {isFullWidth ? (
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl shadow-black/40">
          {/* Conteneur avec Ken Burns + Parallax */}
          <motion.div
            style={{ y: imageY }}
            className="relative"
          >
            <motion.img
              src={panel.src}
              alt={panel.scene}
              loading={priority ? "eager" : "lazy"}
              initial={panelTransition.initial}
              whileInView={panelTransition.animate}
              viewport={{ once: true, margin: "-80px" }}
              transition={panelTransition.transition}
              className="w-full h-auto block will-change-transform"
              style={{
                scale: smoothScale,
                filter: "saturate(1.3) contrast(1.05)",
              }}
            />

            {/* Vignette subtile — ne pas écraser les couleurs */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, transparent 65%, rgba(0,0,0,0.15) 100%)",
              }}
            />

            {/* Bord lumineux subtil en haut */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </motion.div>

          {/* Particules contextuelles */}
          {isInView && <ParticleOverlay mood={panel.mood} />}

          {/* Dialogue en overlay */}
          {panel.dialogue && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.85 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                delay: 0.5,
                ease: [0.34, 1.56, 0.64, 1], // spring-like bounce
              }}
              className="absolute bottom-8 left-4 right-4 flex z-10"
              style={{
                justifyContent: panel.bubblePosition === "left" ? "flex-start"
                  : panel.bubblePosition === "right" ? "flex-end"
                  : "center",
              }}
            >
              <SpeechBubble text={panel.dialogue} position={panel.bubblePosition} mood={panel.mood} />
            </motion.div>
          )}
        </div>
      ) : (
        <PlaceholderPanel panel={panel} />
      )}
    </div>
  )
}

// Particules flottantes contextuelles
function ParticleOverlay({ mood }: { mood: string }) {
  const config = PARTICLE_CONFIG[mood] || PARTICLE_CONFIG.warm
  const particles = useMemo(() =>
    Array.from({ length: config.count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: config.speed + Math.random() * 3,
      size: 4 + Math.random() * 8,
      opacity: 0.15 + Math.random() * 0.25,
    })),
    [config.count, config.speed],
  )

  const colorMap: Record<string, string> = {
    dawn: "rgb(245 230 200)",
    warm: "rgb(196 132 58)",
    earth: "rgb(196 132 58)",
    cool: "rgb(74 124 155)",
    forest: "rgb(92 107 60)",
    night: "rgb(74 124 155)",
  }
  const color = colorMap[mood] || colorMap.warm

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-5">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: p.size,
            color,
            opacity: 0,
          }}
          animate={{
            y: [0, -30, -60],
            opacity: [0, p.opacity, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {config.emoji}
        </motion.div>
      ))}
    </div>
  )
}

// Texte narratif avec effet typewriter amélioré
function NarrationText({ text, isInView }: { text: string; isInView: boolean }) {
  const [displayedText, setDisplayedText] = useState("")
  const [isDone, setIsDone] = useState(false)
  const hasStarted = useRef(false)

  useEffect(() => {
    if (!isInView || hasStarted.current) return
    hasStarted.current = true

    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayedText(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        setIsDone(true)
      }
    }, 25) // Plus rapide pour plus de fluidité

    return () => clearInterval(interval)
  }, [isInView, text])

  return (
    <div className="max-w-2xl mx-auto text-center">
      <p className="text-xl sm:text-2xl md:text-3xl text-[rgb(var(--creme)_/_0.95)] italic font-[var(--font-display)] leading-relaxed tracking-wide">
        {displayedText || text}
        {!isDone && hasStarted.current && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-[rgb(var(--primary))]"
          >
            |
          </motion.span>
        )}
      </p>
      {/* Ligne décorative sous la narration */}
      {isDone && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-4 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-[rgb(var(--primary)_/_0.3)] to-transparent"
        />
      )}
    </div>
  )
}

function PlaceholderPanel({ panel }: { panel: PanelData }) {
  const gradients: Record<string, string> = {
    warm: "from-[#C4843A]/20 via-[#8B6914]/15 to-[#C4843A]/10",
    cool: "from-[#4A7C9B]/20 via-[#5C6B3C]/15 to-[#4A7C9B]/10",
    earth: "from-[#8B6914]/20 via-[#5C6B3C]/15 to-[#8B6914]/10",
    night: "from-[#2A2520]/40 via-[#4A7C9B]/20 to-[#2A2520]/30",
    dawn: "from-[#C4843A]/30 via-[#F5E6C8]/20 to-[#4A7C9B]/15",
    forest: "from-[#5C6B3C]/25 via-[#8B6914]/15 to-[#5C6B3C]/20",
  }
  const gradient = gradients[panel.mood] || gradients.warm

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative rounded-2xl overflow-hidden shadow-2xl shadow-black/30 bg-gradient-to-br ${gradient} min-h-[50vh] sm:min-h-[60vh] flex flex-col items-center justify-center p-8 amazigh-pattern`}
    >
      {/* Scène description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-center text-sm sm:text-base text-[rgb(var(--creme)_/_0.7)] max-w-sm font-medium italic mb-6"
      >
        {panel.scene}
      </motion.p>

      {/* Dialogue */}
      {panel.dialogue && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <SpeechBubble text={panel.dialogue} mood={panel.mood} />
        </motion.div>
      )}

      {/* Vignette sombre */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.2) 100%)",
        }}
      />
    </motion.div>
  )
}

// Speech bubble premium — style BD avec positionnement dynamique
function SpeechBubble({ text, position, mood }: { text: string; position?: string; mood?: string }) {
  // Couleur d'accent basée sur le mood
  const accentColors: Record<string, string> = {
    dawn: "border-amber-300/30",
    warm: "border-orange-300/30",
    earth: "border-yellow-600/30",
    cool: "border-blue-300/30",
    forest: "border-green-400/30",
    night: "border-indigo-300/30",
  }
  const accentBorder = accentColors[mood || "warm"] || accentColors.warm

  // Tifinagh si le texte contient du tifinagh
  const hasTifinagh = /[\u2D30-\u2D7F]/.test(text)

  // Séparer tifinagh et traduction si format "ⵜⵉⴼⵉⵏⴰⵖ — Traduction"
  const parts = text.split(" — ")
  const isDoubleText = parts.length === 2 && hasTifinagh

  // Position de la queue
  const tailPosition = position === "left" ? "left-6" : position === "right" ? "right-6" : "left-1/2 -translate-x-1/2"

  return (
    <motion.div
      className={`relative bg-white rounded-2xl px-6 py-4 shadow-2xl shadow-black/20 max-w-[360px] border-2 ${accentBorder}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {isDoubleText ? (
        <>
          <p className="text-base sm:text-lg text-[rgb(var(--primary))] font-semibold text-center mb-1 tracking-wider">
            {parts[0]}
          </p>
          <p className="text-sm text-[rgb(var(--charbon)_/_0.7)] text-center italic">
            {parts[1]}
          </p>
        </>
      ) : (
        <p className="text-sm sm:text-base text-[rgb(var(--charbon))] font-medium text-center leading-relaxed">
          {text}
        </p>
      )}

      {/* Queue de bulle avec shadow */}
      <svg
        className={`absolute -bottom-3 ${tailPosition} w-5 h-4 drop-shadow-md`}
        viewBox="0 0 20 16"
      >
        <path d="M0 0 L10 16 L20 0 Z" fill="white" />
      </svg>
    </motion.div>
  )
}
