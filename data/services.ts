export interface PricingItem {
  label: string
  range: string
}

export interface ServiceData {
  slug: string
  name: string
  title: string
  metaDescription: string
  heroImage: string
  heroImageAlt: string
  h1: string
  intro: string
  sections: { heading: string; body: string }[]
  faqs: { question: string; answer: string }[]
  ctaText: string
  pricing?: PricingItem[]
}

export const services: ServiceData[] = [
  {
    slug: "driveway-cleaning",
    name: "Driveway Cleaning",
    title: "Driveway Pressure Washing in St. Augustine | St. Augustine Pressure Washing Pros",
    metaDescription:
      "Professional driveway pressure washing in St. Augustine, FL. Remove oil stains, dirt, and algae buildup. Restore your driveway to like-new condition. Free quotes.",
    heroImage: "/images/before_after/driveway.jpg",
    heroImageAlt: "Before and after driveway pressure washing in St. Augustine showing stain removal",
    h1: "Professional Driveway Pressure Washing in St. Augustine",
    intro:
      "Your driveway is the first thing visitors see when they arrive at your home. Over time, Florida's heat and humidity cause oil stains, tire marks, algae, and ground-in dirt to build up on concrete, pavers, and brick surfaces. Our professional driveway pressure washing service restores your driveway to like-new condition, boosting your curb appeal and protecting your investment.",
    sections: [
      {
        heading: "Why Does My Driveway Get So Dirty in Florida?",
        body: "St. Augustine's subtropical climate accelerates the growth of mold, mildew, and algae on concrete and paver surfaces. These organisms don't just look unsightly \u2014 they create slippery conditions that can be a safety hazard for your family and guests. Oil and automotive fluid stains seep into porous concrete, becoming harder to remove the longer they sit. Professional pressure washing uses commercial-grade equipment and the right pressure settings to lift stains without damaging your driveway surface. We adjust our approach based on your driveway material \u2014 whether it's stamped concrete, exposed aggregate, brick pavers, or standard concrete \u2014 to deliver the best results safely.",
      },
      {
        heading: "How Does Professional Driveway Pressure Washing Work?",
        body: "We start with a thorough inspection to identify stain types and surface material. Next, we pre-treat oil stains and organic growth with eco-friendly cleaning solutions. Our commercial-grade pressure washers deliver precisely calibrated water pressure to strip away years of buildup without etching or damaging the surface. We pay special attention to expansion joints and edges where dirt accumulates. The result is a uniformly clean surface that looks freshly poured. For paver driveways, we can also re-sand joints after cleaning to prevent weed growth and maintain structural integrity.",
      },
      {
        heading: "Does Pressure Washing Extend My Driveway's Lifespan?",
        body: "A clean driveway does more than improve your home's appearance. Regular pressure washing prevents the long-term damage that algae and embedded dirt cause to concrete surfaces. Algae roots can penetrate porous materials, leading to cracks and spalling over time. By scheduling regular cleanings, you extend the lifespan of your driveway and avoid costly repairs or replacement. Most homeowners in St. Augustine benefit from a professional driveway cleaning once or twice a year to keep their surfaces in top condition.",
      },
    ],
    faqs: [
      {
        question: "How often should I have my driveway pressure washed?",
        answer:
          "In Northeast Florida, we recommend having your driveway professionally cleaned every 6 to 12 months. The warm, humid climate promotes algae and mold growth faster than drier regions.",
      },
      {
        question: "Will pressure washing damage my driveway?",
        answer:
          "No. We use the correct pressure settings and nozzle tips for each surface type. Concrete, pavers, and brick each require different approaches, and our technicians are trained to clean effectively without causing damage.",
      },
      {
        question: "Can you remove oil stains from my driveway?",
        answer:
          "Yes. We use specialized degreasing agents to pre-treat oil and automotive fluid stains before pressure washing. Most stains are completely removed, though very old or deep stains may lighten significantly.",
      },
      {
        question: "How long does a driveway cleaning take?",
        answer:
          "A standard two-car driveway typically takes 1 to 2 hours. Larger driveways or those with heavy staining may take longer. We'll give you a time estimate with your free quote.",
      },
    ],
    ctaText: "Get a Free Driveway Cleaning Quote",
    pricing: [
      { label: "Most residential driveways", range: "$150–$350" },
    ],
  },
  {
    slug: "house-washing",
    name: "House Washing",
    title: "House Washing Services in St. Augustine | St. Augustine Pressure Washing Pros",
    metaDescription:
      "Professional house washing in St. Augustine, FL. Safe soft washing removes mold, mildew, and grime from siding and exteriors. Free quotes available.",
    heroImage: "/images/before_after/home.jpg",
    heroImageAlt: "Before and after house washing showing clean siding and exterior in St. Augustine",
    h1: "Professional House Washing in St. Augustine",
    intro:
      "Your home's exterior takes a beating from Florida's sun, rain, and humidity year-round. Mold, mildew, pollen, and dirt gradually coat your siding, stucco, and trim, making your home look older than it is. Our professional house washing service uses safe, low-pressure soft washing techniques to restore your home's exterior without risking damage to siding, paint, or landscaping.",
    sections: [
      {
        heading: "What Is Soft Washing and How Is It Different from Pressure Washing?",
        body: "Unlike driveways and concrete, your home's exterior surfaces require a gentler approach. High-pressure washing can force water behind siding, damage paint, and even crack stucco. That's why we use soft washing \u2014 a method that combines low-pressure water with professional-grade cleaning solutions to kill mold, mildew, and algae at the root. The cleaning agents do the heavy lifting, and the low-pressure rinse safely removes all residue. This approach is safe for vinyl siding, Hardie board, stucco, painted wood, brick, and stone exteriors.",
      },
      {
        heading: "What Parts of My House Can Be Soft Washed?",
        body: "Our house washing service covers your entire exterior: all sides of the home from foundation to roofline, soffits and fascia, gutters (exterior), window frames, and trim. We take care to protect your landscaping, outdoor furniture, and light fixtures during the process. Our cleaning solutions are biodegradable and safe for plants and pets once dry. If you have delicate plantings near the foundation, we'll pre-wet them and cover them during treatment.",
      },
      {
        heading: "How Often Should I Have My House Washed in Florida?",
        body: "A professional house wash transforms your home's appearance instantly. Neighbors will ask if you repainted. Beyond aesthetics, removing mold and mildew protects your siding from the long-term damage these organisms cause. Mold can penetrate porous materials and lead to wood rot on trim and fascia boards. Regular house washing is one of the most cost-effective ways to maintain your home's value and avoid expensive repairs. In St. Augustine's coastal environment, we recommend a full house wash at least once a year.",
      },
    ],
    faqs: [
      {
        question: "Is soft washing safe for my siding?",
        answer:
          "Absolutely. Soft washing uses low pressure \u2014 similar to a garden hose \u2014 combined with cleaning solutions that do the work. It's safe for vinyl, Hardie board, stucco, wood, and brick.",
      },
      {
        question: "Will the cleaning products harm my plants?",
        answer:
          "We use biodegradable, plant-safe cleaning solutions. We also pre-wet and protect landscaping near your home's foundation during the wash.",
      },
      {
        question: "How long does a house wash take?",
        answer:
          "Most homes take 2 to 4 hours depending on size and the level of buildup. We'll provide a time estimate when we quote your project.",
      },
      {
        question: "How often should I have my house washed?",
        answer:
          "In Northeast Florida, we recommend an annual house wash. Homes in heavily shaded areas or near the coast may benefit from washing every 8 to 10 months.",
      },
    ],
    ctaText: "Get a Free House Washing Quote",
    pricing: [
      { label: "Most single-family homes", range: "$250–$500" },
    ],
  },
  {
    slug: "roof-soft-wash",
    name: "Roof Soft Wash",
    title: "Roof Soft Washing in St. Augustine | St. Augustine Pressure Washing Pros",
    metaDescription:
      "Professional roof soft washing in St. Augustine, FL. Safely remove black streaks, algae, and moss from shingles and tiles. Extend your roof's lifespan. Free quotes.",
    heroImage: "/images/roof_wash.png",
    heroImageAlt: "Roof soft washing service removing black algae streaks from shingles in St. Augustine",
    h1: "Roof Soft Washing in St. Augustine",
    intro:
      "Those dark streaks running down your roof aren't just dirt \u2014 they're Gloeocapsa magma, a type of algae that feeds on the limestone filler in asphalt shingles. Left untreated, this algae shortens your roof's lifespan and drives up cooling costs by reducing your roof's ability to reflect heat. Our roof soft washing service safely eliminates algae, moss, and lichen without the damaging high pressure that voids manufacturer warranties.",
    sections: [
      {
        heading: "What Causes Black Streaks on My Roof?",
        body: "A dirty roof isn't just an eyesore \u2014 it's actively degrading. Algae and moss retain moisture against your shingles, accelerating granule loss and shortening roof life by years. Dark streaks absorb more heat, which can increase your attic temperature and raise your cooling bills during Florida's long summers. Many homeowner associations in St. Augustine require roofs to be kept clean, and a stained roof can trigger violation notices. Roof soft washing restores your roof's appearance and performance, protecting one of your home's most expensive components.",
      },
      {
        heading: "How Does Roof Soft Washing Work Without Damaging Shingles?",
        body: "We never use high pressure on roofs. Our soft wash process applies a specialized cleaning solution at low pressure that kills algae, moss, and lichen down to the root. The solution is applied evenly across the roof surface and allowed to dwell before a gentle rinse. This method is approved by shingle manufacturers including GAF, CertainTeed, and Owens Corning \u2014 unlike pressure washing, which can void your warranty by stripping protective granules. We clean asphalt shingle, tile, metal, and flat roofs, adjusting our approach and solutions for each material.",
      },
      {
        heading: "How Long Does a Roof Stay Clean After Soft Washing?",
        body: "Our roof soft wash doesn't just clean the surface \u2014 it kills the organisms causing the stains. This means your roof stays cleaner longer compared to methods that only remove surface discoloration. Most roofs stay visibly clean for 2 to 3 years after our treatment. We also offer maintenance plans for homeowners who want to keep their roof in peak condition year-round. A clean roof enhances curb appeal, maintains property value, and ensures your roof performs as designed for its full expected lifespan.",
      },
    ],
    faqs: [
      {
        question: "Will pressure washing damage my roof?",
        answer:
          "Yes, which is why we never use high pressure on roofs. High-pressure washing strips the protective granules from shingles and can crack tiles. Our soft wash method is manufacturer-approved and safe for all roof types.",
      },
      {
        question: "What are the black streaks on my roof?",
        answer:
          "Those streaks are caused by Gloeocapsa magma, a blue-green algae that feeds on limestone in shingles. It's extremely common in Florida's humid climate and spreads from roof to roof via airborne spores.",
      },
      {
        question: "How long will my roof stay clean after soft washing?",
        answer:
          "Most roofs stay visibly clean for 2 to 3 years after treatment. Results vary based on shade, humidity, and proximity to trees.",
      },
      {
        question: "Is the soft wash solution safe for my gutters and landscaping?",
        answer:
          "Yes. We protect your landscaping during application and use solutions that break down safely. Your gutters are rinsed clean as part of the process.",
      },
    ],
    ctaText: "Get a Free Roof Cleaning Quote",
    pricing: [
      { label: "Roof replacement (avoided with cleaning)", range: "$8,000–$20,000+" },
    ],
  },
  {
    slug: "patio-deck-cleaning",
    name: "Patio & Deck Cleaning",
    title: "Patio & Deck Pressure Washing in St. Augustine | St. Augustine Pressure Washing Pros",
    metaDescription:
      "Professional patio and deck pressure washing in St. Augustine, FL. Restore wood, composite, and concrete outdoor spaces. Safe cleaning methods. Free quotes.",
    heroImage: "/images/before_after/deck.jpg",
    heroImageAlt: "Before and after deck pressure washing showing restored wood surface in St. Augustine",
    h1: "Patio & Deck Pressure Washing in St. Augustine",
    intro:
      "Your patio and deck are where you relax, entertain, and enjoy Florida's outdoor lifestyle. But constant exposure to sun, rain, humidity, and foot traffic takes its toll. Algae makes surfaces dangerously slippery. Mold and mildew discolor wood and composite materials. Ground-in dirt dulls the finish of concrete and pavers. Our professional cleaning service restores your outdoor living spaces so they look and feel like new again.",
    sections: [
      {
        heading: "Can You Pressure Wash a Wood Deck Without Damaging It?",
        body: "Patios and decks come in many materials, and each requires a different cleaning approach. We adjust pressure, nozzle selection, and cleaning solutions based on your surface. Wood decks get a lower-pressure wash with wood-safe cleaners that brighten without raising the grain. Composite decking is cleaned with manufacturer-approved methods. Concrete patios and pool decks handle higher pressure for deep cleaning. Paver patios are cleaned and optionally re-sanded. Whatever your outdoor surface, we have the right technique to clean it safely and effectively.",
      },
      {
        heading: "What Difference Does a Clean Patio or Deck Make?",
        body: "A clean deck or patio completely transforms your outdoor area. Grayed, weathered wood regains its natural warm tone. Concrete surfaces go from dull and stained to bright and uniform. Pavers reveal their original color and pattern. Beyond appearance, cleaning removes the slippery algae and mold that make outdoor surfaces a slip hazard \u2014 especially around pool decks. If you're planning to stain or seal your deck, professional pressure washing is the essential first step for proper adhesion.",
      },
      {
        heading: "How Often Should I Clean My Deck or Patio in Northeast Florida?",
        body: "St. Augustine's climate means your outdoor surfaces need regular attention. We recommend professional cleaning every 6 to 12 months for most decks and patios. Shaded areas and surfaces near pools or sprinklers may need more frequent cleaning. Between professional washes, you can keep your surfaces looking good by sweeping regularly, clearing debris from between deck boards, and addressing spills promptly. After cleaning, consider having your wood deck sealed or stained to extend the time between professional cleanings.",
      },
    ],
    faqs: [
      {
        question: "Can you pressure wash a wood deck without damaging it?",
        answer:
          "Yes. We use lower pressure settings and fan-tip nozzles designed for wood surfaces. Combined with wood-safe cleaning solutions, this approach cleans effectively without raising the grain, splintering, or causing damage.",
      },
      {
        question: "Should I seal my deck after pressure washing?",
        answer:
          "We recommend it. Pressure washing opens the wood pores, making it the ideal time to apply a sealant or stain. This protects the wood from UV damage and moisture, extending the life of your deck.",
      },
      {
        question: "Do you clean pool decks?",
        answer:
          "Absolutely. Pool decks accumulate algae quickly due to constant moisture. We clean concrete, paver, and travertine pool decks, removing slippery buildup to improve safety and appearance.",
      },
      {
        question: "How long does patio or deck cleaning take?",
        answer:
          "Most standard patios and decks take 1 to 3 hours. Larger areas or heavily soiled surfaces may take longer. We'll provide a time estimate with your quote.",
      },
    ],
    ctaText: "Get a Free Patio & Deck Cleaning Quote",
    pricing: [
      { label: "Wood deck cleaning", range: "$1.00–$2.50 per sq ft" },
      { label: "Concrete patio cleaning", range: "$0.75–$1.50 per sq ft" },
      { label: "Paver cleaning and re-sanding", range: "$1.50–$3.00 per sq ft" },
      { label: "Most patios and decks", range: "$200–$600" },
    ],
  },
  {
    slug: "fence-cleaning",
    name: "Fence Cleaning",
    title: "Fence Pressure Washing in St. Augustine | St. Augustine Pressure Washing Pros",
    metaDescription:
      "Professional fence cleaning in St. Augustine, FL. Restore wood and vinyl fences to like-new condition. Remove mold, mildew, and weathering. Free quotes.",
    heroImage: "/images/before_after/fence.jpg",
    heroImageAlt: "Before and after fence pressure washing showing restored wood fence in St. Augustine",
    h1: "Professional Fence Cleaning in St. Augustine",
    intro:
      "Your fence frames your property and contributes to its overall curb appeal. Over time, Florida's weather turns white vinyl fences green with algae and grays out natural wood. Mold and mildew coat fence boards, and dirt splashes up from the ground during rain. Our professional fence cleaning service restores both wood and vinyl fences to their original appearance, making your entire property look well-maintained.",
    sections: [
      {
        heading: "Why Does My Wood Fence Turn Gray and How Can Pressure Washing Fix It?",
        body: "Wood fences in St. Augustine face constant assault from moisture, UV rays, and organic growth. Cedar, pine, and pressure-treated wood all gray and weather over time. Mold and mildew penetrate the wood grain, creating dark stains that garden hoses can't touch. Our cleaning process uses wood-appropriate pressure and cleaning solutions to lift embedded dirt and kill organic growth without damaging the wood fibers. After cleaning, your fence's natural color returns. This is also the ideal time to apply a wood stain or sealant for long-lasting protection.",
      },
      {
        heading: "How Do You Remove Green Algae from a Vinyl Fence?",
        body: "Vinyl fences are marketed as low-maintenance, but in Florida's climate, they develop green algae, dark mold stains, and a dingy film that makes them look neglected. Our cleaning process uses the right combination of pressure and cleaning agents to restore vinyl to its original bright white finish. We clean all fence styles including privacy, picket, semi-privacy, and ranch rail. Our process won't warp or crack vinyl panels \u2014 just remove the buildup that's hiding their clean appearance.",
      },
      {
        heading: "Should I Clean My Fence at the Same Time as My House or Driveway?",
        body: "A clean fence ties your entire property together. When your driveway, house, and fence are all clean, the effect is dramatically better than cleaning just one element. Many of our customers combine fence cleaning with driveway or house washing for a complete property refresh. We offer package pricing for multi-service cleanings. Whether you're preparing your home for sale, hosting an event, or simply maintaining your property's appearance, a professional fence cleaning delivers immediate, visible results.",
      },
    ],
    faqs: [
      {
        question: "Can you clean both sides of my fence?",
        answer:
          "Yes, we can clean both sides. If the other side faces a neighbor's property, we recommend checking with them first. Many neighbors are happy to have both sides cleaned.",
      },
      {
        question: "Will pressure washing damage my wood fence?",
        answer:
          "Not with our approach. We use lower pressure settings appropriate for wood and fan-tip nozzles that clean without gouging or splintering the surface.",
      },
      {
        question: "How do I keep my vinyl fence clean longer?",
        answer:
          "After professional cleaning, periodic rinsing with a garden hose helps. Trimming vegetation away from the fence reduces shade and moisture, slowing algae regrowth. We recommend professional cleaning annually.",
      },
      {
        question: "Do you clean aluminum or chain-link fences?",
        answer:
          "Yes. While wood and vinyl are our most common fence cleaning requests, we also clean aluminum, wrought iron, and chain-link fences.",
      },
    ],
    ctaText: "Get a Free Fence Cleaning Quote",
    pricing: [
      { label: "Wood fence cleaning", range: "$1.00–$2.00 per linear ft" },
      { label: "Vinyl fence cleaning", range: "$1.00–$1.75 per linear ft" },
      { label: "Aluminum fence cleaning", range: "$0.75–$1.50 per linear ft" },
      { label: "Most fence jobs", range: "$200–$500" },
    ],
  },
  {
    slug: "commercial-pressure-washing",
    name: "Commercial Pressure Washing",
    title: "Commercial Pressure Washing in St. Augustine | St. Augustine Pressure Washing Pros",
    metaDescription:
      "Professional commercial pressure washing in St. Augustine, FL. Storefronts, sidewalks, parking lots, and building exteriors. Maintain your business image. Free quotes.",
    heroImage: "/images/pressure_wash_business.png",
    heroImageAlt: "Commercial pressure washing service cleaning a business storefront in St. Augustine",
    h1: "Commercial Pressure Washing in St. Augustine",
    intro:
      "First impressions matter in business. Customers notice dirty sidewalks, stained parking lots, and grimy building exteriors \u2014 and they form opinions before they walk through your door. Our commercial pressure washing service keeps your business property looking professional, welcoming, and well-maintained. From storefronts and restaurants to office buildings and HOA common areas, we help businesses across St. Augustine put their best face forward.",
    sections: [
      {
        heading: "What Commercial Surfaces Can Be Pressure Washed?",
        body: "We clean all types of commercial surfaces: building exteriors and facades, sidewalks and walkways, parking lots and garages, dumpster pads, drive-throughs, loading docks, awnings and canopies, and concrete common areas. Our commercial-grade equipment handles large surface areas efficiently, minimizing disruption to your business operations. We work with restaurants, retail stores, office complexes, medical facilities, churches, HOA communities, and industrial properties throughout Northeast Florida.",
      },
      {
        heading: "Can Commercial Pressure Washing Be Done After Business Hours?",
        body: "We understand that business operations can't stop for cleaning. That's why we offer early morning, evening, and weekend scheduling to work around your hours. For restaurants and food service businesses, we can clean before you open so your entrance and patio are spotless when customers arrive. Retail locations can be serviced during off-hours. We also offer recurring maintenance contracts \u2014 weekly, bi-weekly, monthly, or quarterly \u2014 so your property stays consistently clean without you having to remember to schedule each cleaning.",
      },
      {
        heading: "Does Pressure Washing Reduce Slip-and-Fall Liability for Businesses?",
        body: "Dirty, slippery walkways and parking areas are liability risks. Algae and mold growth on concrete surfaces create slip hazards that can lead to customer injuries and costly claims. Many municipalities and HOAs have property maintenance requirements that include exterior cleanliness. Regular commercial pressure washing reduces your liability exposure, helps you stay compliant with local codes, and demonstrates that your business takes property maintenance seriously. We carry full commercial insurance and can provide certificates of insurance on request.",
      },
    ],
    faqs: [
      {
        question: "Can you clean during off-hours so we don't disrupt business?",
        answer:
          "Yes. We offer flexible scheduling including early mornings, evenings, and weekends. We work around your business hours to minimize disruption.",
      },
      {
        question: "Do you offer recurring maintenance contracts?",
        answer:
          "Yes. We offer weekly, bi-weekly, monthly, and quarterly maintenance plans. Recurring contracts include priority scheduling and discounted rates.",
      },
      {
        question: "Can you clean grease stains from restaurant areas?",
        answer:
          "Yes. We use commercial degreasers and hot water pressure washing to remove grease from dumpster pads, drive-throughs, and kitchen exit areas.",
      },
      {
        question: "Do you carry commercial insurance?",
        answer:
          "Yes. We carry full commercial general liability insurance and can provide certificates of insurance for property managers and business owners upon request.",
      },
    ],
    ctaText: "Get a Free Commercial Cleaning Quote",
    pricing: [
      { label: "Sidewalk and walkway cleaning", range: "$0.15–$0.35 per sq ft" },
      { label: "Building exterior soft wash", range: "$0.20–$0.50 per sq ft" },
      { label: "Parking lot/garage cleaning", range: "$0.10–$0.25 per sq ft" },
      { label: "Dumpster pad cleaning", range: "$75–$200 per pad" },
    ],
  },
]

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return services.find((s) => s.slug === slug)
}

export function getAllServiceSlugs(): string[] {
  return services.map((s) => s.slug)
}
