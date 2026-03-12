"use client"

import { usePathname } from "next/navigation"
import { Header } from "./header"
import { Footer } from "./footer"
import { AmbientAudio } from "./ambient-audio"

// Affiche header/footer sauf en mode lecture immersive (pages épisodes)
export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isEpisode = pathname.startsWith("/episodes/")

  if (isEpisode) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <main className="flex-1 relative">{children}</main>
      <Footer />
      <AmbientAudio />
    </>
  )
}
