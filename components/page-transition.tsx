"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    console.log("[v0] Page changed to:", pathname)
    const timerStart = setTimeout(() => setIsAnimating(true), 0)
    const timerEnd = setTimeout(() => setIsAnimating(false), 50)
    return () => {
      clearTimeout(timerStart)
      clearTimeout(timerEnd)
    }
  }, [pathname])

  return (
    <div className={`transition-opacity duration-500 ease-in-out ${isAnimating ? "opacity-0" : "opacity-100"}`}>
      {children}
    </div>
  )
}
