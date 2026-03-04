import fs from "fs";
import path from "path";

const episodesDirectory = path.join(process.cwd(), "content/episodes");

export interface EpisodeMeta {
  slug: string;
  title: string;
  number: number;
  description: string;
  date: string;
  panelCount: number;
}

export interface Episode extends EpisodeMeta {
  panels: PanelData[];
}

export interface PanelData {
  index: number;
  type: "image" | "placeholder";
  src?: string;
  scene: string;
  dialogue?: string;
  mood: string;
  colors: string[];
}

function getEpisodeDirs(): string[] {
  if (!fs.existsSync(episodesDirectory)) {
    return [];
  }
  return fs
    .readdirSync(episodesDirectory)
    .filter((dir) => {
      const fullPath = path.join(episodesDirectory, dir);
      return fs.statSync(fullPath).isDirectory();
    })
    .sort();
}

export function getEpisodeBySlug(slug: string): Episode | null {
  const episodeDir = path.join(episodesDirectory, slug);
  const metaPath = path.join(episodeDir, "meta.json");

  if (!fs.existsSync(metaPath)) {
    return null;
  }

  const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));

  // Check for panel images
  const panelsDir = path.join(episodeDir, "panels");
  let panels: PanelData[] = meta.panels || [];

  if (fs.existsSync(panelsDir)) {
    const imageFiles = fs
      .readdirSync(panelsDir)
      .filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f))
      .sort();

    if (imageFiles.length > 0) {
      panels = panels.map((panel: PanelData, i: number) => ({
        ...panel,
        type: imageFiles[i] ? "image" : "placeholder",
        src: imageFiles[i]
          ? `/content/episodes/${slug}/panels/${imageFiles[i]}`
          : undefined,
      }));
    }
  }

  return {
    slug,
    title: meta.title,
    number: meta.number,
    description: meta.description,
    date: meta.date,
    panelCount: panels.length,
    panels,
  };
}

export function getAllEpisodes(): EpisodeMeta[] {
  const dirs = getEpisodeDirs();
  return dirs
    .map((dir) => {
      const episode = getEpisodeBySlug(dir);
      if (!episode) return null;
      const { panels, ...meta } = episode;
      return meta;
    })
    .filter((ep): ep is EpisodeMeta => ep !== null)
    .sort((a, b) => a.number - b.number);
}

export function getEpisodeSlugs(): string[] {
  return getEpisodeDirs();
}
