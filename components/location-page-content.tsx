"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowLeft, MapPin, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react"

import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { Footer } from "@/components/footer"
import { QuoteFormDialog } from "@/components/quote-form-dialog"
import Aurora from "@/components/Aurora"
import type { LocationData } from "@/data/locations"

export function LocationPageContent({
  location,
  otherLocations,
  serviceLinks,
}: {
  location: LocationData
  otherLocations: { slug: string; city: string }[]
  serviceLinks: { slug: string; name: string }[]
}) {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <main className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 w-full h-full">
          <Aurora colorStops={["#475569", "#64748b", "#475569"]} amplitude={1.2} blend={0.6} speed={0.8} />
        </div>
        <div className="relative z-10">
          <GlassmorphismNav onQuoteClick={() => setIsQuoteFormOpen(true)} />

          {/* Hero */}
          <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6 leading-tight">
                {location.h1}
              </h1>

              <p className="text-lg text-white/75 leading-relaxed max-w-3xl">
                {location.intro}
              </p>
            </div>
          </section>

          {/* Hero Image */}
          <section className="px-4 sm:px-6 lg:px-8 pb-16">
            <div className="max-w-4xl mx-auto">
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src={location.heroImage}
                  alt={location.heroImageAlt}
                  width={1200}
                  height={600}
                  className="w-full h-64 md:h-96 object-cover"
                  priority
                />
              </div>
            </div>
          </section>

          {/* Content Sections */}
          {location.sections.map((section, i) => (
            <section key={i} className="px-4 sm:px-6 lg:px-8 pb-12">
              <div className="max-w-4xl mx-auto">
                <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.03]">
                  <h2 className="text-xl md:text-2xl font-light text-white mb-4">
                    {section.heading}
                  </h2>
                  <p className="text-white/70 leading-relaxed">
                    {section.body}
                  </p>
                </div>
              </div>
            </section>
          ))}

          {/* Service Area & Landmarks */}
          <section className="px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03]">
                <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-white/50" />
                  Service Area
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {location.serviceArea}
                </p>
              </div>
              <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03]">
                <h3 className="text-lg font-medium text-white mb-3">
                  Local Landmarks We Serve Near
                </h3>
                <ul className="space-y-1.5">
                  {location.landmarks.map((landmark) => (
                    <li key={landmark} className="text-white/70 text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/30 shrink-0" />
                      {landmark}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Services Available */}
          <section className="px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl md:text-2xl font-light text-white mb-6 text-center">
                Services Available in {location.city}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {serviceLinks.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors shrink-0" />
                      <span className="text-white/80 group-hover:text-white transition-colors">
                        {s.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="px-4 sm:px-6 lg:px-8 pb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-light text-white mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {location.faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <span className="text-white font-medium pr-4">{faq.question}</span>
                      {openFaq === i ? (
                        <ChevronUp className="w-5 h-5 text-white/50 shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-white/50 shrink-0" />
                      )}
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openFaq === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="px-5 pb-5">
                        <p className="text-white/70 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="px-4 sm:px-6 lg:px-8 pb-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center p-8 md:p-10 rounded-3xl border border-white/20 bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/15%),theme(backgroundColor.white/5%))]">
                <h3 className="text-2xl md:text-3xl font-light text-white mb-4">
                  Get a Free Quote in{" "}
                  <span className="font-medium italic bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                    {location.city}
                  </span>
                </h3>
                <p className="text-white/70 mb-8 max-w-xl mx-auto">
                  Professional pressure washing for homes and businesses in {location.city}. Fast scheduling, no obligation.
                </p>
                <button
                  onClick={() => setIsQuoteFormOpen(true)}
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-white to-slate-100 text-slate-900 rounded-full font-semibold text-base hover:from-slate-50 hover:to-slate-200 transition-all duration-300 hover:scale-105 shadow-2xl"
                >
                  Get My Free Quote
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </section>

          {/* Other Locations */}
          <section className="px-4 sm:px-6 lg:px-8 pb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl md:text-2xl font-light text-white mb-6 text-center">
                We Also Serve
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherLocations.map((l) => (
                  <Link
                    key={l.slug}
                    href={`/locations/${l.slug}`}
                    className="p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors shrink-0" />
                      <span className="text-white/80 group-hover:text-white transition-colors">
                        {l.city}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <Footer />
          <QuoteFormDialog open={isQuoteFormOpen} onOpenChange={setIsQuoteFormOpen} />
        </div>
      </main>
    </div>
  )
}
