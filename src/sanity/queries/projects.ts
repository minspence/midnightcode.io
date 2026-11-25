import { defineQuery } from 'next-sanity'

// Shared projection: image dimensions + LQIP let the card pick a sensible fit
// and show a blur placeholder while the image loads.
const PROJECT_FIELDS = `
    _id,
    title,
    slug,
    image {
      ...,
      alt,
      asset->{ _id, metadata { lqip, dimensions { width, height, aspectRatio } } }
    },
    description,
    stack,
    liveUrl,
    repoUrl
`

export const ALL_PROJECTS_QUERY = defineQuery(`
  *[_type == "project"] | order(order asc, _createdAt desc) {
    ${PROJECT_FIELDS}
  }
`)

export const FEATURED_PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && featured == true] | order(order asc, _createdAt desc) [0..3] {
    ${PROJECT_FIELDS}
  }
`)

export const PROJECT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    ${PROJECT_FIELDS}
  }
`)

export const ALL_PROJECT_SLUGS_QUERY = defineQuery(`
  *[_type == "project"] {
    "slug": slug.current
  }
`)
