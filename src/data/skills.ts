export interface SkillNode {
  id: string;
  name: string;
  category: string;
  level?: "expert" | "advanced" | "proficient";
}

export interface SkillCategory {
  id: string;
  name: string;
  shortName: string;
  description: string;
  color: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "ai-ml",
    name: "AI, LLMs & RAG",
    shortName: "AI / ML",
    description:
      "Production LLM orchestration, hybrid RAG retrieval, vector indexes, deterministic guardrails, and multimodal OCR.",
    color: "#F2A623",
    skills: [
      "LLMs & RAG Architectures",
      "Qdrant Vector DB",
      "FAISS Semantic Search",
      "Groq (LLaMA 3.3 / 3)",
      "Prompt Engineering",
      "Gemini Pro API",
      "Tesseract OCR",
      "Edge-TTS Speech",
      "Signal Detection Theory (SDT)",
      "Data Processing & Cleaning",
    ],
  },
  {
    id: "backend",
    name: "Backend Engineering",
    shortName: "Backend",
    description:
      "High-throughput asynchronous APIs, deterministic business logic, multi-tenant isolation, and background pipelines.",
    color: "#E59819",
    skills: [
      "FastAPI (Python)",
      "Python 3",
      "NestJS",
      "Node.js / Express",
      "RESTful API Design",
      "System Design & Microservices",
      "C++ (Foundational)",
      "AsyncIO & Background Tasks",
    ],
  },
  {
    id: "frontend",
    name: "Frontend & Interfaces",
    shortName: "Frontend",
    description:
      "Reactive developer tools, zero-hydration crash client components, GSAP scroll animations, and Three.js scenes.",
    color: "#F6B344",
    skills: [
      "Next.js (App Router)",
      "React.js & Hooks",
      "TypeScript",
      "Tailwind CSS",
      "GSAP + ScrollTrigger",
      "Three.js (R3F)",
      "State Management",
      "Web Performance & SEO",
    ],
  },
  {
    id: "databases",
    name: "Databases & Storage",
    shortName: "Databases",
    description:
      "Relational databases with Row-Level Security, vector stores, caching layers, and ORM abstractions.",
    color: "#D48B12",
    skills: [
      "PostgreSQL (Supabase)",
      "Qdrant Vector Search",
      "FAISS Vector Index",
      "Redis Caching",
      "MySQL",
      "MongoDB",
      "Prisma ORM",
      "SQLAlchemy",
    ],
  },
  {
    id: "cloud-devops",
    name: "Cloud, DevOps & Infra",
    shortName: "Cloud & DevOps",
    description:
      "Containerization, automated deployment pipelines, edge runtime hosting, and production telemetry.",
    color: "#F7C064",
    skills: [
      "Docker & Containers",
      "Railway Deployments",
      "Vercel Edge Platform",
      "Google Cloud (Firebase, Firestore)",
      "CI/CD Workflows",
      "Git / GitHub Workflows",
      "Linux Server Admin",
    ],
  },
  {
    id: "security",
    name: "Security & Core Concepts",
    shortName: "Security & CS",
    description:
      "Multi-tenant data isolation, cryptographic session management, and foundational computer science rigor.",
    color: "#EAA22B",
    skills: [
      "Row-Level Security (RLS)",
      "JWT Access/Refresh Rotation",
      "Role-Based Access Control (RBAC)",
      "Bcrypt Hashing",
      "Data Structures & Algorithms (DSA)",
      "Object-Oriented Programming (OOP)",
      "Operating Systems & Networking",
    ],
  },
];
