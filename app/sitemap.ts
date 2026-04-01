import type { MetadataRoute } from "next"
import { getAllServiceSlugs } from "@/data/services"
import { getAllLocationSlugs } from "@/data/locations"

const CANONICAL_SITE_URL = "https://www.staugustinepressurewashingpros.com"

function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, "")
  if (process.env.VERCEL_ENV === "production") return CANONICAL_SITE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3000"
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = resolveSiteUrl()

  const servicePages: MetadataRoute.Sitemap = getAllServiceSlugs().map((slug) => ({
    url: `${siteUrl}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const locationPages: MetadataRoute.Sitemap = getAllLocationSlugs().map((slug) => ({
    url: `${siteUrl}/locations/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/partners`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...servicePages,
    ...locationPages,
  ]
}
