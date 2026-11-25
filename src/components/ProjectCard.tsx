import Link from 'next/link'
import { ProjectImage } from '@/components/ProjectImage'
import { StackTags } from '@/components/StackTags'
import type { FEATURED_PROJECTS_QUERY_RESULT } from '../../sanity.types'

export type ProjectCardData = FEATURED_PROJECTS_QUERY_RESULT[number]

const actionClass =
    'rounded-md px-3 py-1.5 text-sm font-bold transition-colors'

export default function ProjectCard({
                                        project,
                                        eager = false,
                                    }: {
    project: ProjectCardData
    /** Load the image immediately (use for above-the-fold cards). */
    eager?: boolean
}) {
    const slug = project.slug?.current
    const image = project.image

    return (
        <article className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-black/40 transition-colors hover:border-blue-200/50">
            {/* editor-window chrome */}
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2.5">
                <span className="flex gap-1.5" aria-hidden="true">
                    <span className="size-2.5 rounded-full bg-[#ff5f56]"/>
                    <span className="size-2.5 rounded-full bg-[#ffbd2e]"/>
                    <span className="size-2.5 rounded-full bg-[#27c93f]"/>
                </span>
                <span className="ml-2 truncate font-mono text-xs text-gray-200">
                    ~/projects/{slug ?? 'untitled'}
                </span>
            </div>

            {image && (
                <ProjectImage
                    image={image}
                    title={project.title}
                    eager={eager}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
            )}

            <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="text-lg font-bold">{project.title}</h3>
                {project.description && (
                    <p className="line-clamp-3 text-sm text-gray-200">
                        {project.description}
                    </p>
                )}
                <StackTags stack={project.stack}/>

                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                    {slug && (
                        <Link
                            href={`/projects/${slug}`}
                            className={`${actionClass} bg-blue-200 text-black hover:bg-blue-200/80`}
                        >
                            View project &rarr;
                        </Link>
                    )}
                    {project.repoUrl && (
                        <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${actionClass} border border-white/20 text-white hover:border-white/50`}
                        >
                            Source
                        </a>
                    )}
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${actionClass} bg-magenta-500 text-white hover:bg-magenta-500/80`}
                        >
                            Live &#8599;
                        </a>
                    )}
                </div>
            </div>
        </article>
    )
}
