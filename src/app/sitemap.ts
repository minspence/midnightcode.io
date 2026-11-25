import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { ALL_PROJECT_SLUGS_QUERY } from "@/sanity/queries/projects";

const BASE_URL = "https://midnightcode.io";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await client
    .withConfig({ useCdn: false })
    .fetch(ALL_PROJECT_SLUGS_QUERY);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/about`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, changeFrequency: "yearly", priority: 0.6 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = slugs
    .filter((item): item is { slug: string } => Boolean(item.slug))
    .map((item) => ({
      url: `${BASE_URL}/projects/${item.slug}`,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [...staticRoutes, ...projectRoutes];
}
