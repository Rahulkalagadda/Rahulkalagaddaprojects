export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
  grade: string;
  scoreHighlight: string;
}

export interface AchievementItem {
  title: string;
  subtitle: string;
  description: string;
  tag: string;
}

export const educationData: EducationItem[] = [
  {
    degree: "Bachelor of Computer Applications (BCA)",
    institution: "Chhatrapati Shivaji Maharaj University",
    location: "Navi Mumbai, Maharashtra",
    period: "2023 – 2026",
    grade: "CGPA: 8.74 / 10",
    scoreHighlight: "8.74 CGPA",
  },
  {
    degree: "Higher Secondary Certificate (HSC)",
    institution: "MJ International",
    location: "Badlapur, Maharashtra",
    period: "2022 – 2023",
    grade: "Score: 77%",
    scoreHighlight: "77%",
  },
];

export const achievementsData: AchievementItem[] = [
  {
    title: "2nd Rank — Smart India Hackathon (University Level)",
    subtitle: "Led 5-member engineering team · 36-hour sprint",
    description:
      "Led team to design and build an AI-based automated solution within a continuous 36-hour hackathon sprint, placing 2nd among 30+ competing university engineering teams.",
    tag: "Hackathon Award",
  },
  {
    title: "50+ Public Repositories Shipped",
    subtitle: "AI architectures, full-stack microservices, CRM & automation tools",
    description:
      "Engineered and maintained over 50 public open-source code repositories across GitHub showcasing LLM pipelines, vector search integrations, and enterprise web applications.",
    tag: "Open Source",
  },
  {
    title: "Polyglot Systems Engineering (7+ Languages)",
    subtitle: "TypeScript, Python, C++, JavaScript, Dart, Java, SQL",
    description:
      "Delivered production codebases spanning dynamic full-stack interfaces, asynchronous backend microservices, algorithmic scoring engines, and mobile prototypes.",
    tag: "Engineering",
  },
  {
    title: "5+ Domain Deployments Shipped",
    subtitle: "Healthcare, Real Estate CRM, E-Commerce, Travel, AI Devtools",
    description:
      "Demonstrated cross-domain architecture agility by shipping production systems for clinical psychologists, enterprise real estate brokers, luxury jewellers, and AI support platforms.",
    tag: "Production",
  },
];
