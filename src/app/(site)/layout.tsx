import { Suspense } from "react";
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { SanityLive } from "@/sanity/lib/live";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Midnight Code",
  url: "https://midnightcode.io",
  logo: "https://midnightcode.io/logo.png",
  description:
    "Web and software development company building responsive websites and web apps with Next.js, Sanity, and Supabase.",
  areaServed: "US",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Winston-Salem",
    addressRegion: "NC",
    addressCountry: "US",
  },
  sameAs: [
    "https://github.com/minspence",
    "https://linkedin.com/in/minuitspence",
  ],
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* NavigationBar reads usePathname(), which suspends on dynamic routes */}
      <Suspense fallback={<header className="bg-black sticky top-0 z-50 h-16" />}>
        <NavigationBar />
      </Suspense>
      {children}
      <Footer />
      <JsonLd data={organizationSchema} />
      <SanityLive includeDrafts={false} />
    </>
  );
}
