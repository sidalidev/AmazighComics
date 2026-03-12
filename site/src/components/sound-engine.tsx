"use client"

import { useRef, useCallback, useState, useEffect } from "react"

// Ambiances par mood — chaque mood a sa propre couche sonore
const MOOD_SOUNDS: Record<string, string[]> = {
  dawn: ["/audio/sfx/wind-mountain.mp3"],
  warm: ["/audio/sfx/village-ambiance.mp3"],
  earth: ["/audio/sfx/forge-hammer.mp3"],
  cool: ["/audio/sfx/crowd-murmur.mp3"],
  forest: ["/audio/sfx/forest-birds.mp3"],
  night: ["/audio/sfx/cave-drip.mp3"],
}

export function useSoundEngine() {
  const bgmRef = useRef<HTMLAudioElement | null>(null)
  const ambianceRef = useRef<HTMLAudioElement | null>(null)
  const sfxPoolRef = useRef<Map<string, HTMLAudioElement>>(new Map())
  const [isEnabled, setIsEnabled] = useState(false)
  // useRef pour éviter le bug de stale closure dans les callbacks
  const enabledRef = useRef(false)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)
  const isSpeakingRef = useRef(false)

  // Sync ref avec state
  useEffect(() => {
    enabledRef.current = isEnabled
  }, [isEnabled])

  // Activer le son au premier clic
  const enableSound = useCallback(() => {
    enabledRef.current = true
    setIsEnabled(true)
  }, [])

  // Jouer la musique de fond avec fade-in
  const playBGM = useCallback((src: string, volume = 0.25) => {
    if (!enabledRef.current) return
    if (bgmRef.current) {
      bgmRef.current.pause()
    }
    const audio = new Audio(src)
    audio.loop = true
    audio.volume = 0
    audio.play().catch(() => {})
    // Fade in sur 2 secondes
    let vol = 0
    const targetVol = volume
    const fadeIn = setInterval(() => {
      vol += targetVol / 40
      if (vol >= targetVol) {
        vol = targetVol
        clearInterval(fadeIn)
      }
      audio.volume = vol
    }, 50)
    bgmRef.current = audio
  }, [])

  // Jouer un SFX one-shot
  const playSFX = useCallback((src: string, volume = 0.4) => {
    if (!enabledRef.current) return
    let audio = sfxPoolRef.current.get(src)
    if (!audio) {
      audio = new Audio(src)
      sfxPoolRef.current.set(src, audio)
    }
    audio.volume = volume
    audio.currentTime = 0
    audio.play().catch(() => {})
  }, [])

  // Jouer une ambiance de mood (loop, crossfade avec l'ambiance précédente)
  const playMoodSound = useCallback((mood: string) => {
    if (!enabledRef.current) return
    const sounds = MOOD_SOUNDS[mood]
    if (!sounds || sounds.length === 0) return

    const src = sounds[0]

    // Si c'est déjà la même ambiance, ne rien faire
    if (ambianceRef.current && ambianceRef.current.src?.endsWith(src.split("/").pop() || "")) {
      return
    }

    // Crossfade : fade out l'ancienne ambiance
    if (ambianceRef.current) {
      const old = ambianceRef.current
      const startVol = old.volume
      let step = 0
      const fadeOut = setInterval(() => {
        step++
        old.volume = Math.max(0, startVol * (1 - step / 20))
        if (step >= 20) {
          clearInterval(fadeOut)
          old.pause()
        }
      }, 50)
    }

    // Nouvelle ambiance avec fade in
    const audio = new Audio(src)
    audio.loop = true
    audio.volume = 0
    audio.play().catch(() => {})

    let vol = 0
    const targetVol = 0.15
    const fadeIn = setInterval(() => {
      vol += targetVol / 30
      if (vol >= targetVol) {
        vol = targetVol
        clearInterval(fadeIn)
      }
      audio.volume = vol
    }, 50)

    ambianceRef.current = audio
  }, [])

  // Narration vocale — Web Speech API
  const speakNarration = useCallback((text: string) => {
    if (!enabledRef.current) return
    if (typeof window === "undefined" || !window.speechSynthesis) return

    // Annuler la narration précédente
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "fr-FR"
    utterance.rate = 0.85 // Plus lent pour l'effet narratif
    utterance.pitch = 0.9 // Voix légèrement plus grave
    utterance.volume = 0.7

    // Baisser le volume de la BGM pendant la narration
    if (bgmRef.current) {
      const bgm = bgmRef.current
      const originalVol = bgm.volume
      bgm.volume = originalVol * 0.3 // Duck la musique

      utterance.onend = () => {
        isSpeakingRef.current = false
        // Remonter le volume progressivement
        let vol = bgm.volume
        const fadeBack = setInterval(() => {
          vol += (originalVol - bgm.volume) / 20
          if (vol >= originalVol) {
            vol = originalVol
            clearInterval(fadeBack)
          }
          bgm.volume = vol
        }, 50)
      }
    } else {
      utterance.onend = () => {
        isSpeakingRef.current = false
      }
    }

    isSpeakingRef.current = true
    speechRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [])

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

  // Toggle son — coupe tout
  const toggleSound = useCallback(() => {
    const newState = !enabledRef.current
    enabledRef.current = newState
    setIsEnabled(newState)

    if (!newState) {
      // Couper tout
      bgmRef.current?.pause()
      ambianceRef.current?.pause()
      window.speechSynthesis?.cancel()
      sfxPoolRef.current.forEach(a => a.pause())
    }
  }, [])

  // Cleanup au démontage
  useEffect(() => {
    return () => {
      bgmRef.current?.pause()
      ambianceRef.current?.pause()
      sfxPoolRef.current.forEach(a => a.pause())
      window.speechSynthesis?.cancel()
    }
  }, [])

  return {
    isEnabled,
    enableSound,
    playBGM,
    playSFX,
    playMoodSound,
    speakNarration,
    fadeOutBGM,
    toggleSound,
    isSpeaking: isSpeakingRef.current,
  }
}
