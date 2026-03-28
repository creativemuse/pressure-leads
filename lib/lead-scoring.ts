import type { PressureWashingLeadExtracted } from "@/lib/tally-webhook/pressure-washing-lead-fields"

/**
 * Scores a lead 1-10 based on job size, urgency, service type, and property type.
 * Higher score = higher value / priority for the contractor.
 */
export function scoreLead(lead: PressureWashingLeadExtracted): number {
  let score = 5 // baseline

  // Job size (+/-2)
  const jobSize = lead.job_size?.toLowerCase() ?? ""
  if (jobSize.includes("large") || jobSize.includes("whole") || jobSize.includes("full")) {
    score += 2
  } else if (jobSize.includes("medium") || jobSize.includes("multiple")) {
    score += 1
  } else if (jobSize.includes("small") || jobSize.includes("single")) {
    score -= 1
  }

  // Urgency / timing (+/-2)
  const timing = lead.service_timing?.toLowerCase() ?? ""
  if (timing.includes("asap") || timing.includes("emergency") || timing.includes("today") || timing.includes("urgent")) {
    score += 2
  } else if (timing.includes("this week") || timing.includes("soon") || timing.includes("next few days")) {
    score += 1
  } else if (timing.includes("no rush") || timing.includes("flexible") || timing.includes("just browsing")) {
    score -= 1
  }

  // Service type (+/-1) — commercial/multi-service jobs score higher
  const services = lead.services_needed?.toLowerCase() ?? ""
  if (services.includes("commercial") || services.includes("fleet") || services.includes("roof")) {
    score += 1
  }
  // Multiple services requested
  if (services.includes(',')) {
    score += 1
  }

  // Property type (+/-1)
  const property = lead.property_type?.toLowerCase() ?? ""
  if (property.includes("commercial") || property.includes("business") || property.includes("hoa")) {
    score += 1
  } else if (property.includes("apartment") || property.includes("condo")) {
    score -= 1
  }

  // Clamp to 1-10
  return Math.max(1, Math.min(10, score))
}

export function scoreLabel(score: number): string {
  if (score >= 8) return "Hot"
  if (score >= 5) return "Warm"
  return "Cool"
}
