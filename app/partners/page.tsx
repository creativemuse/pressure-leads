import type { Metadata } from "next"
import { PartnersPageContent } from "@/components/partners-page-content"

export const metadata: Metadata = {
  title: "Partners | St. Augustine Pressure Washing Pros",
  description: "Partner with St. Augustine Pressure Washing Pros. Learn about Clutch 1.0 by Cliste — AI-powered lead management for service businesses.",
  alternates: {
    canonical: "/partners",
  },
  robots: {
    index: false,
  },
}

export default function PartnersPage() {
  return <PartnersPageContent />
}
