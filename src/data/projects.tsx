export type ProjectCategory = "SaaS" | "E-Commerce" | "Dev Tools" | "DevOps";

export type Project = {
  slug: string;
  number: string;
  name: string;
  category: ProjectCategory;
  title: string;
  description: string;
  pills: string[];
  metrics: { value: string; label: string }[];
  features: string[];
  stack: string[];
  liveUrl?: string;
  githubUrl?: string;
  visual: React.ReactNode;
};

export const PROJECT_CATEGORIES: ("All" | ProjectCategory)[] = [
  "All",
  "SaaS",
  "E-Commerce",
  "Dev Tools",
  "DevOps",
];

const featuredVisual = (
  <svg viewBox="0 0 600 480" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="gFeat" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#06060f" />
        <stop offset="50%" stopColor="#0a1428" />
        <stop offset="100%" stopColor="#081408" />
      </linearGradient>
    </defs>
    <rect width="600" height="480" fill="url(#gFeat)" />
    <g stroke="#00ffb3" fill="none" opacity="0.35">
      <circle cx="300" cy="240" r="200" strokeOpacity="0.18" />
      <circle cx="300" cy="240" r="130" strokeOpacity="0.28" />
      <circle cx="300" cy="240" r="60" strokeOpacity="0.5" />
    </g>
    <g stroke="#ffffff" strokeOpacity="0.08">
      <line x1="0" y1="240" x2="600" y2="240" />
      <line x1="300" y1="0" x2="300" y2="480" />
    </g>
    <polygon points="300,140 380,300 220,300" fill="none" stroke="#00ffb3" strokeOpacity="0.5" />
    <circle cx="300" cy="140" r="5" fill="#00ffb3" />
    <circle cx="380" cy="300" r="5" fill="#7c6fff" />
    <circle cx="220" cy="300" r="5" fill="#ff6b35" />
    <circle cx="120" cy="120" r="3" fill="#00ffb3" opacity="0.6" />
    <circle cx="500" cy="380" r="3" fill="#7c6fff" opacity="0.6" />
    <circle cx="500" cy="120" r="3" fill="#ff3b82" opacity="0.6" />
    <circle cx="120" cy="380" r="3" fill="#00b8ff" opacity="0.6" />
  </svg>
);

const shopnestVisual = (
  <svg viewBox="0 0 400 320" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="gShop" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#180800" />
        <stop offset="100%" stopColor="#2a1000" />
      </linearGradient>
    </defs>
    <rect width="400" height="320" fill="url(#gShop)" />
    <rect x="60" y="80" width="80" height="100" rx="6" fill="none" stroke="#ff6b35" strokeOpacity="0.5" />
    <rect x="160" y="60" width="80" height="120" rx="6" fill="none" stroke="#ff3b82" strokeOpacity="0.5" />
    <rect x="260" y="100" width="80" height="80" rx="6" fill="none" stroke="#ff6b35" strokeOpacity="0.5" />
    <circle cx="100" cy="240" r="6" fill="#ff6b35" />
    <circle cx="200" cy="240" r="6" fill="#ff3b82" />
    <circle cx="300" cy="240" r="6" fill="#ff9c6e" />
  </svg>
);

const devpulseVisual = (
  <svg viewBox="0 0 400 320" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="gDev" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#000714" />
        <stop offset="100%" stopColor="#001428" />
      </linearGradient>
    </defs>
    <rect width="400" height="320" fill="url(#gDev)" />
    <polyline points="40,240 90,180 140,200 190,120 240,150 290,80 340,110 380,60" fill="none" stroke="#00ffb3" strokeWidth="2" />
    <polyline points="40,260 90,230 140,250 190,180 240,200 290,150 340,170 380,130" fill="none" stroke="#00b8ff" strokeWidth="2" opacity="0.7" />
    {[40, 90, 140, 190, 240, 290, 340, 380].map((x, i) => (
      <circle key={i} cx={x} cy={[240, 180, 200, 120, 150, 80, 110, 60][i]} r="4" fill="#00ffb3" />
    ))}
  </svg>
);

const cloudlinkVisual = (
  <svg viewBox="0 0 400 320" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="gCloud" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#08001a" />
        <stop offset="100%" stopColor="#160026" />
      </linearGradient>
    </defs>
    <rect width="400" height="320" fill="url(#gCloud)" />
    <g stroke="#7c6fff" strokeOpacity="0.4" fill="none">
      <line x1="100" y1="100" x2="200" y2="160" />
      <line x1="300" y1="100" x2="200" y2="160" />
      <line x1="200" y1="160" x2="100" y2="240" />
      <line x1="200" y1="160" x2="300" y2="240" />
    </g>
    <rect x="70" y="80" width="60" height="40" rx="6" fill="none" stroke="#00ffb3" />
    <rect x="270" y="80" width="60" height="40" rx="6" fill="none" stroke="#00ffb3" />
    <rect x="170" y="140" width="60" height="40" rx="6" fill="#00ffb3" fillOpacity="0.15" stroke="#00ffb3" />
    <rect x="70" y="220" width="60" height="40" rx="6" fill="none" stroke="#7c6fff" />
    <rect x="270" y="220" width="60" height="40" rx="6" fill="none" stroke="#7c6fff" />
    <circle cx="100" cy="100" r="4" fill="#7c6fff" />
    <circle cx="300" cy="100" r="4" fill="#7c6fff" />
  </svg>
);

