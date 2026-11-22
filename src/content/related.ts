// Links blog articles to the services they relate to, in both directions.
// Article pages show the services; service pages show the articles.

export const articleServices: Record<string, string[]> = {
  "why-vacation-rental-owners-need-their-own-website": ["vacation-rental-website-design", "direct-booking-websites"],
  "direct-bookings-vs-third-party-booking-platforms": ["direct-booking-websites", "booking-marketing"],
  "how-to-build-a-direct-booking-website": ["direct-booking-websites", "booking-calendar-integration", "payment-integration"],
  "how-booking-calendar-integration-works": ["booking-calendar-integration", "property-management-system-integration"],
  "how-to-improve-vacation-rental-seo": ["seo", "booking-marketing"],
  "what-guests-expect-from-a-vacation-rental-website": ["vacation-rental-website-design", "website-redesign"],
  "how-multi-property-owners-can-organize-their-online-presence": [
    "multi-property-websites",
    "property-management-system-integration",
  ],
  "how-to-build-trust-on-a-direct-booking-website": ["direct-booking-websites", "payment-integration"],
  "website-features-every-vacation-rental-business-needs": ["vacation-rental-website-design", "maintenance"],
  "do-i-need-a-website-for-my-airbnb": ["vacation-rental-website-design", "direct-booking-websites"],
  "how-much-does-a-vacation-rental-website-cost": ["vacation-rental-website-design", "website-redesign", "maintenance"],
};

export const servicesForArticle = (articleSlug: string) => articleServices[articleSlug] ?? [];

export const articlesForService = (serviceSlug: string) =>
  Object.entries(articleServices)
    .filter(([, services]) => services.includes(serviceSlug))
    .map(([article]) => article);
