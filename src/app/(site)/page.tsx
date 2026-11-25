import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getFeaturedProjects } from "@/sanity/lib/fetchers";
import ProjectCard from "@/components/ProjectCard";
import ContactForm from "@/components/contactForm";
import { TechBadges } from "@/components/TechBadge";
import { TerminalIntro } from "@/components/TerminalIntro";

export const metadata: Metadata = {
  title: { absolute: "Midnight Code | Web Development in Winston-Salem, NC" },
  description: "Midnight Code a Web and Software Development company based in North Carolina. Specializing in Application development for web and mobile.",
  alternates: { canonical: "https://midnightcode.io" },
  openGraph: {
    title: "Midnight Code | Web Development in Winston-Salem, NC",
    description:
        "Midnight Code builds responsive websites and web apps using Next.js, Sanity, and Supabase. Based in North Carolina — let's build your next project.",
    url: "https://midnightcode.io",
    type: "website",
  },
};

async function FeaturedProjects() {
  const featuredProjects = await getFeaturedProjects();

  return featuredProjects.length > 0 ? (
    <div className="grid gap-9 grid-cols-[repeat(auto-fill,minmax(18rem,1fr))]">
      {featuredProjects.map((project, i) => (
        <ProjectCard key={project._id} project={project} eager={i === 0} />
      ))}
    </div>
  ) : (
    <p className="font-mono text-center">No featured projects yet.</p>
  );
}

export default function Home() {
  return (
      <div>
        <main>
          {/* hero section */}
          <section
              id="hero"
              className="container mx-auto max-w-3xl lg:max-w-7xl px-5 py-12 md:py-14 lg:py-16 grid gap-5 lg:grid-cols-2 items-center"
          >
            <div className="md:col-span-2 mb-7">
              <h1 className="font-mono font-bold mb-2 sm:mb-2.5 lg:text-9xl md:text-7xl sm:text-5xl text-4xl tracking-tight leading-[97.52%] uppercase text-center">
                Midnight Code
              </h1>
              <p className="font-mono text-center text-sm/6">
                &#34;The best ideas come after midnight.&#34;
              </p>
            </div>
            <div className="lg:col-span-2 mb-2">
              <TerminalIntro />
            </div>
            <div className="lg:col-span-2 flex flex-col md:flex-row gap-5 md:items-center">
              <p className="font-mono text-center md:text-left md:flex-1 max-w-150">
                Website development company based in Winston-Salem, North
                Carolina. Specializing in creating responsive websites, utilizing
                Next.js, Sanity, Supabase, and Webflow. Take a look at my work
                and let&#39;s build your next project!
              </p>
              <div className="flex gap-5 justify-center md:justify-end md:shrink-0">
                <Link href="/contact">
                  <button
                      type="button"
                      className="bg-blue-200 text-black font-bold py-2 px-4 rounded-md"
                  >
                    Let&#39;s Chat
                  </button>
                </Link>
                <Link href="/projects">
                  <button
                      type="button"
                      className="bg-magenta-500 text-white font-bold py-2 px-4 rounded-md"
                  >
                    View Work
                  </button>
                </Link>
              </div>
            </div>
          </section>

          {/* featured section */}
          <section
              id="featured"
              className="container mx-auto max-w-3xl lg:max-w-7xl px-5 py-12 md:py-14 lg:py-16"
          >
            <h2 className="font-mono text-3xl font-bold text-center col-span-full mb-7">
              {"// featured"}
            </h2>
            <Suspense
                fallback={<p className="font-mono text-center">Loading projects…</p>}
            >
              <FeaturedProjects />
            </Suspense>
          </section>

          {/* tools section */}
          <section
              id="tools"
              className="container mx-auto max-w-3xl lg:max-w-7xl px-5 py-12 md:py-14 lg:py-16"
          >
            <div className="mb-7">
              <h2 className="font-mono text-3xl font-bold mb-2.5">~/tools</h2>
              <p className="font-mono">
                &#34;If you care about that sorta thing.&#34;
              </p>
            </div>
            <TechBadges />
          </section>
          {/* contact section */}
          <section
              id="contact"
              className="container mx-auto max-w-3xl lg:max-w-7xl px-5 py-12 md:py-14 lg:py-16 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center"
          >
            <div className="order-2 md:order-1">
              <ContactForm />
            </div>
            <div className="order-1 md:order-2 text-center md:text-left">
              <h2 className="font-mono font-bold text-4xl mb-2.5">$ contact</h2>
              <p className="font-mono text-sm max-w-100 mx-auto md:mx-0">
                &#34;Whatever you want to build, website, web application, or have
                an app idea, I&#39;m here to help. Drop me a line and let&#39;s talk.&#34;
              </p>
            </div>
          </section>
        </main>
      </div>
  );
}