export const PROJECTS: Project[] = [
  {
    slug: "buildflow",
    number: "01 · 2024",
    name: "BuildFlow",
    category: "SaaS",
    title: "Full-Stack SaaS Platform",
    description:
      "Complete project management system with real-time collaboration, RBAC, Stripe billing, and a WebSocket notification engine. Serving 200+ active users at 99.9% uptime.",
    pills: ["Next.js 14", "Node.js", "PostgreSQL", "Redis", "Stripe", "WebSockets"],
    metrics: [
      { value: "200+", label: "Active Users" },
      { value: "99.9%", label: "Uptime SLA" },
      { value: "Sub 200ms", label: "P99 Latency" },
    ],
    features: [
      "Real-time collaboration via WebSocket pub/sub",
      "Stripe billing with usage-based pricing tiers",
      "RBAC (Admin/Member/Viewer)",
      "Project analytics with burndown charts",
      "Automated email notifications with React templates",
    ],
    stack: ["Next.js 14", "Node.js", "PostgreSQL", "Redis", "Stripe API", "WebSockets", "Prisma", "AWS S3", "Docker", "Vercel"],
    liveUrl: "#",
    githubUrl: "#",
    visual: featuredVisual,
  },
  {
    slug: "shopnest",
    number: "02 · 2024",
    name: "ShopNest",
    category: "E-Commerce",
    title: "Multi-Vendor E-Commerce",
    description:
      "E-commerce platform with real-time inventory, Razorpay payments, and analytics dashboard.",
    pills: ["React", "Express", "MongoDB", "Razorpay"],
    metrics: [
      { value: "₹50L+", label: "GMV Processed" },
      { value: "0", label: "Production Bugs" },
      { value: "<2s", label: "Load Time" },
    ],
    features: [
      "Real-time inventory sync across variants",
      "Razorpay with refund handling",
      "Multi-vendor commission management",
      "Admin dashboard with live analytics",
      "Mobile-first storefront",
    ],
    stack: ["React", "Express.js", "MongoDB", "Redis", "Razorpay", "Mongoose", "Cloudinary", "Railway"],
    liveUrl: "#",
    githubUrl: "#",
    visual: shopnestVisual,
  },
  {
    slug: "devpulse",
    number: "03 · 2023",
    name: "DevPulse",
    category: "Dev Tools",
    title: "Engineering Analytics",
    description:
      "Developer productivity analytics with GitHub integration and team performance insights.",
    pills: ["TypeScript", "Next.js", "Prisma"],
    metrics: [
      { value: "50+", label: "Teams Using" },
      { value: "1M+", label: "Events Tracked" },
      { value: "<1s", label: "Dashboard Load" },
    ],
    features: [
      "GitHub OAuth + webhook ingestion",
      "PR cycle time analysis",
      "Team velocity tracking",
      "Drag-drop dashboard layouts",
      "Weekly email digest",
    ],
    stack: ["TypeScript", "Next.js 13", "Prisma", "PostgreSQL", "GitHub API", "Chart.js", "Auth.js"],
    liveUrl: "#",
    githubUrl: "#",
    visual: devpulseVisual,
  },
  {
    slug: "cloudlink",
    number: "04 · 2024",
    name: "CloudLink",
    category: "DevOps",
    title: "Microservices Orchestrator",
    description:
      "Microservices orchestration — deploy, monitor, and scale distributed systems from one UI.",
    pills: ["Docker", "AWS", "Nginx", "CI/CD"],
    metrics: [
      { value: "15+", label: "Services Live" },
      { value: "99.5%", label: "Deploy Success" },
      { value: "3min", label: "Zero to Live" },
    ],
    features: [
      "One-command Docker containerization",
      "Multi-cloud deployment (AWS ECS/DigitalOcean)",
      "Real-time health monitoring with alerting",
      "Auto-scaling with cost guardrails",
      "Built-in CI/CD with instant rollback",
    ],
    stack: ["Node.js", "Docker", "AWS ECS", "Nginx", "GitHub Actions", "Prometheus", "Grafana", "Terraform"],
    liveUrl: "#",
    githubUrl: "#",
    visual: cloudlinkVisual,
  },
];
