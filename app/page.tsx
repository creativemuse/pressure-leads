import type { Metadata } from "next"
import { HomePageContent } from "@/components/home-page-content"

export const metadata: Metadata = {
  title: "St. Augustine Pressure Washing | Professional Exterior Cleaning FL",
  description:
    "Top-rated pressure washing in St. Augustine & Northeast Florida. Driveways, roofs, houses, patios & commercial exteriors. Fast free quotes — schedule today.",
  alternates: {
    canonical: "/",
  },
}

export default function HomePage() {
  return <HomePageContent />
}
