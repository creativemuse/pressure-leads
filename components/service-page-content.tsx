"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowLeft, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react"

import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { Footer } from "@/components/footer"
import { QuoteFormDialog } from "@/components/quote-form-dialog"
import Aurora from "@/components/Aurora"
import type { ServiceData } from "@/data/services"

export function ServicePageContent({
  service,
  otherServices,
}: {
  service: ServiceData
  otherServices: { slug: string; name: string }[]
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
                {service.h1}
              </h1>

              <p className="text-lg text-white/75 leading-relaxed max-w-3xl">
                {service.intro}
              </p>
            </div>
          </section>

          {/* Hero Image */}
          <section className="px-4 sm:px-6 lg:px-8 pb-16">
            <div className="max-w-4xl mx-auto">
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src={service.heroImage}
                  alt={service.heroImageAlt}
                  width={1200}
                  height={600}
                  className="w-full h-64 md:h-96 object-cover"
                  priority
                />
              </div>
            </div>
          </section>

          {/* Content Sections */}
          {service.sections.map((section, i) => (
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

          {/* Pricing Section */}
          {service.pricing && service.pricing.length > 0 && (
            <section className="px-4 sm:px-6 lg:px-8 pb-12">
              <div className="max-w-4xl mx-auto">
                <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.03]">
                  <h2 className="text-xl md:text-2xl font-light text-white mb-6">
                    {service.name} Pricing
                  </h2>
                  <div className="space-y-3">
                    {service.pricing.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0"
                      >
                        <span className="text-white/70">{item.label}</span>
                        <span className="text-white font-medium ml-4 text-right">{item.range}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-white/50 text-sm mt-4">
                    Prices are estimates for the St. Augustine and Northeast Florida area. Contact us for a free, no-obligation quote for your specific project.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* FAQ Section */}
          <section className="px-4 sm:px-6 lg:px-8 pb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-light text-white mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {service.faqs.map((faq, i) => (
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
                  {service.ctaText}
                </h3>
                <p className="text-white/70 mb-8 max-w-xl mx-auto">
                  Fast, professional {service.name.toLowerCase()} in St. Augustine and Northeast Florida. No obligation.
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

          {/* Other Services */}
          <section className="px-4 sm:px-6 lg:px-8 pb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl md:text-2xl font-light text-white mb-6 text-center">
                Our Other Services
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherServices.map((s) => (
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

          <Footer />
          <QuoteFormDialog open={isQuoteFormOpen} onOpenChange={setIsQuoteFormOpen} />
        </div>
      </main>
    </div>
  )
}
