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

  return {
    title: `Ép. ${episode.number} — ${episode.title}`,
    description: episode.description,
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
