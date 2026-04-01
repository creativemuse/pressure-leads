import type { Metadata } from "next"
import { AboutPageContent } from "@/components/about-page-content"

const SITE_URL = "https://www.staugustinepressurewashingpros.com"

export const metadata: Metadata = {
  title: "About Us | St. Augustine Pressure Washing Pros",
  description:
    "Learn about St. Augustine Pressure Washing Pros — a locally owned pressure washing company serving St. Augustine, Jacksonville, and Northeast Florida. Licensed, insured, and experienced.",
  openGraph: {
    title: "About Us | St. Augustine Pressure Washing Pros",
    description:
      "Locally owned pressure washing company serving St. Augustine and Northeast Florida. Licensed, insured, and committed to quality exterior cleaning.",
    url: "/about",
    siteName: "St. Augustine Pressure Washing Pros",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | St. Augustine Pressure Washing Pros",
    description:
      "Locally owned pressure washing company serving St. Augustine and Northeast Florida.",
  },
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
}

export default function AboutPage() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: "St. Augustine Pressure Washing Pros",
    url: SITE_URL,
    telephone: "+1-904-234-5678",
    image: `${SITE_URL}/Pressurewash_logo.svg`,
    priceRange: "$$",
    description:
      "Professional pressure washing and soft washing services in St. Augustine and Northeast Florida. Locally owned and operated, fully licensed and insured.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "St. Augustine",
      addressRegion: "FL",
      addressCountry: "US",
    },
    areaServed: [
      { "@type": "City", name: "St. Augustine" },
      { "@type": "City", name: "Jacksonville" },
      { "@type": "City", name: "Jacksonville Beach" },
      { "@type": "City", name: "Ponte Vedra" },
      { "@type": "City", name: "Palm Coast" },
      { "@type": "City", name: "St. Augustine Beach" },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    sameAs: [],
    knowsAbout: [
      "Pressure Washing",
      "Soft Washing",
      "Roof Cleaning",
      "Driveway Cleaning",
      "House Washing",
      "Commercial Pressure Washing",
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <AboutPageContent />
    </>
  )
}
