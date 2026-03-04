import { getAllEpisodes } from "@/lib/episodes";
import { EpisodeCard } from "@/components/episode-card";

export default function HomePage() {
  const episodes = getAllEpisodes();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-5xl sm:text-7xl font-bold text-[rgb(var(--primary))] mb-4 tracking-tight">
          ⴰⵎⴰⵣⵉⵖ
        </h1>
        <p className="text-xl sm:text-2xl font-semibold text-[rgb(var(--foreground))] mb-3">
          Amazigh Comics
        </p>
        <p className="text-[rgb(var(--muted))] max-w-md mx-auto text-balance">
          BD webtoon kabyle — des villages insoumis aux montagnes du Djurdjura.
          Scroll, lis, voyage.
        </p>

        {/* Séparateur amazigh */}
        <div className="flex items-center justify-center gap-3 mt-8 text-[rgb(var(--primary)_/_0.3)]">
          <div className="h-px w-12 bg-current" />
          <svg viewBox="0 0 60 80" className="w-6 h-8">
            <line x1="30" y1="5" x2="30" y2="75" stroke="currentColor" strokeWidth="3" />
            <line x1="10" y1="25" x2="50" y2="55" stroke="currentColor" strokeWidth="3" />
            <line x1="50" y1="25" x2="10" y2="55" stroke="currentColor" strokeWidth="3" />
          </svg>
          <div className="h-px w-12 bg-current" />
        </div>
      </section>

      {/* Épisodes */}
      <section>
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
    </div>
  );
}
