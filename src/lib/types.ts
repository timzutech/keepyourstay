export type PortfolioCategory = { slug: string; name: string };

export type PortfolioImage = { url: string; alt: string };

export type Project = {
  id?: string;
  slug: string;
  name: string;
  category: PortfolioCategory | null;
  kind: "concept" | "completed";
  summary: string;
  overview: string;
  objectives: string[];
  design_approach: string;
  features: string[];
  services: string[];
  technologies: string[];
  outcomes: string[];
  outcomes_verified: boolean;
  website_url: string | null;
  cover_image: string | null;
  cover_alt: string | null;
  featured: boolean;
  images: PortfolioImage[];
};

export type BlogCategory = { slug: string; name: string };
export type BlogTag = { slug: string; name: string };

export type Post = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  cover_alt: string | null;
  category: BlogCategory | null;
  tags: BlogTag[];
  featured: boolean;
  published_at: string;
  updated_at?: string;
  seo_title: string | null;
  seo_description: string | null;
};

export type Testimonial = {
  id: string;
  quote: string;
  author_name: string;
  author_role: string | null;
  business_name: string | null;
};

export const ENQUIRY_STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal_sent", label: "Proposal Sent" },
  { value: "negotiation", label: "Negotiation" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
] as const;

export const ENQUIRY_TYPES = [
  { value: "contact", label: "Contact request" },
  { value: "project", label: "Project enquiry" },
  { value: "consultation", label: "Consultation request" },
] as const;
