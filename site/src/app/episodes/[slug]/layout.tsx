// Layout épisode — le LayoutShell détecte /episodes/ et supprime le header/footer
export default function EpisodeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
