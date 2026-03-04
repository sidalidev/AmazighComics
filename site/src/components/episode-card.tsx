import Link from "next/link";
import type { EpisodeMeta } from "@/lib/episodes";
import { formatDate } from "@/lib/utils";

export function EpisodeCard({ episode }: { episode: EpisodeMeta }) {
  return (
    <Link
      href={`/episodes/${episode.slug}`}
      className="group block rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--white)_/_0.5)] overflow-hidden hover:border-[rgb(var(--primary)_/_0.3)] hover:shadow-lg transition-all duration-300"
    >
      {/* Preview gradient — couleurs kabyles */}
      <div className="relative h-48 amazigh-pattern bg-gradient-to-br from-[rgb(var(--ocre)_/_0.2)] via-[rgb(var(--olive)_/_0.15)] to-[rgb(var(--djurdjura)_/_0.2)] flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <span className="block text-6xl font-bold text-[rgb(var(--primary)_/_0.3)] group-hover:text-[rgb(var(--primary)_/_0.5)] transition-colors">
            {String(episode.number).padStart(2, "0")}
          </span>
          <span className="block text-sm text-[rgb(var(--muted))] mt-1">
            {episode.panelCount} cases
          </span>
        </div>
        {/* Motif berbère décoratif */}
        <svg
          className="absolute bottom-0 left-0 right-0 h-8 text-[rgb(var(--background))]"
          viewBox="0 0 400 32"
          preserveAspectRatio="none"
        >
          <path
            d="M0 32 L20 16 L40 32 L60 16 L80 32 L100 16 L120 32 L140 16 L160 32 L180 16 L200 32 L220 16 L240 32 L260 16 L280 32 L300 16 L320 32 L340 16 L360 32 L380 16 L400 32 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-[rgb(var(--primary))] bg-[rgb(var(--primary)_/_0.1)] px-2 py-0.5 rounded-full">
            Épisode {episode.number}
          </span>
          <span className="text-xs text-[rgb(var(--muted))]">
            {formatDate(episode.date)}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-[rgb(var(--foreground))] group-hover:text-[rgb(var(--primary))] transition-colors mb-1">
          {episode.title}
        </h3>
        <p className="text-sm text-[rgb(var(--muted))] line-clamp-2">
          {episode.description}
        </p>
      </div>
    </Link>
  );
}
