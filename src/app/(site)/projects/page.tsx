import type { Metadata } from "next";
import { getAllProjects } from "@/sanity/lib/fetchers";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";
import { Suspense } from "react";


export const metadata: Metadata = {
    title: "Web Development Portfolio | Projects",
    description:
        "Browse Midnight Code's portfolio of responsive websites and web apps built with Next.js, Sanity, and Tailwind CSS for clients across North Carolina and beyond.",
    alternates: { canonical: "https://midnightcode.io/projects" },
    openGraph: {
        title: "Web Development Portfolio | Midnight Code Projects",
        description:
            "Browse Midnight Code's portfolio of responsive websites and web apps built with Next.js, Sanity, and Tailwind CSS for clients across North Carolina and beyond.",
        url: "https://midnightcode.io/projects",
        type: "website",
    },
};


async function ProjectList() {
    const projects = await getAllProjects();

    return projects.length === 0 ? (
        <p className="font-mono">No projects yet — check back soon.</p>
    ) : (
        <div className="grid gap-9 grid-cols-[repeat(auto-fill,minmax(18rem,1fr))]">
            {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
            ))}
        </div>
    );
}

export default function ProjectsPage() {
    return (
        <div className="container mx-auto max-w-3xl lg:max-w-7xl px-5 py-12">
            <div className="mb-8">
                <Link href="/">&larr; Return Home</Link>
            </div>
            <h1 className="text-4xl font-bold mb-2.5">~/projects</h1>
            <p className="font-mono mb-12 text-gray-200">{"// things I've built"}</p>
            <Suspense fallback={<p className="font-mono">Loading projects…</p>}>
                <ProjectList />
            </Suspense>
        </div>
    );
}