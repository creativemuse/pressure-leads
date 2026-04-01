"use client"

import { useState } from "react"

import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { HeroSection } from "@/components/hero-section"
import { BeforeAfterGallerySection } from "@/components/before-after-gallery-section"
import { ProblemSolutionSection } from "@/components/problem-solution-section"
import Aurora from "@/components/Aurora"
import { FeaturesSection } from "@/components/features-section"
import { AITeamSection } from "@/components/ai-team-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { QuoteFormDialog } from "@/components/quote-form-dialog"

export function HomePageContent() {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <main className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 w-full h-full">
          <Aurora colorStops={["#475569", "#64748b", "#475569"]} amplitude={1.2} blend={0.6} speed={0.8} />
        </div>
        <div className="relative z-10">
          <GlassmorphismNav onQuoteClick={() => setIsQuoteFormOpen(true)} />
          <HeroSection onQuoteClick={() => setIsQuoteFormOpen(true)} />
          <BeforeAfterGallerySection />
          <ProblemSolutionSection />
          <FeaturesSection />
          <AITeamSection />
          <TestimonialsSection />
          <CTASection onQuoteClick={() => setIsQuoteFormOpen(true)} />
          <Footer />
          <QuoteFormDialog open={isQuoteFormOpen} onOpenChange={setIsQuoteFormOpen} />
        </div>
      </main>
    </div>
  )
}
