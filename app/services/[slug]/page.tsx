import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getServiceBySlug, getAllServiceSlugs, services } from "@/data/services"
import { locations } from "@/data/locations"
import { ServicePageContent } from "@/components/service-page-content"

const SITE_URL = "https://www.staugustinepressurewashingpros.com"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) return {}

  return {
    title: service.title,
    description: service.metaDescription,
    openGraph: {
      title: service.title,
      description: service.metaDescription,
      url: `/services/${service.slug}`,
      siteName: "St. Augustine Pressure Washing Pros",
      type: "website",
      images: [{ url: service.heroImage, alt: service.heroImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: service.title,
      description: service.metaDescription,
      images: [service.heroImage],
    },
    alternates: {
      canonical: `${SITE_URL}/services/${service.slug}`,
    },
  }
}

const howToSchemas: Record<string, object> = {
  "driveway-cleaning": {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How We Pressure Wash Your Driveway",
    description:
      "Our professional driveway pressure washing process removes oil stains, dirt, and algae buildup to restore your driveway.",
    totalTime: "PT2H",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Surface Inspection",
        text: "We inspect the driveway surface material (concrete, pavers, or brick) and identify stain types including oil, algae, and tire marks.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Pre-Treatment",
        text: "Oil stains and organic growth are pre-treated with eco-friendly cleaning solutions to break down tough buildup before washing.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Pressure Washing",
        text: "Using commercial-grade pressure washers with calibrated settings for your surface type, we strip away years of dirt and stains without damaging the driveway.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Edge & Joint Detailing",
        text: "We pay special attention to expansion joints and edges where dirt accumulates, ensuring a uniformly clean finish.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Final Rinse & Inspection",
        text: "A thorough rinse and final inspection ensures the entire surface is clean and free of residue. For pavers, we can re-sand joints to prevent weed growth.",
      },
    ],
  },
  "house-washing": {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How We Soft Wash Your Home's Exterior",
    description:
      "Our safe house washing process removes mold, mildew, and grime from siding and exterior surfaces without damage.",
    totalTime: "PT3H",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Exterior Assessment",
        text: "We assess your home's siding material (vinyl, stucco, brick, or wood) and note areas with heavy mold, mildew, or algae growth.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Protect Landscaping & Fixtures",
        text: "Plants, outdoor furniture, and light fixtures near the work area are covered or moved to prevent any overspray contact.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Apply Cleaning Solution",
        text: "A biodegradable cleaning solution is applied at low pressure to break down mold, mildew, and dirt on all exterior surfaces.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Gentle Soft Wash Rinse",
        text: "Using controlled low-pressure rinsing, we remove all loosened contaminants without damaging siding, paint, or caulking.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Detail & Final Walkthrough",
        text: "We detail around windows, doors, and trim, then do a walkthrough with the homeowner to ensure complete satisfaction.",
      },
    ],
  },
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) notFound()

  const otherServices = services
    .filter((s) => s.slug !== service.slug)
    .map((s) => ({ slug: s.slug, name: s.name }))

  const locationLinks = locations.map((l) => ({ slug: l.slug, city: l.city }))

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.name,
    description: service.metaDescription,
    provider: {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#business`,
      name: "St. Augustine Pressure Washing Pros",
    },
    areaServed: [
      { "@type": "City", name: "St. Augustine" },
      { "@type": "City", name: "Jacksonville" },
      { "@type": "City", name: "Jacksonville Beach" },
      { "@type": "City", name: "Ponte Vedra" },
      { "@type": "City", name: "Palm Coast" },
      { "@type": "City", name: "St. Augustine Beach" },
    ],
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${SITE_URL}/services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.name,
        item: `${SITE_URL}/services/${service.slug}`,
      },
    ],
  }

  const howToSchema = howToSchemas[service.slug] ?? null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
      <ServicePageContent service={service} otherServices={otherServices} locationLinks={locationLinks} />
    </>
  )
}
