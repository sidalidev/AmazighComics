"use client";

import { motion } from "framer-motion";
import type { PanelData } from "@/lib/episodes";

const GRADIENTS: Record<string, string> = {
  warm: "from-[#C4843A]/20 via-[#8B6914]/15 to-[#C4843A]/10",
  cool: "from-[#4A7C9B]/20 via-[#5C6B3C]/15 to-[#4A7C9B]/10",
  earth: "from-[#8B6914]/20 via-[#5C6B3C]/15 to-[#8B6914]/10",
  night: "from-[#2A2520]/40 via-[#4A7C9B]/20 to-[#2A2520]/30",
  dawn: "from-[#C4843A]/30 via-[#F5E6C8]/20 to-[#4A7C9B]/15",
  forest: "from-[#5C6B3C]/25 via-[#8B6914]/15 to-[#5C6B3C]/20",
};

function AmazighDecoration({ variant }: { variant: number }) {
  const decorations = [
    // Losange central
    <svg key="d" viewBox="0 0 100 100" className="w-16 h-16 opacity-10">
      <path d="M50 10 L90 50 L50 90 L10 50 Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M50 25 L75 50 L50 75 L25 50 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="5" fill="currentColor" />
    </svg>,
    // Zigzag horizontal
    <svg key="z" viewBox="0 0 200 40" className="w-32 h-6 opacity-10">
      <polyline points="0,20 15,5 30,20 45,5 60,20 75,5 90,20 105,5 120,20 135,5 150,20 165,5 180,20 195,5 200,20" fill="none" stroke="currentColor" strokeWidth="2" />
      <polyline points="0,35 15,20 30,35 45,20 60,35 75,20 90,35 105,20 120,35 135,20 150,35 165,20 180,35 195,20 200,35" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>,
    // Yaz ⵣ stylisé
    <svg key="y" viewBox="0 0 60 80" className="w-12 h-16 opacity-10">
      <line x1="30" y1="5" x2="30" y2="75" stroke="currentColor" strokeWidth="2" />
      <line x1="10" y1="25" x2="50" y2="55" stroke="currentColor" strokeWidth="2" />
      <line x1="50" y1="25" x2="10" y2="55" stroke="currentColor" strokeWidth="2" />
    </svg>,
    // Motif en croix berbère
    <svg key="c" viewBox="0 0 80 80" className="w-14 h-14 opacity-10">
      <rect x="30" y="5" width="20" height="70" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="5" y="30" width="70" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="40" cy="40" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>,
  ];
  return decorations[variant % decorations.length];
}

export function ComicPanel({
  panel,
  priority = false,
}: {
  panel: PanelData;
  priority?: boolean;
}) {
  const gradient = GRADIENTS[panel.mood] || GRADIENTS.warm;

  if (panel.type === "image" && panel.src) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative rounded-lg overflow-hidden shadow-md"
      >
        <img
          src={panel.src}
          alt={panel.scene}
          loading={priority ? "eager" : "lazy"}
          className="w-full h-auto"
        />
        {panel.dialogue && (
          <div className="absolute bottom-4 left-4 right-4">
            <SpeechBubble text={panel.dialogue} />
          </div>
        )}
      </motion.div>
    );
  }

  // Placeholder CSS/SVG
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative rounded-lg overflow-hidden shadow-md bg-gradient-to-br ${gradient} min-h-[300px] sm:min-h-[400px] flex flex-col items-center justify-center p-8 amazigh-pattern`}
    >
      {/* Numéro de case */}
      <span className="absolute top-3 left-3 text-xs font-mono text-[rgb(var(--muted)_/_0.5)]">
        {String(panel.index + 1).padStart(2, "0")}
      </span>

      {/* Décoration amazigh */}
      <div className="text-[rgb(var(--foreground))] mb-6">
        <AmazighDecoration variant={panel.index} />
      </div>

      {/* Description de la scène */}
      <p className="text-center text-sm text-[rgb(var(--foreground)_/_0.6)] max-w-xs font-medium italic mb-4">
        {panel.scene}
      </p>

      {/* Dialogue */}
      {panel.dialogue && <SpeechBubble text={panel.dialogue} />}

      {/* Bordure décorative basse */}
      <svg
        className="absolute bottom-0 left-0 right-0 h-3 text-[rgb(var(--foreground)_/_0.08)]"
        viewBox="0 0 400 12"
        preserveAspectRatio="none"
      >
        <path
          d="M0 12 L10 0 L20 12 L30 0 L40 12 L50 0 L60 12 L70 0 L80 12 L90 0 L100 12 L110 0 L120 12 L130 0 L140 12 L150 0 L160 12 L170 0 L180 12 L190 0 L200 12 L210 0 L220 12 L230 0 L240 12 L250 0 L260 12 L270 0 L280 12 L290 0 L300 12 L310 0 L320 12 L330 0 L340 12 L350 0 L360 12 L370 0 L380 12 L390 0 L400 12"
          fill="currentColor"
        />
      </svg>
    </motion.div>
  );
}

function SpeechBubble({ text }: { text: string }) {
  return (
    <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-sm max-w-xs mx-auto">
      <p className="text-sm text-[rgb(var(--charbon))] font-medium text-center leading-relaxed">
        {text}
      </p>
      {/* Queue de bulle */}
      <svg
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-3 text-white/90"
        viewBox="0 0 16 12"
      >
        <path d="M0 0 L8 12 L16 0 Z" fill="currentColor" />
      </svg>
    </div>
  );
}
