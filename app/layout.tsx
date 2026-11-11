import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { ReactNode } from "react";
import { content, copy } from "@/lib/content";
import { SITE } from "@/lib/i18n";
import "./globals.css";

// shared defaults; every page sets its own canonical and hreflang (pageMetadata in lib/i18n.ts)
export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  description: copy.en.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: content.name,
  url: `${SITE}/`,
  jobTitle: content.role,
  worksFor: {
    "@type": "Organization",
    name: "Software Mind",
    url: "https://softwaremind.com/",
  },
  alumniOf: ["AGH University of Krakow", "University of Silesia in Katowice"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cieszyn",
    addressCountry: "PL",
  },
  sameAs: content.links
    .filter((l) => l.url.startsWith("http"))
    .map((l) => l.url),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
        />
      </body>
    </html>
  );
}
