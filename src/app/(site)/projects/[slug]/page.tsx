import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/sanity/lib/fetchers";
import { client } from "@/sanity/lib/client";
import { ALL_PROJECT_SLUGS_QUERY } from "@/sanity/queries/projects";
import { urlFor } from "@/sanity/lib/image";
import { StackTags } from "@/components/StackTags";
import { ProjectImage } from "@/components/ProjectImage";
import Link from "next/link";
import { Suspense } from "react";

export async function generateStaticParams() {
    const slugs = await client
        .withConfig({ useCdn: false })
        .fetch(ALL_PROJECT_SLUGS_QUERY);
    const params = slugs
        .filter((item): item is { slug: string } => Boolean(item.slug))
        .map((item) => ({ slug: item.slug }));

    // Cache Components requires at least one result at build time. When the
    // dataset has no projects yet, fall back to a placeholder that 404s.
    return params.length > 0 ? params : [{ slug: "__placeholder__" }];
}

export async function generateMetadata({
                                           params,
                                       }: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) return { title: "Project not found", robots: { index: false } };

    const title = project.title ?? "Project";
    const description =
        project.description ?? `${title} — a project by Midnight Code.`;
    const url = `https://midnightcode.io/projects/${slug}`;
    const image = project.image
        ? urlFor(project.image).width(1200).height(630).fit("crop").url()
        : undefined;

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            url,
            type: "article",
            images: image ? [{ url: image, width: 1200, height: 630 }] : [],
        },
    };
}

export default function ProjectPage({
                                        params,
                                    }: {
    params: Promise<{ slug: string }>;
}) {
    return (
        <Suspense
            fallback={
                <div className="container mx-auto max-w-3xl lg:max-w-5xl px-5 py-12">
                    <Link href="/projects">&larr; Return to projects</Link>
                </div>
            }
        >
            <ProjectContent params={params} />
        </Suspense>
    );
}

async function ProjectContent({
                                  params,
                              }: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) notFound();

    const image = project.image;

    return (
        <div className="container mx-auto max-w-3xl lg:max-w-5xl px-5 py-12">
            <div className="mb-8">
                <Link href="/projects">&larr; Return to projects</Link>
            </div>

            <p className="font-mono text-sm text-gray-200 mb-2">
                ~/projects/{slug}
            </p>
            {image && (
                <div className="mb-8 overflow-hidden rounded-xl border border-white/10">
                    <ProjectImage
                        image={image}
                        title={project.title}
                        eager
                        sizes="(min-width: 1024px) 64rem, 100vw"
                    />
                </div>
            )}
            <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
            {project.description && (
                <p className="font-mono text-lg mb-6 max-w-2xl">
                    {project.description}
                </p>
            )}
            <div className="mb-8">
                <StackTags stack={project.stack} />
            </div>
            <div className="flex flex-wrap gap-3">
                {project.liveUrl && (
                    <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-200 text-black font-bold py-2 px-6 rounded-md inline-block"
                    >
                        Visit site &#8599;
                    </a>
                )}
                {project.repoUrl && (
                    <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-white/20 text-white font-bold py-2 px-6 rounded-md inline-block hover:border-white/50"
                    >
                        View source
                    </a>
                )}
            </div>
        </div>
    );
}