export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "What does KeepYourStay do?",
    a: "We design and build websites for short-term rental businesses. That includes the design itself, booking calendars, payment integration, connections to property management systems, search visibility and ongoing maintenance. The aim is to give your property a professional online presence and a booking channel that belongs to you.",
  },
  {
    q: "Do I need an existing website?",
    a: "No. Many of our clients start with nothing but their listings on booking platforms. If you do have a website, we can review it and either improve it or rebuild it, depending on what makes more sense.",
  },
  {
    q: "Can you build a website for one property?",
    a: "Yes. A single villa, cabin, apartment or beach house can have a complete website with its own domain, gallery, availability calendar and booking or enquiry flow.",
  },
  {
    q: "Can you build websites for multiple properties?",
    a: "Yes. For property managers and owners with several rentals we build one website with a searchable collection, a page for every property, and a structure that makes it simple to add more.",
  },
  {
    q: "Can you integrate booking calendars?",
    a: "In most cases, yes. We can connect an availability calendar to your website and synchronise it with your other channels using your property management system, a booking tool, or iCal feeds. The right method depends on the systems you use, and each has different update speeds, which we explain before you decide.",
  },
  {
    q: "Can you integrate payment systems?",
    a: "Yes, where a suitable payment provider is available in your country and works with your booking setup. Card details are handled by the payment provider, not stored on your website. Providers charge processing fees, so we help you account for those.",
  },
  {
    q: "Can you connect my PMS?",
    a: "It depends on your property management system. Some provide an API or a booking engine that connects well to a custom website; others are more limited, or only allow it on certain plans. We check what your system supports before we quote, and tell you plainly what can and cannot be connected.",
  },
  {
    q: "Can I keep using Airbnb and other booking platforms?",
    a: "Yes, and most owners should. A website of your own works alongside the platforms as an additional channel. Bookings and enquiries that begin on a platform should stay on that platform, in line with its terms. Your website is for guests who find you independently: through search, social media, referrals, or a return visit.",
  },
  {
    q: "Will a website guarantee direct bookings?",
    a: "No. A website is one part of a direct-booking strategy. Whether guests book through it depends on how many people visit, your marketing, your reputation and reviews, your pricing and availability, and how trustworthy and easy the booking experience is. We build the website to do its part well and are honest about the rest.",
  },
  {
    q: "How much does a website cost?",
    a: "Every project is quoted individually, because a single-property site with an enquiry form is a very different piece of work from a multi-property site connected to a PMS with online payment. After a short consultation we send a written quotation in US dollars or pounds sterling.",
  },
  {
    q: "How long does a project take?",
    a: "It depends on the scope and on how quickly content, photographs and system access are available. We give you a timeline with your quotation, once we know what is involved, rather than a generic estimate here.",
  },
  {
    q: "Do you provide maintenance?",
    a: "Yes. We offer ongoing maintenance covering updates, backups, checks on forms and booking flows, and content changes. It is optional and quoted separately.",
  },
  {
    q: "Can you redesign my existing website?",
    a: "Yes. We review what you have, keep what works, and rebuild what does not. We also set up redirects from old page addresses so existing links and search listings continue to work.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes. We work with rental businesses worldwide, with most of our focus on the United States, United Kingdom, Canada and Australia. Consultations happen by video call, email or WhatsApp, and we quote in USD or GBP.",
  },
];

export const homeFaqs = faqs.filter((_, i) => [3, 7, 8, 9, 6].includes(i));
