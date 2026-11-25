import { sanityFetch } from "./live";
import {
  ALL_PROJECTS_QUERY,
  FEATURED_PROJECTS_QUERY,
  PROJECT_BY_SLUG_QUERY,
} from "../queries/projects";

// With Cache Components, defineLive's sanityFetch calls cacheTag() internally
// and does not create its own cache boundary, so it must run inside a
// "use cache" function. SanityLive revalidates these tags when content changes.

export async function getFeaturedProjects() {
  "use cache";
  const { data } = await sanityFetch({ query: FEATURED_PROJECTS_QUERY });
  return data;
}

export async function getAllProjects() {
  "use cache";
  const { data } = await sanityFetch({ query: ALL_PROJECTS_QUERY });
  return data;
}

export async function getProjectBySlug(slug: string) {
  "use cache";
  const { data } = await sanityFetch({
    query: PROJECT_BY_SLUG_QUERY,
    params: { slug },
    stega: false,
  });
  return data;
}
