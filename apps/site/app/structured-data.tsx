import { profile } from "../content/profile";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bologna",
      addressCountry: "IT"
    },
    url: "https://www.marcotrevisani.com",
    sameAs: profile.socialLinks.map((link) => link.href),
    knowsAbout: [
      "React",
      "Next.js",
      "Frontend architecture",
      "Design systems",
      "Product UI"
    ]
  };

  return (
    <script
      type="application/ld+json"
      // JSON-LD is static content owned by this app.
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Next metadata does not cover Person JSON-LD.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
