import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://manual-wiki.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/manuals", "/submit", "/terms", "/privacy", "/copyright", "/contact"];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/manuals" ? "daily" : "monthly",
    priority: route === "" ? 1 : 0.7
  }));
}
