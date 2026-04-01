import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getServiceBySlug, getAllServiceSlugs, services } from "@/data/services"
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

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) notFound()

  const otherServices = services
    .filter((s) => s.slug !== service.slug)
    .map((s) => ({ slug: s.slug, name: s.name }))

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
      <ServicePageContent service={service} otherServices={otherServices} />
    </>
  )
}
