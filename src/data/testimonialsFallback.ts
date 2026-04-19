export type DbTestimonial = {
  id: string;
  quote: string;
  name: string;
  role: string | null;
  company: string | null;
  avatar_url: string | null;
  linkedin_url: string | null;
  sort_order: number;
};

// Mirrors the hardcoded T list in Testimonials.tsx.
export const testimonialsFallback: DbTestimonial[] = [
  {
    id: "t1",
    quote:
      "Sandeep doesn't just deliver features — he delivers systems. The architecture he designed handled 10x expected traffic on launch day without a single incident.",
    name: "Rahul M.",
    role: "CTO",
    company: "TechVenture India",
    avatar_url: null,
    linkedin_url: null,
    sort_order: 0,
  },
  {
    id: "t2",
    quote:
      "Best freelance developer I've worked with. He asked the right questions before writing a line of code. Shipped ahead of schedule with zero production bugs.",
    name: "Priya S.",
    role: "Founder",
    company: "E-Commerce Startup",
    avatar_url: null,
    linkedin_url: null,
    sort_order: 1,
  },
  {
    id: "t3",
    quote:
      "Sandeep's code is as clean as his communication. He understood our business logic better than we did. Will hire again without question.",
    name: "Alex K.",
    role: "PM",
    company: "SaaS Company",
    avatar_url: null,
    linkedin_url: null,
    sort_order: 2,
  },
];
