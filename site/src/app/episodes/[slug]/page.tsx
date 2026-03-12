import { notFound } from "next/navigation";
import {
  getEpisodeBySlug,
  getEpisodeSlugs,
  getAllEpisodes,
} from "@/lib/episodes";
import { WebtoonReader } from "@/components/webtoon-reader";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getEpisodeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const episode = getEpisodeBySlug(slug);
  if (!episode) return {};

  // Utiliser le premier panel comme OG image si dispo
  const ogImage = episode.panels[0]?.src || "/images/og-default.jpg"

  return {
    title: `Ép. ${episode.number} — ${episode.title}`,
    description: episode.description,
    openGraph: {
      title: `Ép. ${episode.number} — ${episode.title} | Amazigh Comics`,
      description: episode.description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `Ép. ${episode.number} — ${episode.title}`,
      description: episode.description,
      images: [ogImage],
    },
  };
}

export default async function EpisodePage({ params }: Props) {
  const { slug } = await params;
  const episode = getEpisodeBySlug(slug);

  if (!episode) {
    notFound();
  }

  // Find next episode
  const allEpisodes = getAllEpisodes();
  const currentIndex = allEpisodes.findIndex((ep) => ep.slug === slug);
  const nextSlug =
    currentIndex >= 0 && currentIndex < allEpisodes.length - 1
      ? allEpisodes[currentIndex + 1].slug
      : undefined;

  return <WebtoonReader episode={episode} nextSlug={nextSlug} />;
}
