// Canonical seed data — re-runnable from the admin dashboard.
// Mirrors the original hardcoded content the site shipped with.
import { skillsFallback } from "./skillsFallback";
import { experienceFallback } from "./experienceFallback";
import { testimonialsFallback } from "./testimonialsFallback";

export const SEED_PROJECTS = [
  {
    title: "BuildFlow",
    description:
      "Complete project management system with real-time collaboration, RBAC, Stripe billing, and a WebSocket notification engine. Serving 200+ active users at 99.9% uptime.",
    long_description:
      "Real-time collaboration via WebSocket pub/sub. Stripe billing with usage-based pricing tiers. RBAC (Admin/Member/Viewer). Project analytics with burndown charts. Automated email notifications with React templates.",
    tags: ["buildflow", "Next.js 14", "Node.js", "PostgreSQL", "Redis", "Stripe", "WebSockets"],
    tech_stack: ["Next.js 14", "Node.js", "PostgreSQL", "Redis", "Stripe API", "WebSockets", "Prisma", "AWS S3", "Docker", "Vercel"],
    live_url: "#",
    github_url: "#",
    image_url: null,
    featured: true,
    category: "SaaS",
    sort_order: 0,
    stats: [
      { value: "200+", label: "Active Users" },
      { value: "99.9%", label: "Uptime SLA" },
      { value: "<200ms", label: "P99 Latency" },
    ],
  },
  {
    title: "ShopNest",
    description:
      "E-commerce platform with real-time inventory, Razorpay payments, and analytics dashboard.",
    long_description:
      "Real-time inventory sync across variants. Razorpay with refund handling. Multi-vendor commission management. Admin dashboard with live analytics. Mobile-first storefront.",
    tags: ["shopnest", "React", "Express", "MongoDB", "Razorpay"],
    tech_stack: ["React", "Express.js", "MongoDB", "Redis", "Razorpay", "Mongoose", "Cloudinary", "Railway"],
    live_url: "#",
    github_url: "#",
    image_url: null,
    featured: false,
    category: "E-Commerce",
    sort_order: 1,
    stats: [
      { value: "₹50L+", label: "GMV Processed" },
      { value: "0", label: "Production Bugs" },
      { value: "<2s", label: "Load Time" },
    ],
  },
  {
    title: "DevPulse",
    description:
      "Developer productivity analytics with GitHub integration and team performance insights.",
    long_description:
      "GitHub OAuth + webhook ingestion. PR cycle time analysis. Team velocity tracking. Drag-drop dashboard layouts. Weekly email digest.",
    tags: ["devpulse", "TypeScript", "Next.js", "Prisma"],
    tech_stack: ["TypeScript", "Next.js 13", "Prisma", "PostgreSQL", "GitHub API", "Chart.js", "Auth.js"],
    live_url: "#",
    github_url: "#",
    image_url: null,
    featured: false,
    category: "Dev Tools",
    sort_order: 2,
    stats: [
      { value: "50+", label: "Teams Using" },
      { value: "1M+", label: "Events Tracked" },
      { value: "<1s", label: "Dashboard Load" },
    ],
  },
  {
    title: "CloudLink",
    description:
      "Microservices orchestration — deploy, monitor, and scale distributed systems from one UI.",
    long_description:
      "One-command Docker containerization. Multi-cloud deployment (AWS ECS/DigitalOcean). Real-time health monitoring with alerting. Auto-scaling with cost guardrails. Built-in CI/CD with instant rollback.",
    tags: ["cloudlink", "Docker", "AWS", "Nginx", "CI/CD"],
    tech_stack: ["Node.js", "Docker", "AWS ECS", "Nginx", "GitHub Actions", "Prometheus", "Grafana", "Terraform"],
    live_url: "#",
    github_url: "#",
    image_url: null,
    featured: false,
    category: "DevOps",
    sort_order: 3,
    stats: [
      { value: "15+", label: "Services Live" },
      { value: "99.5%", label: "Deploy Success" },
      { value: "3min", label: "Zero to Live" },
    ],
  },
];

// Strip ids from fallbacks so we insert clean rows (DB will gen_random_uuid).
export const SEED_SKILLS = skillsFallback.map(({ id: _id, ...rest }) => rest);
export const SEED_EXPERIENCE = experienceFallback.map(({ id: _id, ...rest }) => rest);
export const SEED_TESTIMONIALS = testimonialsFallback.map(({ id: _id, ...rest }) => rest);
