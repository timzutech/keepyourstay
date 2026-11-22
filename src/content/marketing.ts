// How owners get guests to their own website. Shared by the homepage and /marketing.

export type Channel = { title: string; short: string; text: string; timeToWork: string };

export const channels: Channel[] = [
  {
    title: "Google Business Profile and Maps",
    short: "Show up when travellers search your area on Google and Maps.",
    text: "We set up or improve your Google Business Profile with the right category, photos, booking link and regular posts, and show you how to collect genuine reviews. For many rentals this is the quickest free source of direct visitors.",
    timeToWork: "Often weeks",
  },
  {
    title: "Google search (SEO)",
    short: "Rank for your property name and the places guests are searching.",
    text: "Pages for your property, your area and the things guests come for, written the way people search. Plus the technical basics: speed, mobile, structured data and Search Console. This builds slowly and keeps working.",
    timeToWork: "3–6 months and up",
  },
  {
    title: "Returning guests",
    short: "Make it easy for past direct guests to book again.",
    text: "Guests who booked directly and agreed to hear from you get a simple email before your best seasons, plus a returning-guest offer if you want one. These are often your most reliable direct bookings.",
    timeToWork: "From your first season",
  },
  {
    title: "Social media",
    short: "Turn followers into website visitors, not just likes.",
    text: "Instagram, Facebook and TikTok profiles that link to your booking page, with a simple content plan around your seasons: the view, the details, the area, the availability. We set it up and give you a calendar you can keep up with.",
    timeToWork: "1–3 months",
  },
  {
    title: "Paid ads",
    short: "Google and Meta ads aimed at people searching or planning trips.",
    text: "Small, tracked campaigns for your property name, your area and your quiet dates. We only recommend ads when the numbers make sense for your nightly rate, and we report the cost of each enquiry so you can decide whether to continue.",
    timeToWork: "Days, while you pay",
  },
  {
    title: "Local partners and referrals",
    short: "Get recommended by the people your guests already deal with.",
    text: "Wedding venues, event organisers, tour operators, local businesses and companies that send staff to the area. We help you put together a simple partner page and a short pitch so they can send guests straight to your site.",
    timeToWork: "Varies",
  },
];

export const ninetyDays = [
  {
    title: "Weeks 1–2: Foundations",
    text: "Google Business Profile, Search Console, analytics and conversion tracking. Social profiles linked to your booking page. Your property name searchable on Google.",
  },
  {
    title: "Weeks 3–6: Content",
    text: "Area and activity pages, a local guide, the first social posts and an email to any past direct guests who agreed to hear from you.",
  },
  {
    title: "Weeks 7–12: Growth",
    text: "Local partner outreach, a small ad test if it makes sense for your rates, and review requests to every direct guest.",
  },
  {
    title: "Every month: Reporting",
    text: "Where visitors came from, how many enquiries and direct bookings followed, and what we suggest doing next. In plain language.",
  },
];

export const weMeasure = [
  "Visitors to your website, by source",
  "Enquiries and direct bookings",
  "Cost per enquiry for any paid ads",
  "Google search and Maps visibility",
];
