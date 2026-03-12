"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import type { PanelData } from "@/lib/episodes"

export function ComicPanel({
  panel,
  priority = false,
  index = 0,
  onEnterView,
}: {
  panel: PanelData
  priority?: boolean
  index?: number
  onEnterView?: (mood: string) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { amount: 0.4, once: false })
  const [hasAnimated, setHasAnimated] = useState(false)

  // Parallax scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // L'image bouge plus lentement que le scroll (parallax)
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"])
  // La narration a un léger décalage
  const narrationY = useTransform(scrollYProgress, [0, 1], ["20px", "-20px"])
  const narrationOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0])

  // Notifier le parent quand le panel entre en vue
  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true)
      onEnterView?.(panel.mood)
    }
  }, [isInView, hasAnimated, onEnterView, panel.mood])

  const isFullWidth = panel.type === "image" && panel.src

  return (
    <div ref={containerRef} className="relative">
      {/* Narration flottante avec parallax */}
      {panel.narration && (
        <motion.div
          style={{ y: narrationY, opacity: narrationOpacity }}
          className="relative z-20 py-12 sm:py-16 px-6"
        >
          <NarrationText text={panel.narration} isInView={isInView} />
        </motion.div>
      )}

      {/* Panel image avec parallax */}
      {isFullWidth ? (
        <div className="relative overflow-hidden rounded-lg sm:rounded-xl">
          {/* Image avec parallax */}
          <motion.div
            style={{ y: imageY }}
            className="relative"
          >
            <motion.img
              src={panel.src}
              alt={panel.scene}
              loading={priority ? "eager" : "lazy"}
              initial={{ scale: 1.1, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="w-full h-auto block"
              style={{ filter: "saturate(1.4) contrast(1.1) brightness(1.0)" }}
            />

            {/* Vignette overlay — bords sombres */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.25) 100%)",
              }}
            />
          </motion.div>

          {/* Dialogue en overlay avec animation */}
          {panel.dialogue && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="absolute bottom-6 left-4 right-4 flex justify-center z-10"
            >
              <SpeechBubble text={panel.dialogue} position={panel.bubblePosition} />
            </motion.div>
          )}
        </div>
      ) : (
        <PlaceholderPanel panel={panel} />
      )}
    </div>
  )
}

// Texte narratif avec effet typewriter
function NarrationText({ text, isInView }: { text: string, isInView: boolean }) {
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
    }, 30) // 30ms par caractère

    return () => clearInterval(interval)
  }, [isInView, text])

  return (
    <div className="max-w-2xl mx-auto text-center">
      <p className="text-lg sm:text-xl md:text-2xl text-[rgb(var(--creme)_/_0.9)] italic font-[var(--font-display)] leading-relaxed tracking-wide">
        {displayedText || text}
        {!isDone && hasStarted.current && (
          <span className="animate-pulse text-[rgb(var(--primary))]">|</span>
        )}
      </p>
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
      className={`relative rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br ${gradient} min-h-[50vh] sm:min-h-[60vh] flex flex-col items-center justify-center p-8 amazigh-pattern`}
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
          <SpeechBubble text={panel.dialogue} />
        </motion.div>
      )}

      {/* Vignette sombre */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.3) 100%)",
        }}
      />
    </motion.div>
  )
}

function SpeechBubble({ text, position }: { text: string, position?: string }) {
  return (
    <div className="relative bg-white/95 backdrop-blur-md rounded-2xl px-6 py-4 shadow-xl max-w-[320px] border border-white/20">
      <p className="text-sm sm:text-base text-[rgb(var(--charbon))] font-medium text-center leading-relaxed">
        {text}
      </p>
      {/* Queue de bulle */}
      <svg
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-5 h-4 text-white/95 drop-shadow-sm"
        viewBox="0 0 20 16"
      >
        <path d="M0 0 L10 16 L20 0 Z" fill="currentColor" />
      </svg>
    </div>
  )
}
