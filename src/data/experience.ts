export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  badge?: string;
  isCurrent?: boolean;
  highlightMetric?: string;
  summary: string;
  bullets: string[];
  skillsUsed: string[];
}

export const experienceData: ExperienceItem[] = [
  {
    id: "drm-ai-engineer",
    role: "AI Engineer / Full Stack Developer",
    company: "Digital Rise Marketing",
    location: "Mumbai, India",
    period: "May 2026 – Aug 2026",
    badge: "Most Recent",
    isCurrent: true,
    highlightMetric: "10+ Client SaaS Delivered",
    summary:
      "Spearheaded internal AI tooling (EstateFlow CRM & LeadEngine) and engineered production client systems across high-growth domains.",
    bullets: [
      "Architected and deployed two internal automation tools, EstateFlow (custom CRM) and LeadEngine (automated lead discovery & qualification), optimizing client acquisition funnels and resolving mission-critical operational bottlenecks.",
      "Successfully delivered 10+ client SaaS and e-commerce projects spanning jewellery, cosmetics, real estate, and travel verticals with a 100% on-time delivery record.",
      "Designed resilient backend microservices with automated ETL workflows, reducing repetitive data entry tasks for account executives.",
    ],
    skillsUsed: [
      "FastAPI",
      "Next.js",
      "Python",
      "PostgreSQL",
      "LLM Workflows",
      "Automation",
      "Tailwind CSS",
    ],
  },
  {
    id: "sm-ai-apm",
    role: "AI Engineer / Associate Product Manager",
    company: "SM Digital Technologies",
    location: "Mumbai, India",
    period: "Aug 2025 – May 2026",
    badge: "Leadership & Systems",
    isCurrent: false,
    highlightMetric: "60% Reporting Time Cut",
    summary:
      "Owned technical architecture, led a 2-intern engineering team, and engineered LLM financial pipelines cutting reporting turnaround from 3 days to under 8 hours.",
    bullets: [
      "Owned architecture and technical decision-making across all client projects while mentoring and managing a 2-intern engineering team from initial scoping through production release.",
      "Cut financial reporting turnaround time from 3 days to under 8 hours (a 60% manual labor reduction) by designing and shipping an LLM-driven finance analysis pipeline and companion interactive AI chatbots.",
      "Engineered and delivered full e-commerce platforms for enterprise clients including Vimal Jewellers and Ghoomye, integrating secure multi-variant catalog systems.",
      "Built an automated internal lead generation, multi-channel outreach, and proposal generation system alongside a social-listening pipeline tracking competitor activity.",
      "Designed, benchmarked, and deployed high-throughput REST APIs for client production applications prioritizing sub-second response times and zero-downtime upgrades.",
    ],
    skillsUsed: [
      "LLM Pipelines",
      "RAG",
      "FastAPI",
      "React",
      "Team Leadership",
      "System Design",
      "REST APIs",
      "PostgreSQL",
    ],
  },
  {
    id: "sm-swe-intern",
    role: "Software Engineering Intern",
    company: "SM Digital Technologies",
    location: "Mumbai, India",
    period: "Nov 2024 – Feb 2025",
    badge: "Security & Payments",
    isCurrent: false,
    highlightMetric: ">90% Payment Dispute Cut",
    summary:
      "Engineered fraud-resilient payment modules integrating Razorpay with device/location checks, cutting payment disputes by over 90%.",
    bullets: [
      "Built the core payment and billing module for the company's flagship stock and account management SaaS, integrating Razorpay with operating system, device fingerprinting, and geolocation fraud checks.",
      "Reduced payment disputes by more than 90% by architecting an automated unique-code cryptographic verification system executed post-transaction.",
      "Built and deployed the company's flagship portfolio platform, featuring 20+ delivered client projects across finance and business-management systems.",
      "Delivered the end-to-end purchase flow, dynamic pricing calculator, and admin inventory control panel for Vimal Jewellers, supporting 100+ luxury products valued from ₹30K to several lakhs.",
    ],
    skillsUsed: [
      "Razorpay API",
      "Node.js",
      "React",
      "Fraud Detection",
      "PostgreSQL",
      "Security Verification",
    ],
  },
];
