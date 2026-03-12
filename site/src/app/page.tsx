import { getAllEpisodes } from "@/lib/episodes"
import { EpisodeCard } from "@/components/episode-card"
import Link from "next/link"

export default function HomePage() {
  const episodes = getAllEpisodes()
  const latestEpisode = episodes[0]

  return (
    <div>
      {/* Hero épique */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background image — panel panoramique */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-[rgb(var(--charbon))]"
          style={{
            backgroundImage: "url('/content/episodes/ep01-le-village-insoumis/panels/panel-00.png')",
            filter: "saturate(1.4) contrast(1.1) brightness(0.4)",
          }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--background))] via-transparent to-[rgb(var(--charbon)_/_0.3)]" />

        {/* Contenu hero */}
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <p className="text-sm tracking-[0.4em] uppercase text-[rgb(var(--creme)_/_0.7)] mb-6 animate-fade-in">
            BD Webtoon Kabyle
          </p>
          <h1 className="text-6xl sm:text-8xl font-bold text-[rgb(var(--creme))] mb-2 tracking-tight font-[var(--font-display)]">
            ⴰⵎⴰⵣⵉⵖ
          </h1>
          <p className="text-2xl sm:text-4xl font-bold text-white mb-6">
            Amazigh Comics
          </p>
          <p className="text-lg sm:text-xl text-[rgb(var(--creme)_/_0.85)] max-w-lg mx-auto mb-10 leading-relaxed text-balance">
            Un village kabyle insoumis. Des montagnes qui ne plient pas.
            Une histoire de fierté, de résistance, et de couscous.
          </p>

          {latestEpisode && (
            <Link
              href={`/episodes/${latestEpisode.slug}`}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[rgb(var(--primary))] text-white font-semibold text-lg hover:bg-[rgb(var(--primary-dark))] transition-all hover:scale-105 shadow-lg shadow-[rgb(var(--primary)_/_0.3)]"
            >
              <span>Lire l&apos;épisode pilote</span>
              <span className="text-xl">→</span>
            </Link>
          )}

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-[rgb(var(--creme)_/_0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Pitch — Astérix version Kabylie */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[rgb(var(--foreground))] mb-4 font-[var(--font-display)]">
            Astérix version Kabylie
          </h2>
          <p className="text-lg text-[rgb(var(--muted))] max-w-2xl mx-auto text-balance">
            Un village que personne n&apos;a jamais réussi à soumettre.
            Un forgeron qui découvre un secret ancien.
            Et un banquet de couscous à chaque fin d&apos;épisode.
          </p>
        </div>

        {/* 3 pilliers */}
        <div className="grid gap-8 sm:grid-cols-3 text-center">
          <div className="space-y-3">
            <div className="text-4xl">ⵣ</div>
            <h3 className="font-semibold text-[rgb(var(--foreground))]">Culture Amazighe</h3>
            <p className="text-sm text-[rgb(var(--muted))]">
              Tifinagh, proverbes kabyles et traditions ancestrales tissés dans chaque case.
            </p>
          </div>
          <div className="space-y-3">
            <div className="text-4xl">🗡️</div>
            <h3 className="font-semibold text-[rgb(var(--foreground))]">Humour & Résistance</h3>
            <p className="text-sm text-[rgb(var(--muted))]">
              Le ton d&apos;Astérix, la fierté kabyle. Drôle, jamais moqueur.
            </p>
          </div>
          <div className="space-y-3">
            <div className="text-4xl">📱</div>
            <h3 className="font-semibold text-[rgb(var(--foreground))]">Webtoon Vertical</h3>
            <p className="text-sm text-[rgb(var(--muted))]">
              Scroll, lis, voyage. Optimisé pour mobile, magnifique sur grand écran.
            </p>
          </div>
        </div>
      </section>

      {/* Séparateur */}
      <div className="flex items-center justify-center gap-3 text-[rgb(var(--primary)_/_0.3)]">
        <div className="h-px w-16 bg-current" />
        <svg viewBox="0 0 60 80" className="w-6 h-8">
          <line x1="30" y1="5" x2="30" y2="75" stroke="currentColor" strokeWidth="3" />
          <line x1="10" y1="25" x2="50" y2="55" stroke="currentColor" strokeWidth="3" />
          <line x1="50" y1="25" x2="10" y2="55" stroke="currentColor" strokeWidth="3" />
        </svg>
        <div className="h-px w-16 bg-current" />
      </div>

      {/* Épisodes */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-lg font-semibold text-[rgb(var(--foreground))] mb-6">
          Épisodes
        </h2>

        {episodes.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {episodes.map((episode) => (
              <EpisodeCard key={episode.slug} episode={episode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-[rgb(var(--muted))]">
            <p className="text-4xl mb-4">ⵣ</p>
            <p>Les épisodes arrivent bientôt...</p>
          </div>
        )}
      </section>

      {/* CTA final */}
      <section className="bg-[rgb(var(--charbon))] text-white py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-sm tracking-[0.3em] uppercase text-[rgb(var(--primary))] mb-4">
            L&apos;aventure commence
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-[var(--font-display)]">
            Les montagnes ne plient pas.
          </h2>
          <p className="text-[rgb(var(--creme)_/_0.7)] mb-8 text-balance">
            Rejois Méziane, Tamurt et le village de Taddart dans leur lutte pour la liberté.
            Le premier épisode est disponible maintenant.
          </p>
          {latestEpisode && (
            <Link
              href={`/episodes/${latestEpisode.slug}`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[rgb(var(--primary))] text-white font-semibold hover:bg-[rgb(var(--primary-dark))] transition-all hover:scale-105"
            >
              Commencer à lire →
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
