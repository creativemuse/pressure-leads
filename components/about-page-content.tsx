"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Shield, MapPin, Clock, Award } from "lucide-react"

import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { Footer } from "@/components/footer"
import { QuoteFormDialog } from "@/components/quote-form-dialog"
import Aurora from "@/components/Aurora"

const highlights = [
  {
    icon: Shield,
    title: "Licensed & Insured",
    description:
      "Fully licensed and insured for your protection. We carry commercial general liability insurance and can provide certificates on request.",
  },
  {
    icon: MapPin,
    title: "Locally Owned",
    description:
      "Based in St. Augustine, we serve Northeast Florida communities from Jacksonville to Palm Coast. We know these neighborhoods because we live here.",
  },
  {
    icon: Clock,
    title: "Available 7 Days a Week",
    description:
      "We work around your schedule with availability Sunday through Saturday. Early morning, evening, and weekend appointments available.",
  },
  {
    icon: Award,
    title: "Professional-Grade Equipment",
    description:
      "We use commercial-grade pressure washers, soft wash systems, and eco-friendly cleaning solutions to deliver consistent, high-quality results on every job.",
  },
]

export function AboutPageContent() {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false)

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
                About St. Augustine Pressure Washing Pros
              </h1>

              <p className="text-lg text-white/75 leading-relaxed max-w-3xl">
                St. Augustine Pressure Washing Pros is a locally owned and operated exterior cleaning company based in St. Augustine, Florida. We provide professional pressure washing and soft washing services to homeowners and businesses across Northeast Florida, including Jacksonville, Jacksonville Beach, Ponte Vedra, Palm Coast, and St. Augustine Beach.
              </p>
            </div>
          </section>

          {/* Our Story */}
          <section className="px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-4xl mx-auto">
              <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.03]">
                <h2 className="text-xl md:text-2xl font-light text-white mb-4">
                  Our Story
                </h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  We started this company because we saw a need for reliable, professional pressure washing in the St. Augustine area. Too many homeowners were choosing between expensive national franchises and unreliable one-person operations with no insurance. We set out to build something different — a local company that delivers consistent quality, transparent pricing, and the accountability that comes from being part of the community we serve.
                </p>
                <p className="text-white/70 leading-relaxed">
                  Today, we serve hundreds of residential and commercial customers across Northeast Florida. From historic downtown St. Augustine to the growing communities of World Golf Village and Nocatee, we bring the same professionalism and attention to detail to every job. Our team is trained in both high-pressure washing and low-pressure soft washing techniques, so we match the right approach to every surface we clean.
                </p>
              </div>
            </div>
          </section>

          {/* Service Area */}
          <section className="px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-4xl mx-auto">
              <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.03]">
                <h2 className="text-xl md:text-2xl font-light text-white mb-4">
                  Our Service Area
                </h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  We serve all of Northeast Florida, with a focus on St. Johns, Duval, and Flagler counties. Our core service areas include:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { name: "St. Augustine", href: "/locations/st-augustine" },
                    { name: "Jacksonville", href: "/locations/jacksonville" },
                    { name: "Jacksonville Beach", href: "/locations/jacksonville-beach" },
                    { name: "Ponte Vedra", href: "/locations/ponte-vedra" },
                    { name: "Palm Coast", href: "/locations/palm-coast" },
                    { name: "St. Augustine Beach", href: "/locations/st-augustine-beach" },
                  ].map((area) => (
                    <Link
                      key={area.href}
                      href={area.href}
                      className="flex items-center gap-2 text-white/70 hover:text-white transition-colors py-1"
                    >
                      <MapPin className="w-4 h-4 shrink-0" />
                      {area.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* What We Offer */}
          <section className="px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-4xl mx-auto">
              <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.03]">
                <h2 className="text-xl md:text-2xl font-light text-white mb-4">
                  Services We Provide
                </h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  We offer the full range of exterior cleaning services for residential and commercial properties:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { name: "Driveway Cleaning", href: "/services/driveway-cleaning" },
                    { name: "House Washing", href: "/services/house-washing" },
                    { name: "Roof Soft Wash", href: "/services/roof-soft-wash" },
                    { name: "Patio & Deck Cleaning", href: "/services/patio-deck-cleaning" },
                    { name: "Fence Cleaning", href: "/services/fence-cleaning" },
                    { name: "Commercial Pressure Washing", href: "/services/commercial-pressure-washing" },
                  ].map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      className="text-white/70 hover:text-white transition-colors py-1 underline underline-offset-2 decoration-white/20 hover:decoration-white/60"
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Highlights */}
          <section className="px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-light text-white mb-8 text-center">
                Why Choose Us
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlights.map((item) => (
                  <div
                    key={item.title}
                    className="p-6 rounded-2xl border border-white/10 bg-white/[0.03]"
                  >
                    <item.icon className="w-8 h-8 text-white/50 mb-3" />
                    <h3 className="text-lg font-medium text-white mb-2">{item.title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Our Commitment */}
          <section className="px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-4xl mx-auto">
              <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.03]">
                <h2 className="text-xl md:text-2xl font-light text-white mb-4">
                  Our Commitment to Quality
                </h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  Every job starts with a free, no-obligation quote. We inspect your property, identify the surfaces and conditions, and recommend the right cleaning approach. There are no hidden fees — the price we quote is the price you pay.
                </p>
                <p className="text-white/70 leading-relaxed">
                  We use eco-friendly, biodegradable cleaning solutions that are safe for your landscaping and pets. Our technicians are trained on proper pressure settings for every surface type, from delicate stucco and historic coquina to heavy-duty commercial concrete. We stand behind our work and want every customer to be completely satisfied with the results.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="px-4 sm:px-6 lg:px-8 pb-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center p-8 md:p-10 rounded-3xl border border-white/20 bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/15%),theme(backgroundColor.white/5%))]">
                <h3 className="text-2xl md:text-3xl font-light text-white mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-white/70 mb-8 max-w-xl mx-auto">
                  Contact us for a free quote. We serve St. Augustine, Jacksonville, and all of Northeast Florida.
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

          <Footer />
          <QuoteFormDialog open={isQuoteFormOpen} onOpenChange={setIsQuoteFormOpen} />
        </div>
      </main>
    </div>
  )
}
