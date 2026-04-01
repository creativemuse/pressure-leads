import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getLocationBySlug, getAllLocationSlugs, locations } from "@/data/locations"
import { services } from "@/data/services"
import { LocationPageContent } from "@/components/location-page-content"

const SITE_URL = "https://www.staugustinepressurewashingpros.com"

type Props = {
  params: Promise<{ city: string }>
}

export async function generateStaticParams() {
  return getAllLocationSlugs().map((city) => ({ city }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params
  const location = getLocationBySlug(city)
  if (!location) return {}

  return {
    title: location.title,
    description: location.metaDescription,
    openGraph: {
      title: location.title,
      description: location.metaDescription,
      url: `/locations/${location.slug}`,
      siteName: "St. Augustine Pressure Washing Pros",
      type: "website",
      images: [{ url: location.heroImage, alt: location.heroImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: location.title,
      description: location.metaDescription,
      images: [location.heroImage],
    },
    alternates: {
      canonical: `${SITE_URL}/locations/${location.slug}`,
    },
  }
}

export default async function LocationPage({ params }: Props) {
  const { city } = await params
  const location = getLocationBySlug(city)
  if (!location) notFound()

  const otherLocations = locations
    .filter((l) => l.slug !== location.slug)
    .map((l) => ({ slug: l.slug, city: l.city }))

  const serviceLinks = services.map((s) => ({ slug: s.slug, name: s.name }))

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: "St. Augustine Pressure Washing Pros",
    telephone: "+1-904-234-5678",
    url: SITE_URL,
    image: `${SITE_URL}/images/before_after/home.png`,
    priceRange: "$$",
    areaServed: {
      "@type": "City",
      name: location.city,
    },
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: location.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <LocationPageContent
        location={location}
        otherLocations={otherLocations}
        serviceLinks={serviceLinks}
      />
    </>
  )
}
