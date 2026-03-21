"use client"
import type React from "react"
import type { ComponentProps, ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { FacebookIcon, Instagram, LinkedinIcon, Youtube } from "lucide-react"
import Image from "next/image"

interface FooterLink {
  title: string
  /** Omit for non-interactive rows (e.g. hours). */
  href?: string
  icon?: React.ComponentType<{ className?: string }>
}

interface FooterSection {
  label: string
  links: FooterLink[]
}

const footerLinks: FooterSection[] = [
  {
    label: "Services",
    links: [
      { title: "House Washing", href: "/#features" },
      { title: "Driveway Cleaning", href: "/#features" },
      { title: "Roof Cleaning", href: "/#features" },
      { title: "Patio & Deck Cleaning", href: "/#features" },
    ],
  },
  {
    label: "Company",
    links: [
      { title: "About", href: "/#about" },
      { title: "Testimonials", href: "/#testimonials" },
      
    ],
  },
  {
    label: "Contact",
    links: [
      {
        title: "Service areas (St. Augustine, St. Johns, & more)",
        href: "/#contact",
      },
      // {
      //   title: "+1 (888) 859-9912",
      //   href: "tel:+18888599912",
      // },
      // {
      //   title: "hello@pressureleads.com",
      //   href: "mailto:hello@pressureleads.com",
      // },
      { title: "Sun–Sat · 24 hours" },
    ],
  },
  {
    label: "Social",
    links: [
      { title: "Facebook", href: "#", icon: FacebookIcon },
      { title: "Instagram", href: "#", icon: Instagram },
      { title: "Youtube", href: "#", icon: Youtube },
      { title: "LinkedIn", href: "#", icon: LinkedinIcon },
    ],
  },
]

export function Footer() {
  return (
    <footer className="md:rounded-t-6xl relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)] px-6 py-12 lg:py-16">
      <div className="bg-foreground/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

      <div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
        <AnimatedContainer className="space-y-4">
          <Image
            src="/Pressurewash_logo.svg"
            alt="St. Augustine Pressure Washing Pros"
            width={240}
            height={240}
            className="h-28 w-auto max-w-[min(100%,320px)] object-contain object-left md:h-36"
          />
          <div className="text-muted-foreground mt-8 text-sm md:mt-0 md:block hidden">
            <p>© {new Date().getFullYear()} staugustinepressurewashingpros.com. All rights reserved.</p>
          </div>
        </AnimatedContainer>

        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
          {footerLinks.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
              <div className="mb-10 md:mb-0">
                <h3 className="text-xs">{section.label}</h3>
                <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      {link.href ? (
                        <a
                          href={link.href}
                          className="hover:text-foreground inline-flex items-center transition-all duration-300"
                        >
                          {link.icon && <link.icon className="me-1 size-4" />}
                          {link.title}
                        </a>
                      ) : (
                        <span className="inline-flex items-center">{link.title}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>

      <div className="md:hidden mt-8 text-center space-y-2">
        <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} staugustinepressurewashingpros.com. All rights reserved.</p>
        <p className="text-muted-foreground text-xs">Serving St. Augustine & surrounding areas.</p>
      </div>

      <div className="hidden md:block mt-8 pt-6 border-t border-foreground/10 w-full">
        <p className="text-muted-foreground text-xs text-center">Serving St. Augustine & surrounding areas.</p>
      </div>
    </footer>
  )
}

type ViewAnimationProps = {
  delay?: number
  className?: ComponentProps<typeof motion.div>["className"]
  children: ReactNode
}

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return children
  }

  return (
    <motion.div
      initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
