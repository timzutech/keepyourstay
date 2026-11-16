import { photo, photos } from "@/lib/site";
import type { PortfolioCategory, Project } from "@/lib/types";

export const portfolioCategories: PortfolioCategory[] = [
  { slug: "luxury-villas", name: "Luxury Villas" },
  { slug: "holiday-apartments", name: "Holiday Apartments" },
  { slug: "boutique-vacation-rentals", name: "Boutique Vacation Rentals" },
  { slug: "beach-houses", name: "Beach Houses" },
  { slug: "cabins-and-cottages", name: "Cabins and Cottages" },
  { slug: "multi-property-businesses", name: "Multi-Property Businesses" },
];

const cat = (slug: string) => portfolioCategories.find((c) => c.slug === slug)!;

const conceptStack = ["Next.js", "Tailwind CSS", "Supabase", "Vercel"];

/**
 * Concept projects. Every one is fictional and is labelled
 * "Concept Project — Illustrative Design" wherever it appears.
 * Photographs are stock images from Unsplash, not client properties.
 */
export const conceptProjects: Project[] = [
  {
    slug: "casa-solene",
    name: "Casa Solène",
    category: cat("luxury-villas"),
    kind: "concept",
    summary:
      "A photo-led website for a fictional six-bedroom hillside villa, built around long-stay enquiries.",
    overview:
      "Casa Solène is an invented property: a six-bedroom villa above a bay, let by the week to families and groups. We designed it to show how a high-value rental can present itself with the calm and confidence of a small hotel.",
    objectives: [
      "Let the photography carry the first impression",
      "Answer a group organiser's practical questions before they ask",
      "Offer an enquiry route suited to week-long, high-value stays",
    ],
    design_approach:
      "Full-width images open every section, with generous margins and very little interface between them. Practical detail, such as bedrooms, staffing and distances, sits in a quiet fact panel that follows the reader down the page. The booking route is a request-to-book form rather than instant checkout, which suits how stays of this kind are usually arranged.",
    features: [
      "Full-screen gallery grouped by room",
      "Bedroom-by-bedroom sleeping plan",
      "Availability calendar with weekly changeover days",
      "Request-to-book form with group size and dates",
      "Concierge and local services page",
    ],
    services: ["vacation-rental-website-design", "booking-calendar-integration", "seo"],
    technologies: conceptStack,
    outcomes: [],
    outcomes_verified: false,
    website_url: null,
    cover_image: photo(photos.villaBay),
    cover_alt: "Infinity pool overlooking a blue bay with distant islands",
    featured: true,
    images: [
      { url: photo(photos.villaPool), alt: "Villa terrace beside a private swimming pool" },
      { url: photo(photos.poolTerrace), alt: "Pool terrace with a table and chairs" },
      { url: photo(photos.villaWhite), alt: "White villa and pool in early morning light" },
    ],
  },
  {
    slug: "tidewater-house",
    name: "Tidewater House",
    category: cat("beach-houses"),
    kind: "concept",
    summary:
      "A direct booking website for a fictional family beach house, with instant availability and card payment.",
    overview:
      "Tidewater House is an invented four-bedroom beach house aimed at families returning year after year. The concept shows a complete booking journey for a single property, from first photo to paid deposit.",
    objectives: [
      "Make dates and total price visible within two taps on a phone",
      "Give repeat guests a quick way back to booking",
      "Explain the beach, parking and house rules clearly",
    ],
    design_approach:
      "The design borrows its palette from weathered timber and sea glass, and keeps a booking bar within reach on every page. Because most visitors arrive on a phone, the calendar and price summary were designed for a narrow screen first and widened afterwards.",
    features: [
      "Live availability calendar with seasonal minimum stays",
      "Price summary with cleaning fee and taxes itemised",
      "Card payment for deposit and balance",
      "Tide times and beach guide",
      "Returning-guest sign-up for early availability",
    ],
    services: ["direct-booking-websites", "booking-calendar-integration", "payment-integration"],
    technologies: [...conceptStack, "Card payments (concept)"],
    outcomes: [],
    outcomes_verified: false,
    website_url: null,
    cover_image: photo(photos.beachHouse),
    cover_alt: "White and grey timber beach house beside a quiet road",
    featured: true,
    images: [
      { url: photo(photos.blueHouse), alt: "Blue and white house under a clear sky" },
      { url: photo(photos.poolLoungers), alt: "Loungers and a parasol beside a pool" },
    ],
  },
  {
    slug: "the-lantern-rooms",
    name: "The Lantern Rooms",
    category: cat("holiday-apartments"),
    kind: "concept",
    summary:
      "A website for a fictional set of four city apartments, where guests compare and book in one place.",
    overview:
      "The Lantern Rooms is an invented collection of four serviced apartments in one townhouse. The concept explores how a small operator can show several similar units without making guests open four separate listings.",
    objectives: [
      "Help guests compare apartments at a glance",
      "Offer an alternative when a first choice is unavailable",
      "Give business and leisure guests the details each needs",
    ],
    design_approach:
      "A single comparison view lists the four apartments side by side with sleeping capacity, floor and standout feature. Choosing dates filters the view to what is free. Each apartment page shares one layout, so guests learn where things are once.",
    features: [
      "Side-by-side apartment comparison",
      "Date search across all four units",
      "Suggested alternatives for unavailable dates",
      "Neighbourhood guide with walking times",
      "Self check-in instructions page",
    ],
    services: ["multi-property-websites", "direct-booking-websites", "booking-calendar-integration"],
    technologies: conceptStack,
    outcomes: [],
    outcomes_verified: false,
    website_url: null,
    cover_image: photo(photos.livingRoom),
    cover_alt: "Modern living room with an armchair and framed abstract art",
    featured: true,
    images: [
      { url: photo(photos.sunlitRoom), alt: "Sunlit living room with a sofa and desk" },
      { url: photo(photos.bedroom), alt: "Hotel-style bedroom with a white sofa and warm lighting" },
    ],
  },
  {
    slug: "fernhollow-cabin",
    name: "Fernhollow Cabin",
    category: cat("cabins-and-cottages"),
    kind: "concept",
    summary:
      "A quiet, story-led website for a fictional off-grid cabin, written for search as much as for guests.",
    overview:
      "Fernhollow is an invented two-person cabin at the edge of a forest. The concept shows how a small, characterful property can use writing and local knowledge to be found by people searching for exactly this kind of stay.",
    objectives: [
      "Describe honestly what off-grid means here",
      "Build pages around what guests search for in the area",
      "Keep the site light enough to load on a weak rural signal",
    ],
    design_approach:
      "The site reads like a short field guide: what you will hear at night, how the stove works, where the path leads. Pages are deliberately light, with few scripts and compressed images, because the guests most interested in a remote cabin are often browsing with poor reception.",
    features: [
      "Seasonal guide to the surrounding area",
      "Plain-language 'what to expect' page",
      "Availability calendar and request-to-book form",
      "Journal for local walks and seasonal notes",
      "Structured data for search engines",
    ],
    services: ["vacation-rental-website-design", "seo", "booking-calendar-integration"],
    technologies: conceptStack,
    outcomes: [],
    outcomes_verified: false,
    website_url: null,
    cover_image: photo(photos.cabinMeadow),
    cover_alt: "Small log cabin in a meadow of wildflowers",
    featured: false,
    images: [
      { url: photo(photos.cabinSmoke), alt: "Cabin among trees with smoke rising from its chimney" },
    ],
  },
  {
    slug: "wren-cottage",
    name: "Wren Cottage",
    category: cat("boutique-vacation-rentals"),
    kind: "concept",
    summary:
      "A redesign concept for a fictional stone cottage, replacing a dated site with a clear route to booking.",
    overview:
      "Wren Cottage is an invented three-bedroom village cottage. The concept imagines a typical redesign: an older website with small photos and a hidden contact page, rebuilt around what guests need to decide.",
    objectives: [
      "Move availability and booking onto the first screen",
      "Replace a long single page with a clear structure",
      "Keep existing page addresses working after the rebuild",
    ],
    design_approach:
      "We kept the cottage's character and removed the clutter: one typeface, a stone-and-moss palette, and large photographs. Navigation was reduced to five items. A redirect plan maps each old page address to its replacement.",
    features: [
      "Restructured navigation and page hierarchy",
      "Larger gallery with captions",
      "Availability calendar on the home page",
      "Redirect map from old page addresses",
      "Village and walks guide",
    ],
    services: ["website-redesign", "seo", "maintenance"],
    technologies: conceptStack,
    outcomes: [],
    outcomes_verified: false,
    website_url: null,
    cover_image: photo(photos.cotswoldCottage),
    cover_alt: "Stone cottage with a thatched roof and clipped hedges",
    featured: false,
    images: [
      { url: photo(photos.scottishCottage), alt: "Grey and white cottage in a green field" },
    ],
  },
  {
    slug: "harbour-and-hill-stays",
    name: "Harbour & Hill Stays",
    category: cat("multi-property-businesses"),
    kind: "concept",
    summary:
      "A portfolio website for a fictional manager of twenty-four homes, serving guests and prospective owners.",
    overview:
      "Harbour & Hill Stays is an invented property management company with twenty-four homes across one coastal region. The concept addresses two audiences: guests choosing a stay, and owners choosing a manager.",
    objectives: [
      "Let guests search the whole portfolio by date, size and location",
      "Present every home consistently, whatever its style",
      "Give prospective owners a clear reason to get in touch",
    ],
    design_approach:
      "Search comes first: dates, guests and area on the opening screen, with results on a map and in a list. Property pages share one template drawn from a single data source, so adding the twenty-fifth home is a matter of entering its details. A separate section speaks to owners, with its own enquiry form.",
    features: [
      "Portfolio search with map and filters",
      "Templated property pages from one data source",
      "Availability across all homes",
      "Owner services section and enquiry form",
      "Area guides that link to nearby homes",
    ],
    services: [
      "multi-property-websites",
      "property-management-system-integration",
      "direct-booking-websites",
    ],
    technologies: [...conceptStack, "PMS connection (concept)"],
    outcomes: [],
    outcomes_verified: false,
    website_url: null,
    cover_image: photo(photos.villaWhite),
    cover_alt: "White house beside a swimming pool in morning light",
    featured: false,
    images: [
      { url: photo(photos.beachHouse), alt: "Timber beach house beside a road" },
      { url: photo(photos.livingRoom), alt: "Modern living room interior" },
      { url: photo(photos.cabinSmoke), alt: "Cabin among autumn trees" },
    ],
  },
];

/**
 * Unpublished drafts created by "Import starter content" in the admin dashboard,
 * ready to be filled in with real client work. Never shown publicly until edited,
 * given permission, and published.
 */
export const realProjectPlaceholders = [
  { slug: "client-project-1", name: "Client project 1 (add details)" },
  { slug: "client-project-2", name: "Client project 2 (add details)" },
  { slug: "client-project-3", name: "Client project 3 (add details)" },
];
