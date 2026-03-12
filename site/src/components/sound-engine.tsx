"use client"

import { useRef, useCallback, useEffect, useState } from "react"

// Sons d'ambiance par mood
const MOOD_SOUNDS: Record<string, string[]> = {
  dawn: ["/audio/sfx/wind-mountain.mp3"],
  warm: ["/audio/sfx/village-ambiance.mp3"],
  earth: ["/audio/sfx/forge-hammer.mp3"],
  cool: ["/audio/sfx/crowd-murmur.mp3"],
  forest: ["/audio/sfx/forest-birds.mp3"],
  night: ["/audio/sfx/cave-drip.mp3"],
}

// Contexte global pour le son
let audioContext: AudioContext | null = null
let masterGain: GainNode | null = null

function getAudioContext() {
  if (!audioContext) {
    audioContext = new AudioContext()
    masterGain = audioContext.createGain()
    masterGain.gain.value = 0.3
    masterGain.connect(audioContext.destination)
  }
  return { ctx: audioContext, master: masterGain! }
}

export function useSoundEngine() {
  const bgmRef = useRef<HTMLAudioElement | null>(null)
  const sfxPoolRef = useRef<Map<string, HTMLAudioElement>>(new Map())
  const [isEnabled, setIsEnabled] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  // Activer le son au premier clic
  const enableSound = useCallback(() => {
    if (hasInteracted) return
    setHasInteracted(true)
    setIsEnabled(true)
  }, [hasInteracted])

  // Jouer la musique de fond
  const playBGM = useCallback((src: string, volume = 0.25) => {
    if (!isEnabled) return
    if (bgmRef.current) {
      bgmRef.current.pause()
    }
    const audio = new Audio(src)
    audio.loop = true
    audio.volume = volume
    audio.play().catch(() => {})
    bgmRef.current = audio
  }, [isEnabled])

  // Jouer un SFX one-shot
  const playSFX = useCallback((src: string, volume = 0.4) => {
    if (!isEnabled) return
    // Réutiliser ou créer
    let audio = sfxPoolRef.current.get(src)
    if (!audio) {
      audio = new Audio(src)
      sfxPoolRef.current.set(src, audio)
    }
    audio.volume = volume
    audio.currentTime = 0
    audio.play().catch(() => {})
  }, [isEnabled])

  // Jouer les sons d'un mood
  const playMoodSound = useCallback((mood: string) => {
    const sounds = MOOD_SOUNDS[mood]
    if (!sounds || !isEnabled) return
    sounds.forEach(src => playSFX(src, 0.2))
  }, [isEnabled, playSFX])

  // Fade out BGM
  const fadeOutBGM = useCallback((duration = 2000) => {
    if (!bgmRef.current) return
    const audio = bgmRef.current
    const startVol = audio.volume
    const steps = 20
    const stepTime = duration / steps
    let step = 0
    const interval = setInterval(() => {
      step++
      audio.volume = Math.max(0, startVol * (1 - step / steps))
      if (step >= steps) {
        clearInterval(interval)
        audio.pause()
      }
    }, stepTime)
  }, [])

  // Cleanup au démontage
  useEffect(() => {
    return () => {
      bgmRef.current?.pause()
      sfxPoolRef.current.forEach(a => a.pause())
    }
  }, [])

  return {
    isEnabled,
    hasInteracted,
    enableSound,
    playBGM,
    playSFX,
    playMoodSound,
    fadeOutBGM,
    toggleSound: () => setIsEnabled(prev => !prev),
  }
}
