"use client"

import Script from "next/script"
import { useEffect, useState } from "react"

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"

declare global {
  interface Window {
    Tally?: {
      loadEmbeds?: () => void
    }
  }
}

const TALLY_FORM_URL = "https://tally.so/r/eqEgDl?formEventsForwarding=1"

type QuoteFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuoteFormDialog({ open, onOpenChange }: QuoteFormDialogProps) {
  const [formSrc] = useState(() => {
    if (typeof window === "undefined") return TALLY_FORM_URL

    const url = new URL(TALLY_FORM_URL)
    const pageParams = new URLSearchParams(window.location.search)
    pageParams.forEach((value, key) => {
      if (!url.searchParams.has(key)) {
        url.searchParams.set(key, value)
      }
    })

    if (!url.searchParams.has("originPage")) {
      url.searchParams.set("originPage", window.location.pathname)
    }

    return url.toString()
  })

  useEffect(() => {
    if (!open) return
    window.Tally?.loadEmbeds?.()
  }, [open])

  return (
    <>
      <Script src="https://tally.so/widgets/embed.js" strategy="afterInteractive" />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[min(96vw,980px)] h-[min(90vh,920px)] p-0 gap-0 border-white/15 bg-black/95 overflow-hidden">
          <DialogTitle className="sr-only">Pressure Washing Interest Form</DialogTitle>
          <DialogDescription className="sr-only">
            Fill out this form to get your free pressure washing quote.
          </DialogDescription>
          <iframe
            data-tally-src={formSrc}
            src={formSrc}
            width="100%"
            height="100%"
            frameBorder={0}
            marginHeight={0}
            marginWidth={0}
            title="Pressure Washing Interest Form"
            className="w-full h-full border-0"
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
