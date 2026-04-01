export interface LocationData {
  slug: string
  city: string
  title: string
  metaDescription: string
  heroImage: string
  heroImageAlt: string
  h1: string
  intro: string
  sections: { heading: string; body: string }[]
  landmarks: string[]
  serviceArea: string
  faqs: { question: string; answer: string }[]
}

export const locations: LocationData[] = [
  {
    slug: "jacksonville",
    city: "Jacksonville",
    title: "Pressure Washing in Jacksonville, FL | St. Augustine Pressure Washing Pros",
    metaDescription:
      "Professional pressure washing in Jacksonville, FL. House washing, driveway cleaning, roof soft wash, and more. Trusted local pros. Free quotes.",
    heroImage: "/images/before_after/home.jpg",
    heroImageAlt: "Professional pressure washing service in Jacksonville, Florida",
    h1: "Pressure Washing Services in Jacksonville, FL",
    intro:
      "Jacksonville homeowners and businesses trust St. Augustine Pressure Washing Pros to keep their properties looking spotless. As Northeast Florida's largest city, Jacksonville's warm, humid climate creates the perfect conditions for mold, mildew, and algae to thrive on every exterior surface. From Riverside to the Beaches, San Marco to Mandarin, we deliver professional pressure washing that restores your property's appearance and protects it from long-term damage.",
    sections: [
      {
        heading: "Full-Service Pressure Washing Across Jacksonville",
        body: "We provide the complete range of exterior cleaning services throughout the Jacksonville metro area. Our team handles driveway and sidewalk cleaning, house soft washing, roof cleaning, patio and deck restoration, fence washing, and commercial property maintenance. Whether you own a historic home in Avondale, a newer build in Nocatee, or a commercial property in the Southside business district, our equipment and expertise match the job. We serve all Jacksonville neighborhoods including Arlington, Baymeadows, Southside, Mandarin, San Marco, Riverside, Avondale, Ortega, and more.",
      },
      {
        heading: "Why Jacksonville Properties Need Regular Cleaning",
        body: "Jacksonville sits at the intersection of river and ocean, creating a uniquely challenging environment for exterior surfaces. Salt air from the coast, moisture from the St. Johns River, and Florida's subtropical humidity combine to accelerate organic growth on every surface. Concrete driveways develop dark algae stains. Roofs streak with black algae within a few years of installation. Siding turns green on the north-facing sides where shade lingers. These aren't just cosmetic issues \u2014 they degrade materials, create slip hazards, and lower property values. Regular professional cleaning is the most cost-effective way to protect your investment in one of Florida's most competitive real estate markets.",
      },
      {
        heading: "Trusted by Jacksonville Homeowners",
        body: "Our team has cleaned hundreds of residential and commercial properties throughout the Jacksonville area. We arrive on time, respect your property, and deliver results that speak for themselves. We're fully insured, use professional-grade equipment, and choose cleaning solutions that are effective yet safe for your landscaping and pets. Every job includes a detailed quote upfront with no hidden fees. We stand behind our work and want you to be completely satisfied with the results.",
      },
    ],
    landmarks: [
      "St. Johns River",
      "Jacksonville Beach",
      "San Marco Square",
      "Riverside Arts Market",
      "The Cummer Museum",
      "Memorial Park",
    ],
    serviceArea:
      "We serve all Jacksonville ZIP codes including 32099, 32201-32212, 32214-32256, and surrounding areas. From Downtown to the Beaches, Northside to Mandarin, we cover the entire Jacksonville metro.",
    faqs: [
      {
        question: "Do you serve all of Jacksonville?",
        answer:
          "Yes. We serve the entire Jacksonville metro area including Arlington, Baymeadows, Southside, Mandarin, San Marco, Riverside, Avondale, Ortega, Northside, and all surrounding neighborhoods.",
      },
      {
        question: "How quickly can you schedule a cleaning in Jacksonville?",
        answer:
          "We typically schedule Jacksonville jobs within 3 to 7 days. For urgent requests, same-week availability is often possible.",
      },
      {
        question: "Do you charge extra for travel to Jacksonville from St. Augustine?",
        answer:
          "No. Jacksonville is within our standard service area. There are no additional travel fees for any Jacksonville address.",
      },
    ],
  },
  {
    slug: "jacksonville-beach",
    city: "Jacksonville Beach",
    title: "Pressure Washing in Jacksonville Beach, FL | St. Augustine Pressure Washing Pros",
    metaDescription:
      "Professional pressure washing in Jacksonville Beach, FL. Salt air and sand removal, house washing, driveway cleaning. Coastal property experts. Free quotes.",
    heroImage: "/images/before_after/home.png",
    heroImageAlt: "Pressure washing service for coastal property in Jacksonville Beach, Florida",
    h1: "Pressure Washing Services in Jacksonville Beach, FL",
    intro:
      "Living near the ocean in Jacksonville Beach comes with amazing views and a laid-back lifestyle \u2014 but it also means your property takes a constant beating from salt air, blowing sand, and coastal humidity. These elements accelerate wear on every exterior surface, from siding and stucco to driveways and pool decks. St. Augustine Pressure Washing Pros specializes in cleaning coastal properties, using techniques that address the unique challenges of beachside living.",
    sections: [
      {
        heading: "Coastal Property Cleaning Experts",
        body: "Salt air doesn't just corrode metal \u2014 it coats every exterior surface with a film that attracts dirt and promotes organic growth. In Jacksonville Beach, homes and businesses deal with faster algae development, salt residue buildup, and sand that embeds in porous surfaces. Our cleaning process addresses these coastal-specific challenges. We remove salt deposits, embedded sand, and the accelerated mold and mildew growth that comes with living steps from the Atlantic. Our team understands the materials common in beach construction \u2014 stucco, Hardie board, concrete block, and tile \u2014 and uses the right approach for each.",
      },
      {
        heading: "Services for Jax Beach Properties",
        body: "We offer every exterior cleaning service Jacksonville Beach homeowners need: house soft washing to remove salt film and organic growth, driveway and walkway cleaning, pool deck and patio restoration, fence cleaning, roof soft wash, and exterior surface sealing. Beach homes often have outdoor showers, decks, and entertainment areas that need regular attention. We also clean commercial properties along Beach Boulevard and the Town Center area. Whether your home is a beach bungalow on 1st Street or a larger property in Marsh Landing, we tailor our approach to your specific surfaces and conditions.",
      },
      {
        heading: "Protecting Your Beachside Investment",
        body: "Jacksonville Beach real estate is premium property. Maintaining your home's exterior isn't optional \u2014 it's essential for protecting your investment. Salt air damage progresses faster than most homeowners realize. What starts as a light film becomes embedded discoloration, and eventually leads to material degradation if left unaddressed. We recommend coastal properties be professionally cleaned every 6 to 9 months to stay ahead of the accelerated wear. Our customers who maintain a regular cleaning schedule find their homes look better, last longer, and hold higher property values than those that wait for visible problems before cleaning.",
      },
    ],
    landmarks: [
      "Jacksonville Beach Pier",
      "Beaches Town Center",
      "Oceanfront Park",
      "Adventure Landing",
      "South Beach Park",
    ],
    serviceArea:
      "We serve all of Jacksonville Beach from the oceanfront to the Intracoastal Waterway, including Neptune Beach and Atlantic Beach.",
    faqs: [
      {
        question: "How often should beachfront properties be cleaned?",
        answer:
          "We recommend every 6 to 9 months for properties near the ocean. Salt air and humidity accelerate buildup faster than inland areas.",
      },
      {
        question: "Can you remove salt air buildup from stucco?",
        answer:
          "Yes. Our soft washing process effectively removes salt deposits, algae, and grime from stucco without damaging the surface.",
      },
      {
        question: "Do you clean outdoor showers and pool areas?",
        answer:
          "Absolutely. Pool decks, outdoor showers, and entertainment areas are common cleaning requests in Jacksonville Beach.",
      },
    ],
  },
  {
    slug: "ponte-vedra",
    city: "Ponte Vedra",
    title: "Pressure Washing in Ponte Vedra, FL | St. Augustine Pressure Washing Pros",
    metaDescription:
      "Professional pressure washing in Ponte Vedra, FL. Premium property care for Ponte Vedra Beach, Nocatee, and TPC homes. Free quotes available.",
    heroImage: "/images/before_after/large_driveway.jpg",
    heroImageAlt: "Premium pressure washing service for Ponte Vedra estate property in Florida",
    h1: "Pressure Washing Services in Ponte Vedra, FL",
    intro:
      "Ponte Vedra is home to some of Northeast Florida's finest properties, from oceanfront estates along Ponte Vedra Boulevard to meticulously maintained communities like Sawgrass, Marsh Landing, and Nocatee. Homeowners here take pride in their properties' appearance, and regular professional pressure washing is part of maintaining the standard that Ponte Vedra communities expect. We deliver the premium-quality exterior cleaning that matches the quality of these exceptional homes.",
    sections: [
      {
        heading: "Premium Service for Premium Properties",
        body: "Ponte Vedra homes feature high-end materials that require experienced, careful cleaning. Travertine pool decks, natural stone facades, custom-stained wood, and architectural-grade shingles all demand specific cleaning techniques. Our team has extensive experience with the materials and construction standards common in Ponte Vedra's premier communities. We adjust pressure, temperature, and cleaning solutions to match each surface, ensuring a thorough clean without risking damage to expensive finishes. From TPC Sawgrass estates to Nocatee family homes, we deliver results that meet the highest standards.",
      },
      {
        heading: "HOA Compliance Made Easy",
        body: "Many Ponte Vedra communities have strict HOA guidelines regarding exterior maintenance. Dirty roofs, stained driveways, and algae-covered siding can trigger violation notices and fines. Our scheduled maintenance plans help you stay ahead of HOA requirements. We can set up quarterly, bi-annual, or annual cleaning schedules so you never have to worry about compliance. Several Ponte Vedra HOAs recommend us to their residents, and we offer community group pricing for neighborhoods that coordinate cleaning schedules.",
      },
      {
        heading: "Serving All Ponte Vedra Communities",
        body: "Our service area covers all of Ponte Vedra including Ponte Vedra Beach, Ponte Vedra proper, Sawgrass, Sawgrass Country Club, Marsh Landing, TPC Sawgrass, Nocatee, Twenty Mile, Palm Valley, and all surrounding neighborhoods. Whether you need a single driveway cleaning or a complete estate exterior wash, we bring the same level of professionalism, attention to detail, and quality results to every job.",
      },
    ],
    landmarks: [
      "TPC Sawgrass",
      "Ponte Vedra Inn & Club",
      "Guana Tolomato Matanzas Reserve",
      "Nocatee Town Center",
      "Sawgrass Village",
    ],
    serviceArea:
      "We serve all Ponte Vedra communities including Ponte Vedra Beach, Sawgrass, Nocatee, Twenty Mile, Marsh Landing, Palm Valley, and surrounding areas.",
    faqs: [
      {
        question: "Do you have experience with high-end home materials?",
        answer:
          "Yes. We regularly clean travertine, natural stone, custom wood, and premium stucco surfaces found in Ponte Vedra's upscale communities. We adjust our techniques for each material.",
      },
      {
        question: "Can you help with HOA compliance cleaning?",
        answer:
          "Absolutely. We offer scheduled maintenance plans designed to keep your property compliant with HOA exterior maintenance requirements. Several Ponte Vedra HOAs recommend our services.",
      },
      {
        question: "Do you offer group rates for neighborhoods?",
        answer:
          "Yes. We offer community group pricing when neighbors in the same area coordinate cleaning schedules. Contact us for group rate details.",
      },
    ],
  },
  {
    slug: "palm-coast",
    city: "Palm Coast",
    title: "Pressure Washing in Palm Coast, FL | St. Augustine Pressure Washing Pros",
    metaDescription:
      "Professional pressure washing in Palm Coast, FL. Residential and commercial cleaning for homes, driveways, and businesses. Serving all Palm Coast sections. Free quotes.",
    heroImage: "/images/before_after/sidewalk.jpg",
    heroImageAlt: "Pressure washing service restoring a residential property in Palm Coast, Florida",
    h1: "Pressure Washing Services in Palm Coast, FL",
    intro:
      "Palm Coast's tree-lined streets and canal-side properties create a beautiful living environment, but they also mean more shade, more moisture, and more organic growth on your home's exterior surfaces. From the oldest sections of Palm Coast Plantation to newer developments along Matanzas Woods Parkway, every property benefits from regular professional pressure washing. We serve homeowners and businesses throughout Palm Coast and Flagler County with the same quality service we deliver across Northeast Florida.",
    sections: [
      {
        heading: "Pressure Washing for Palm Coast Homes",
        body: "Palm Coast's residential areas feature a mix of stucco homes, block construction, and concrete driveways that respond exceptionally well to professional pressure washing. The city's extensive tree canopy provides welcome shade but also creates conditions where mold, mildew, and algae thrive. Driveways in shaded cul-de-sacs develop dark stains faster than sun-exposed surfaces. North-facing walls stay damp longer and accumulate organic growth. Our team knows these patterns and tailors the cleaning approach to Palm Coast's specific conditions. We serve all Palm Coast sections \u2014 from the B Section to the W Section, Grand Haven, Palm Harbor, and every neighborhood in between.",
      },
      {
        heading: "Canal and Waterfront Property Specialists",
        body: "Palm Coast is built around an extensive canal system, and many homes sit directly on the water. These properties face additional challenges: higher humidity at the foundation level, splash-back from canal walls, and accelerated algae growth on seawalls and adjacent surfaces. We clean not just the home but the full exterior environment \u2014 driveways, walkways, patios, pool decks, and fence lines. If you live on one of Palm Coast's scenic canals, regular exterior cleaning keeps your property looking its best and prevents moisture-related damage.",
      },
      {
        heading: "Commercial Properties and HOA Common Areas",
        body: "Palm Coast's commercial corridors along Palm Coast Parkway and Belle Terre Parkway see heavy foot and vehicle traffic. Storefronts, sidewalks, and parking areas accumulate dirt, gum, grease, and organic stains that regular maintenance can't address. We also work with several Palm Coast HOA communities to maintain common areas, clubhouses, pool decks, and sidewalks. Our commercial pressure washing keeps business and community properties clean, safe, and inviting for residents and customers.",
      },
    ],
    landmarks: [
      "Palm Coast Linear Park",
      "Washington Oaks Gardens State Park",
      "European Village",
      "Palm Coast Town Center",
      "Flagler Beach (nearby)",
    ],
    serviceArea:
      "We serve all Palm Coast sections (A through Z), Grand Haven, Palm Harbor, Pine Lakes, Seminole Woods, Matanzas Woods, and surrounding Flagler County areas.",
    faqs: [
      {
        question: "Do you serve all of Palm Coast?",
        answer:
          "Yes. We serve every section of Palm Coast, from the A Section to the W Section, plus Grand Haven, Palm Harbor, Pine Lakes, Seminole Woods, and surrounding Flagler County areas.",
      },
      {
        question: "Is there an extra charge for Palm Coast service?",
        answer:
          "No. Palm Coast is within our standard service area. There are no travel surcharges for any Palm Coast address.",
      },
      {
        question: "Can you clean canal-side properties?",
        answer:
          "Absolutely. We have experience with canal-front homes and understand the additional moisture and algae challenges these properties face.",
      },
    ],
  },
  {
    slug: "st-augustine-beach",
    city: "St. Augustine Beach",
    title: "Pressure Washing in St. Augustine Beach, FL | St. Augustine Pressure Washing Pros",
    metaDescription:
      "Professional pressure washing in St. Augustine Beach, FL. Local experts in coastal property cleaning. House washing, driveways, roofs. Free quotes.",
    heroImage: "/images/before_after/front_porch.jpg",
    heroImageAlt: "Pressure washing service cleaning a beachside property in St. Augustine Beach, Florida",
    h1: "Pressure Washing Services in St. Augustine Beach, FL",
    intro:
      "St. Augustine Beach is our home turf. As the local pressure washing company in the area, we understand the specific challenges that coastal living brings to your property's exterior surfaces. Salt spray, ocean humidity, and sandy soil create a relentless cycle of buildup that makes regular professional cleaning essential. Our team lives and works here \u2014 we know these neighborhoods, these materials, and exactly what it takes to keep your property looking its best in this beautiful but demanding coastal environment.",
    sections: [
      {
        heading: "Your Local Pressure Washing Team",
        body: "Being local matters when it comes to property maintenance. We know that homes along A1A deal with direct salt spray that inland properties don't. We know that the shaded streets behind the beach build up algae faster during the summer months. We understand the mix of older beach cottages and newer construction in St. Augustine Beach, and we've cleaned them all. Our response times are the fastest here because this is our home base. When you call, you're calling your neighbors \u2014 not a distant company that has to drive an hour to reach you.",
      },
      {
        heading: "Complete Coastal Property Care",
        body: "We offer every cleaning service St. Augustine Beach properties need: house soft washing to remove salt film and mildew, driveway and parking area cleaning, roof soft wash for asphalt and tile roofs, deck and patio restoration, fence cleaning, pool deck cleaning, and outdoor living area maintenance. Beach properties often have more outdoor living space than inland homes \u2014 decks, patios, outdoor kitchens, and walkways that all need regular attention. We clean it all, and we do it with the expertise that comes from years of working exclusively on coastal properties.",
      },
      {
        heading: "Seasonal Cleaning for Beach Properties",
        body: "St. Augustine Beach properties go through distinct seasonal cycles. Winter brings holiday guests and the need for a property refresh. Spring rains accelerate mold and algae growth. Summer heat bakes salt and grime into surfaces. Fall is ideal for a thorough cleaning before the holiday season begins again. Many of our St. Augustine Beach customers schedule two cleanings per year \u2014 one in spring and one in fall \u2014 to keep their homes looking great year-round. We also provide one-time cleanings for property sales, vacation rental turnovers, and special events.",
      },
    ],
    landmarks: [
      "St. Augustine Beach Pier",
      "Anastasia State Park",
      "St. Augustine Lighthouse",
      "St. Johns County Ocean Pier",
      "Crescent Beach",
    ],
    serviceArea:
      "We serve all of St. Augustine Beach, Crescent Beach, Butler Beach, Anastasia Island, and surrounding St. Johns County coastal areas.",
    faqs: [
      {
        question: "How quickly can you get to St. Augustine Beach?",
        answer:
          "St. Augustine Beach is our home base. We can often schedule service within 1 to 3 days, with same-day availability for urgent situations.",
      },
      {
        question: "Do you clean vacation rental properties?",
        answer:
          "Yes. We work with several vacation rental owners and property managers in St. Augustine Beach. We offer flexible scheduling for turnover cleanings and seasonal maintenance.",
      },
      {
        question: "What's the best time of year for pressure washing at the beach?",
        answer:
          "Spring (March\u2013April) and fall (October\u2013November) are ideal. Spring cleaning removes winter buildup before summer, and fall cleaning prepares your home for holiday guests.",
      },
    ],
  },
  {
    slug: "st-augustine",
    city: "St. Augustine",
    title: "Pressure Washing in St. Augustine, FL | St. Augustine Pressure Washing Pros",
    metaDescription:
      "Professional pressure washing in St. Augustine, FL. Local experts serving the Nation's Oldest City. House washing, driveways, roofs, patios, and commercial properties. Free quotes.",
    heroImage: "/images/before_after/home.jpg",
    heroImageAlt: "Professional pressure washing service restoring a historic property in St. Augustine, Florida",
    h1: "Pressure Washing Services in St. Augustine, FL",
    intro:
      "St. Augustine is where we started — and it's the community we know best. As the oldest city in the United States, St. Augustine combines historic charm with coastal living, and both bring unique challenges for property maintenance. From the coquina walls of the historic district to modern subdivisions in World Golf Village, our team delivers expert pressure washing tailored to St. Augustine's diverse architecture and demanding coastal climate. We're your neighbors, and we take pride in helping keep this beautiful city looking its best.",
    sections: [
      {
        heading: "What Is Pressure Washing and Why Does St. Augustine Need It?",
        body: "Pressure washing uses high-pressure water — and in some cases, low-pressure soft washing with specialized cleaning solutions — to remove dirt, mold, mildew, algae, and stains from exterior surfaces. In St. Augustine, the combination of ocean humidity, salt air, frequent rain, and subtropical heat creates an environment where organic growth thrives on every outdoor surface. Driveways turn black with algae, roofs streak within a few years, and siding develops green mold on shaded sides. Professional pressure washing removes these contaminants, restores your property's appearance, and prevents the long-term damage that unchecked growth causes to concrete, wood, shingles, and painted surfaces.",
      },
      {
        heading: "Serving Every St. Augustine Neighborhood",
        body: "We serve all of St. Augustine proper, from the historic downtown district to the growing communities west of I-95. Our service area includes Downtown St. Augustine, Davis Shores, Lincolnville, Anastasia Island, Vilano Beach, World Golf Village, Palencia, Julington Creek, Fruit Cove, St. Augustine Shores, Hastings, and all surrounding St. Johns County communities. Whether you own a historic home near the Castillo de San Marcos, a family home in World Golf Village, or a commercial property on US-1, we bring the same level of expertise and care to every job.",
      },
      {
        heading: "Why Choose a Local St. Augustine Pressure Washing Company?",
        body: "Hiring a local team means faster response times, familiarity with local building materials and HOA requirements, and accountability within the community. We understand the specific challenges St. Augustine properties face — from the salt exposure on Anastasia Island to the heavy tree canopy in older neighborhoods. We know which surfaces need soft washing versus high-pressure cleaning, and we adjust our approach for the coquina, stucco, wood, and brick common in this area. Our reputation is built on the quality of our work right here in St. Augustine, and every satisfied customer is a neighbor.",
      },
    ],
    landmarks: [
      "Castillo de San Marcos",
      "St. George Street",
      "Flagler College",
      "St. Augustine Lighthouse",
      "World Golf Village",
      "Fort Matanzas",
    ],
    serviceArea:
      "We serve all of St. Augustine and St. Johns County including Downtown, Davis Shores, Anastasia Island, Vilano Beach, World Golf Village, Palencia, St. Augustine Shores, Hastings, and surrounding areas.",
    faqs: [
      {
        question: "What areas of St. Augustine do you serve?",
        answer:
          "We serve all of St. Augustine and greater St. Johns County, including Downtown, Davis Shores, Lincolnville, Anastasia Island, Vilano Beach, World Golf Village, Palencia, Julington Creek, Fruit Cove, St. Augustine Shores, and Hastings.",
      },
      {
        question: "Can you pressure wash historic properties in St. Augustine?",
        answer:
          "Yes. We have experience cleaning historic homes and buildings, including coquina and tabby surfaces. We use low-pressure soft washing on delicate materials to clean effectively without causing damage to historic finishes.",
      },
      {
        question: "How often should St. Augustine homeowners schedule pressure washing?",
        answer:
          "We recommend at least once per year for most properties. Homes near the coast, under heavy tree canopy, or in high-humidity areas may benefit from cleaning every 6 to 9 months to stay ahead of organic growth.",
      },
    ],
  },
]

export function getLocationBySlug(slug: string): LocationData | undefined {
  return locations.find((l) => l.slug === slug)
}

export function getAllLocationSlugs(): string[] {
  return locations.map((l) => l.slug)
}
