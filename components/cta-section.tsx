"use client"

import { useEffect, useRef } from "react"
import { ArrowRight } from "lucide-react"

type CTASectionProps = {
  onQuoteClick: () => void
}

export function CTASection({ onQuoteClick }: CTASectionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll(".fade-in-element")
            elements.forEach((element, index) => {
              setTimeout(() => {
                element.classList.add("animate-fade-in-up")
              }, index * 200)
            })
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="contact" ref={sectionRef} className="relative py-8 px-4 sm:px-6 lg:px-8 mb-32">
      <div className="relative max-w-4xl mx-auto">
        <div className="fade-in-element opacity-0 translate-y-8 transition-all duration-1000 ease-out text-center p-8 md:p-10 rounded-3xl border border-white/20 bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/15%),theme(backgroundColor.white/5%))]">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-light text-white mb-6 text-balance leading-tight">
          Ready to Make Your Home Look {" "}
            <span className="font-medium italic bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
            Like New Again
            </span>
            ?
          </h3>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            Fast, affordable pressure washing in St. Augustine. Get your free quote today.
          </p>

          <div className="flex flex-col items-center justify-center gap-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button
                onClick={onQuoteClick}
                className="group inline-flex items-center gap-3 px-8 py-4 md:px-12 md:py-6 bg-gradient-to-r from-white to-slate-100 text-slate-900 rounded-full font-semibold text-base md:text-lg hover:from-slate-50 hover:to-slate-200 transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                Get My Free Quote
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>

            <p className="text-sm md:text-base text-white/85">
              Or call now:{" "}
              <a
                href="tel:+19045551234"
                className="font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white transition-colors"
              >
                (904) XXX-XXXX
              </a>
            </p>

            <div className="w-full max-w-md mx-auto pt-4 border-t border-white/15 space-y-2.5 text-center">
              <p className="text-sm text-white/90 font-medium tracking-wide">
                ⭐️⭐️⭐️⭐️⭐️ Rated Local Service
              </p>
              <ul className="text-sm text-white/65 space-y-1 list-none">
                <li>Same-week availability</li>
                <li>No obligation quotes</li>
              </ul>
            </div>

            <p className="text-sm text-amber-200/90 font-medium">
              Limited spots available this week
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
