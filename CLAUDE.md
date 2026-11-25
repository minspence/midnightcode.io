# Project
This is a Next.js 16 app using App Router, Tailwind, and Sanity.

## Commands
- Dev server: `pnpm dev`
- Run test: `pnpm test`
- Build: `pnpm build`
- lint: `pnpm lint`

## Code Style 
- Use 2-space indentation
- Prefer named exports
- All API routes go in `/src/app/api`
- Sanity schemas go in `/src/sanity/schemaTypes`
- Use server actions instead of API routes where possible


## Reference Project Docs

### AGENTS.md
Review the AGENTS.md for any changes at the start of each session.
### Skills
Skills are in the `.claude/skills`
- After every edit, verify the page still works at runtime using the `next-dev-loop` Skill.
- Use the `next-bundle-optimizer` skill to produce a report of the initial load performance of this site.
- Adopt Cache Components in this project using the `next-cache-components-adoption` Skill.
- Optimize the static shell for /dashboard using the `next-cache-components-optimizer` Skill. On an initial load, the header and project list should be available immediately.
- Adopt Partial Prefetching in this project using the `next-partial-prefetching-adoption` Skill.
- Make the projects title instant when navigating from /projects to /projects/[id]. Use the `next-partial-prefetching-optimizer` Skill.
- For Sanity related items use `sanity-best-practices`

### README.md
Please read if you need more info: @README.md
