import { getAllEpisodes } from "@/lib/episodes"

const siteUrl = "https://amazigh-comics.vercel.app"

export default function sitemap() {
  const episodes = getAllEpisodes()

  const episodeUrls = episodes.map((ep) => ({
    url: `${siteUrl}/episodes/${ep.slug}`,
    lastModified: new Date(ep.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...episodeUrls,
  ]
}
