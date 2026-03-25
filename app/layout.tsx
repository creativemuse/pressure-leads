import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import "./globals.css"
import { PageTransition } from "@/components/page-transition"
import { NavigationTransition } from "@/components/navigation-transition"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Dancing_Script, Caveat } from "next/font/google"

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
  display: "swap",
})

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
})

const siteTitle = "St. Augustine Pressure Washing Pros"
const siteDescription =
  "Get your pressure washing service scheduled quickly and easily. From your first question to a fast quote and booking, every step is handled quickly so you can get your home cleaned without the wait."

const ogImagePath = "/images/before_after/home.png"

/** Production custom domain — used for metadataBase when `NEXT_PUBLIC_SITE_URL` is unset (Vercel production only). */
const CANONICAL_SITE_URL = "https://www.staugustinepressurewashingpros.com"

function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, "")

  if (process.env.VERCEL_ENV === "production") return CANONICAL_SITE_URL

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

  return "http://localhost:3000"
}

const siteUrl = resolveSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  generator: "v0.app",
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: siteTitle,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: ogImagePath,
        alt: "Pressure washing results — home exterior cleaning in St. Augustine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImagePath],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased ${dancingScript.variable} ${caveat.variable}`}>
        <Suspense fallback={null}>
          <NavigationTransition />
          <PageTransition>{children}</PageTransition>
        </Suspense>
        <SpeedInsights />
      </body>
    </html>
  )
}
