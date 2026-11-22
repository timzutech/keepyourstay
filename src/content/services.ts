export type Service = {
  slug: string;
  name: string;
  short: string;
  summary: string;
  involves: string;
  whoNeedsIt: string[];
  problem: string;
  youReceive: string[];
  howItWorks: { title: string; text: string }[];
  toGetStarted: string[];
  seoTitle: string;
  seoDescription: string;
};

const standardProcess = (build: string) => [
  {
    title: "Consultation",
    text: "We talk through your property, your current booking channels and what you want the website to do.",
  },
  {
    title: "Scope and quotation",
    text: "You receive a written scope and a custom quotation. Nothing is built until you approve both.",
  },
  { title: "Design and build", text: build },
  {
    title: "Review and launch",
    text: "You review the work on a private link, we make agreed changes, test on phones and desktops, and launch.",
  },
];

export const services: Service[] = [
  {
    slug: "vacation-rental-website-design",
    name: "Custom Vacation Rental Website Design",
    short: "Website design",
    summary:
      "A website designed around your property and your guests, not a template with your photos dropped in.",
    involves:
      "We design the structure, pages and visual identity of your website from your property outward: what makes the place worth booking, who usually stays, and what those guests need to see before they commit. The result is a design that presents the property honestly and attractively, reads well on a phone, and leads visitors toward checking dates or making an enquiry.",
    whoNeedsIt: [
      "Owners launching their first independent website",
      "Hosts whose only online presence is a listing on a booking platform",
      "Boutique operators who want a recognisable brand of their own",
    ],
    problem:
      "On a booking platform your property sits in a grid beside hundreds of others, formatted identically. Guests remember the platform, not you. Without a place of your own online, there is nowhere to send a returning guest, a referral, or someone who searches for your property by name.",
    youReceive: [
      "A custom design for home, property, gallery, location, about and contact pages",
      "Layouts designed for phones first, then tablets and desktops",
      "A photo-led presentation with clear room, amenity and house-rule information",
      "A simple design system: colours, type and components for future pages",
      "Accessible, fast-loading pages built on a modern framework",
    ],
    howItWorks: standardProcess(
      "We design the key pages first, agree the direction with you, then build the full site with your content and photography.",
    ),
    toGetStarted: [
      "Your property name, location and a short description",
      "Your best photographs, or a plan to commission them",
      "Any logo or brand colours you already use",
      "Websites you like, and what you like about them",
    ],
    seoTitle: "Custom Vacation Rental Website Design",
    seoDescription:
      "Custom website design for vacation rentals, villas, cabins and holiday apartments. Photo-led, mobile-first pages that present your property under your own brand.",
  },
  {
    slug: "direct-booking-websites",
    name: "Direct Booking Website Development",
    short: "Direct booking websites",
    summary:
      "A complete website where guests can check availability, see what a stay costs and book with you.",
    involves:
      "We build a full booking website: property pages, an availability calendar, a booking or enquiry flow, and payment where your setup supports it. Depending on your systems, the booking engine may be one provided by your property management system, a dedicated booking tool, or a request-to-book flow that you confirm manually.",
    whoNeedsIt: [
      "Owners who want a booking channel that belongs to them",
      "Operators with repeat guests and referrals who currently have nowhere to send them",
      "Businesses investing in their own marketing who need somewhere for it to lead",
    ],
    problem:
      "If every booking arrives through a third-party platform, the platform sets the fees, the rules and the terms of your guest relationship. A booking website gives guests who find you independently a way to book with you. It is one part of a direct-booking strategy, alongside marketing, reviews, pricing and guest trust.",
    youReceive: [
      "Property pages with galleries, amenities, location and policies",
      "An availability calendar connected to your booking system where supported",
      "A booking or request-to-book flow suited to how you operate",
      "Payment integration where your provider and region allow it",
      "Confirmation and enquiry emails, and a tested checkout on mobile",
    ],
    howItWorks: standardProcess(
      "We confirm which booking and payment tools fit your business, design the booking journey, then build and test it end to end with test reservations.",
    ),
    toGetStarted: [
      "How you take bookings today, and through which platforms",
      "Any property management or channel management software you use",
      "Your rates, minimum stays, fees and cancellation policy",
      "Your preferred payment provider, if you have one",
    ],
    seoTitle: "Direct Booking Website Development for Vacation Rentals",
    seoDescription:
      "Direct booking websites for short-term rentals: availability calendars, booking flows and payment integration, built around the systems you already use.",
  },
  {
    slug: "booking-calendar-integration",
    name: "Booking Calendar Integration",
    short: "Calendar integration",
    summary:
      "Show live availability on your website and keep it in step with the other places you take bookings.",
    involves:
      "We connect an availability calendar to your website and synchronise it with your other channels. The method depends on what your systems support: a direct connection through your property management system, a booking tool's own widget, or iCal feeds exchanged between calendars.",
    whoNeedsIt: [
      "Owners listing on more than one channel",
      "Hosts with a website that shows no availability",
      "Anyone who has had, or worries about, a double booking",
    ],
    problem:
      "A website without availability makes guests ask before they can book, and many will not. A calendar that is out of date is worse: it invites double bookings and awkward cancellations. Synchronisation methods differ in speed and reliability, so the right approach depends on your booking volume and tools.",
    youReceive: [
      "An availability calendar on your property pages",
      "Synchronisation with your other calendars using a supported method",
      "A clear explanation of how often each connection updates, and its limits",
      "Testing with sample reservations in each direction",
      "Short written instructions for blocking dates and handling changes",
    ],
    howItWorks: standardProcess(
      "We review the calendars and software you use, recommend the most reliable connection available, then set it up and test it with sample bookings.",
    ),
    toGetStarted: [
      "A list of every channel where the property can be booked",
      "Access to your calendar export and import settings, or your PMS",
      "Your minimum-stay, turnover-day and advance-notice rules",
    ],
    seoTitle: "Booking Calendar Integration for Vacation Rental Websites",
    seoDescription:
      "Add a live availability calendar to your vacation rental website and synchronise it with your other booking channels using PMS connections or iCal.",
  },
  {
    slug: "payment-integration",
    name: "Payment Gateway Integration",
    short: "Payment integration",
    summary: "Let guests pay deposits and balances securely on your website.",
    involves:
      "We connect a payment provider to your booking flow so guests can pay by card on your website. Card details are handled by the payment provider's own secure systems, not stored on your site. Which providers are available depends on your country, your business type and your booking software.",
    whoNeedsIt: [
      "Owners taking direct bookings by bank transfer or invoice",
      "Operators who want deposits collected at the time of booking",
      "Businesses whose booking software supports a payment provider they have not yet connected",
    ],
    problem:
      "Asking a guest to send a bank transfer to a stranger is a hard ask, and manual payments take time to chase and reconcile. Card payment through a recognised provider is what guests expect. It is not free: providers charge processing fees, which you should include in your pricing.",
    youReceive: [
      "A payment provider connected to your booking or enquiry flow",
      "Deposit and balance payment options where your tools support them",
      "Payment confirmation emails for you and the guest",
      "Test transactions before launch",
      "Guidance on refunds, disputes and where to find your payouts",
    ],
    howItWorks: standardProcess(
      "We confirm which payment providers are available to you, connect the one you choose, and run test payments through the full booking journey.",
    ),
    toGetStarted: [
      "The country your business operates and banks in",
      "An existing payment provider account, or willingness to open one in your own name",
      "Your deposit, balance and cancellation terms",
    ],
    seoTitle: "Payment Gateway Integration for Booking Websites",
    seoDescription:
      "Secure card payments on your vacation rental website. Deposits, balances and confirmations through a payment provider available in your region.",
  },
  {
    slug: "property-management-system-integration",
    name: "Property Management System Integration",
    short: "PMS integration",
    summary:
      "Connect your website to the property management system that already runs your rates and availability.",
    involves:
      "If you manage your properties in a PMS or channel manager, we connect your website to it so that rates, availability and reservations come from one source. We work with the options your system provides: an API, an official booking widget or engine, or a supported plugin.",
    whoNeedsIt: [
      "Property managers already running a PMS or channel manager",
      "Operators whose website and PMS currently hold separate information",
      "Businesses about to choose a PMS who want the website considered in that decision",
    ],
    problem:
      "When the website and the PMS are not connected, someone has to update both, and sooner or later they disagree. Not every system can be connected in every way. What is possible depends on your provider's API access, plan and supported connections, which we check before quoting.",
    youReceive: [
      "A review of what your PMS allows on your current plan",
      "Website listings, rates and availability drawn from the PMS where supported",
      "Reservations from the website created in the PMS where supported",
      "A written note of what is synchronised, how often, and what is not",
      "Testing with sample reservations before launch",
    ],
    howItWorks: standardProcess(
      "We check your PMS documentation and plan, confirm what can be connected, then build and test the connection against your real listings.",
    ),
    toGetStarted: [
      "The name of your PMS or channel manager, and your plan",
      "Whether API access or a booking engine is included",
      "How many properties and units you manage in it",
    ],
    seoTitle: "Property Management System (PMS) Website Integration",
    seoDescription:
      "Connect your vacation rental website to your PMS or channel manager so rates, availability and reservations come from one source, where your system supports it.",
  },
  {
    slug: "website-redesign",
    name: "Vacation Rental Website Redesign",
    short: "Website redesign",
    summary:
      "Rebuild a dated or underperforming website while keeping the search visibility you have earned.",
    involves:
      "We review your existing website, identify what is holding it back, and redesign it. That usually means a clearer structure, better presentation of the property, a simpler route to booking, and a faster build. We map old page addresses to new ones so existing links and search listings keep working.",
    whoNeedsIt: [
      "Owners with a website that looks dated or is hard to use on a phone",
      "Operators whose site gets visits but few enquiries",
      "Businesses that have outgrown a do-it-yourself site builder",
    ],
    problem:
      "A website that is slow, awkward on mobile, or unclear about how to book undermines guest confidence before they have read a word. Rebuilding carelessly has its own risk: changing page addresses without redirects can lose search visibility built up over years.",
    youReceive: [
      "A written review of your current site: structure, content, speed and booking journey",
      "A new design and build, with your content migrated and improved",
      "Redirects from old page addresses to new ones",
      "Existing analytics and search tools reconnected",
      "A before-and-after comparison of page speed",
    ],
    howItWorks: standardProcess(
      "We audit the current site, agree what stays and what changes, redesign the key pages, then rebuild, migrate content and set up redirects.",
    ),
    toGetStarted: [
      "Your current website address",
      "Access to the site, domain and any analytics you have",
      "What you think is not working, and what must not change",
    ],
    seoTitle: "Vacation Rental Website Redesign",
    seoDescription:
      "Redesign a dated vacation rental website with a clearer booking journey, faster pages and redirects that protect your existing search visibility.",
  },
  {
    slug: "seo",
    name: "SEO and Google Visibility",
    short: "SEO",
    summary:
      "Help guests who search for a place like yours, or for you by name, find your website.",
    involves:
      "We set up the technical foundations search engines need, structure your pages around the searches your guests make, and help you claim and complete your Google Business Profile where you are eligible. Search visibility builds over months, not days, and no one can promise a specific ranking.",
    whoNeedsIt: [
      "Owners with a website that does not appear when their property name is searched",
      "Operators in destinations where guests search for a specific kind of stay",
      "Businesses launching a new site that want it set up properly from day one",
    ],
    problem:
      "A website nobody can find does not produce bookings. Many rental websites are missing basics: page titles, descriptions, a sitemap, readable text about the location. Fixing these does not guarantee traffic, but without them a site has little chance of being found.",
    youReceive: [
      "Technical setup: titles, descriptions, sitemap, structured data, canonical addresses",
      "Keyword research for your location and property type",
      "Location and property content written for guests first",
      "Google Search Console and Business Profile setup, where eligible",
      "A plain-language report of what was done and what to do next",
    ],
    howItWorks: standardProcess(
      "We audit the site, research how guests search for stays like yours, fix the technical issues, and write or restructure the content that matters most.",
    ),
    toGetStarted: [
      "Your website address, or confirmation that we are building it",
      "The destination, and what kind of guests you usually host",
      "Access to Google Search Console and Business Profile if they exist",
    ],
    seoTitle: "SEO for Vacation Rental Websites",
    seoDescription:
      "Technical SEO, location content and Google Business Profile setup for vacation rental websites. Honest, long-term work with no ranking guarantees.",
  },
  {
    slug: "maintenance",
    name: "Website Maintenance and Support",
    short: "Maintenance",
    summary: "Keep your website secure, up to date and working, with someone to call when it isn't.",
    involves:
      "We look after the website after launch: software updates, backups, uptime and form checks, and content changes such as new photos, seasonal rates text or policy updates. You have a named contact for requests rather than a ticket queue.",
    whoNeedsIt: [
      "Owners who do not want to manage a website themselves",
      "Operators whose current site has no one responsible for it",
      "Businesses that change photos, offers or policies through the year",
    ],
    problem:
      "Websites are not finished at launch. Software ages, integrations change, and a broken enquiry form can go unnoticed for weeks while it quietly loses you guests. Regular maintenance is cheaper than an emergency repair.",
    youReceive: [
      "Software and security updates",
      "Regular backups and a tested way to restore them",
      "Checks that forms, calendars and payments still work",
      "An agreed allowance of content changes",
      "A short periodic summary of what was done",
    ],
    howItWorks: [
      {
        title: "Review",
        text: "We look at your site and how it is hosted, and note anything that needs attention first.",
      },
      {
        title: "Plan and quotation",
        text: "We agree what is covered, how to request changes and how quickly we respond, and quote accordingly.",
      },
      {
        title: "Ongoing care",
        text: "We carry out the agreed checks and updates, and handle change requests as they come in.",
      },
      {
        title: "Reporting",
        text: "You receive a summary of work done and anything we recommend looking at next.",
      },
    ],
    toGetStarted: [
      "Your website address and who built it",
      "Access to hosting, the site's admin and your domain",
      "The kinds of changes you expect to need",
    ],
    seoTitle: "Vacation Rental Website Maintenance and Support",
    seoDescription:
      "Ongoing maintenance for vacation rental websites: updates, backups, form and booking checks, and content changes handled for you.",
  },
  {
    slug: "booking-marketing",
    name: "Direct Booking Marketing",
    short: "Direct booking marketing",
    summary:
      "Get guests to your website once it's live: Google, social media, returning guests, local partners and ads, with monthly reporting.",
    involves:
      "We help you bring your own audience to your own website: social profiles that link to it properly, content planned around your seasons, email to past guests who have agreed to hear from you, and paid campaigns where the numbers justify them. The aim is an audience you reach independently of any booking platform.",
    whoNeedsIt: [
      "Owners with a website that receives few visitors",
      "Operators with a social following that does not lead anywhere",
      "Businesses with past guests they have permission to contact",
    ],
    problem:
      "A website does not generate bookings by existing. Guests have to arrive at it. Marketing costs time and often money, and results vary by destination, season and property. We set realistic expectations and measure what each activity brings.",
    youReceive: [
      "A marketing plan matched to your seasons and budget",
      "Social profile setup and a content calendar",
      "Email templates for past guests who have opted in",
      "Paid campaign setup and management, if included in your scope",
      "Reporting on visits and enquiries by source",
    ],
    howItWorks: standardProcess(
      "We review where your guests come from today, agree which channels are worth your effort, set them up, and report on what they produce.",
    ),
    toGetStarted: [
      "Your current social profiles and any email list",
      "Your quiet and busy periods",
      "A realistic monthly budget, if you want paid advertising",
    ],
    seoTitle: "Direct Booking Marketing for Vacation Rentals",
    seoDescription:
      "Social media, email and paid marketing that brings your own audience to your vacation rental website, with honest reporting on what it produces.",
  },
  {
    slug: "multi-property-websites",
    name: "Multi-Property Website Development",
    short: "Multi-property websites",
    summary:
      "One website for a whole portfolio, where guests can search, compare and book across your properties.",
    involves:
      "We build a website for businesses with several properties or units: a searchable collection with filters for dates, location, size and features, a consistent page for each property, and a structure that makes adding the next one straightforward. Where you use a PMS, listings can be drawn from it.",
    whoNeedsIt: [
      "Property managers running rentals for several owners",
      "Operators with multiple units in one building or resort",
      "Growing businesses whose single-property site no longer fits",
    ],
    problem:
      "Managing several properties across separate listings, or separate small websites, multiplies the work and splits your brand. Guests cannot see everything you offer in one place, and a guest whose first choice is unavailable has no easy route to your second.",
    youReceive: [
      "A property collection with search and filters",
      "A consistent, detailed page for every property",
      "Availability across the portfolio where your booking system supports it",
      "An owner-facing page to attract new management clients, if relevant",
      "A simple way to add, edit and remove properties",
    ],
    howItWorks: standardProcess(
      "We map your portfolio and how guests choose between properties, design the search and property pages, then build and load your listings.",
    ),
    toGetStarted: [
      "How many properties and units you manage, and where",
      "Your PMS or channel manager, if you use one",
      "How guests usually choose: by location, size, dates or style",
    ],
    seoTitle: "Multi-Property Vacation Rental Website Development",
    seoDescription:
      "Websites for property managers and multi-property rental businesses: searchable collections, consistent property pages and portfolio-wide availability.",
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
