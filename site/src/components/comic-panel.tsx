"use client"

import { motion } from "framer-motion"
import type { PanelData } from "@/lib/episodes"

export function ComicPanel({
  panel,
  priority = false,
}: {
  panel: PanelData
  priority?: boolean
}) {
  return (
    <div className="space-y-3">
      {/* Narration au-dessus du panel */}
      {panel.narration && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.8 }}
          className="text-center px-4"
        >
          <p className="text-sm sm:text-base text-[rgb(var(--charbon)_/_0.7)] italic font-[var(--font-display)] leading-relaxed max-w-lg mx-auto">
            {panel.narration}
          </p>
        </motion.div>
      )}

      {/* Panel image */}
      {panel.type === "image" && panel.src ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative rounded-lg overflow-hidden shadow-lg ring-1 ring-[rgb(var(--charbon)_/_0.1)]"
        >
          <img
            src={panel.src}
            alt={panel.scene}
            loading={priority ? "eager" : "lazy"}
            className="w-full h-auto block"
            style={{ filter: "saturate(1.8) contrast(1.3) brightness(0.95)" }}
          />
          {/* Dialogue en overlay */}
          {panel.dialogue && (
            <div className="absolute bottom-4 left-4 right-4 flex justify-center">
              <SpeechBubble text={panel.dialogue} position={panel.bubblePosition} />
            </div>
          )}
        </motion.div>
      ) : (
        <PlaceholderPanel panel={panel} />
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`relative rounded-lg overflow-hidden shadow-md bg-gradient-to-br ${gradient} min-h-[300px] sm:min-h-[400px] flex flex-col items-center justify-center p-8 amazigh-pattern`}
    >
      <p className="text-center text-sm text-[rgb(var(--foreground)_/_0.6)] max-w-xs font-medium italic mb-4">
        {panel.scene}
      </p>
      {panel.dialogue && <SpeechBubble text={panel.dialogue} />}
    </motion.div>
  )
}

function SpeechBubble({ text, position }: { text: string, position?: string }) {
  // Position par défaut : bottom-center
  const posClass = position === "top" ? "top-4 left-4 right-4" :
    position === "top-left" ? "top-4 left-4" :
    position === "top-right" ? "top-4 right-4" :
    ""

  return (
    <div className={`relative bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-md max-w-[280px] border border-[rgb(var(--charbon)_/_0.08)]`}>
      <p className="text-sm text-[rgb(var(--charbon))] font-medium text-center leading-relaxed">
        {text}
      </p>
      {/* Queue de bulle */}
      <svg
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-3 text-white/95"
        viewBox="0 0 16 12"
      >
        <path d="M0 0 L8 12 L16 0 Z" fill="currentColor" />
      </svg>
    </div>
  )
}
