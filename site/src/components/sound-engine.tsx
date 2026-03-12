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

// AudioContext global — créé une seule fois au premier clic utilisateur
let globalAudioCtx: AudioContext | null = null

function getAudioCtx(): AudioContext {
  if (!globalAudioCtx) {
    globalAudioCtx = new AudioContext()
  }
  return globalAudioCtx
}

export function useSoundEngine() {
  const bgmRef = useRef<HTMLAudioElement | null>(null)
  const ambianceRef = useRef<HTMLAudioElement | null>(null)
  const sfxPoolRef = useRef<Map<string, HTMLAudioElement>>(new Map())
  const [isEnabled, setIsEnabled] = useState(false)
  // useRef pour éviter le bug de stale closure dans les callbacks
  const enabledRef = useRef(false)
  const narrationRef = useRef<HTMLAudioElement | null>(null)
  const isSpeakingRef = useRef(false)

  // Sync ref avec state
  useEffect(() => {
    enabledRef.current = isEnabled
  }, [isEnabled])

  // Activer le son au premier clic — débloquer l'AudioContext (Chrome autoplay policy)
  const enableSound = useCallback(() => {
    enabledRef.current = true
    setIsEnabled(true)
    // Résumer l'AudioContext si suspendu (doit être dans un user gesture)
    const ctx = getAudioCtx()
    if (ctx.state === "suspended") {
      ctx.resume()
    }
    // Créer l'élément narration et le "débloquer" avec un silence
    // Cet élément sera réutilisé pour toutes les narrations
    if (!narrationRef.current) {
      const a = new Audio()
      a.volume = 0
      // Jouer un micro-silence pour débloquer l'élément dans le user gesture
      a.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="
      a.play().then(() => {
        a.pause()
        a.currentTime = 0
      }).catch(() => {})
      narrationRef.current = a
    }
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

  // Narration vocale — fichiers ElevenLabs pré-générés
  // Réutilise l'élément Audio débloqué dans enableSound()
  const playNarration = useCallback((panelIndex: number) => {
    if (!enabledRef.current) return
    const audio = narrationRef.current
    if (!audio) return

    // Stopper la narration en cours
    audio.pause()
    audio.currentTime = 0

    const src = `/audio/narration/panel-${String(panelIndex).padStart(2, "0")}.mp3`
    audio.volume = 0.85
    isSpeakingRef.current = true

    // Duck la BGM pendant la narration
    const bgm = bgmRef.current
    const originalBgmVol = bgm ? bgm.volume : 0
    if (bgm) bgm.volume = originalBgmVol * 0.3

    const fadeBackBGM = () => {
      if (!bgm) return
      let vol = bgm.volume
      const fadeBack = setInterval(() => {
        vol += (originalBgmVol - vol) / 15
        if (vol >= originalBgmVol * 0.95) {
          bgm.volume = originalBgmVol
          clearInterval(fadeBack)
        } else {
          bgm.volume = vol
        }
      }, 50)
    }

    audio.onended = () => {
      isSpeakingRef.current = false
      fadeBackBGM()
    }

    audio.onerror = () => {
      isSpeakingRef.current = false
      fadeBackBGM()
    }

    // Changer la source et jouer
    audio.src = src
    audio.play().catch(() => {
      isSpeakingRef.current = false
      fadeBackBGM()
    })
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
      narrationRef.current?.pause()
      sfxPoolRef.current.forEach(a => a.pause())
    }
  }, [])

  // Cleanup au démontage
  useEffect(() => {
    return () => {
      bgmRef.current?.pause()
      ambianceRef.current?.pause()
      narrationRef.current?.pause()
      sfxPoolRef.current.forEach(a => a.pause())
    }
  }, [])

  return {
    isEnabled,
    enableSound,
    playBGM,
    playSFX,
    playMoodSound,
    playNarration,
    fadeOutBGM,
    toggleSound,
    isSpeaking: isSpeakingRef.current,
  }
}
