export interface ArchitectureNode {
  id: string;
  label: string;
  sublabel: string;
  type: "input" | "gateway" | "engine" | "database" | "output" | "security";
  highlight?: boolean;
}

export interface ArchitectureFlow {
  from: string;
  to: string;
  label?: string;
}

export interface ProjectCaseStudy {
  id: string;
  name: string;
  tagline: string;
  domain: string;
  liveUrl: string;
  githubUrl?: string;
  tags: string[];
  stats: {
    value: string;
    label: string;
  }[];
  summary: string;
  problem: {
    title: string;
    description: string;
    painPoints: string[];
  };
  approach: {
    title: string;
    description: string;
    keyDecisions: string[];
  };
  whatIBuilt: {
    category: string;
    items: string[];
  }[];
  architecture: {
    title: string;
    description: string;
    nodes: ArchitectureNode[];
    flows: ArchitectureFlow[];
  };
}

export interface ClientDeployment {
  id: string;
  name: string;
  domain: string;
  category: "SaaS & CRM" | "E-Commerce" | "Creative & GSAP" | "AI & Health" | "Enterprise & Travel";
  liveUrl: string;
  githubUrl?: string;
  description: string;
  tags: string[];
  highlight?: boolean;
}

export const projectsData: ProjectCaseStudy[] = [
  {
    id: "datastraw-cx",
    name: "Datastraw CX",
    tagline: "AI Reply Assistant for Customer Support",
    domain: "Enterprise Customer Experience / Multi-tenant LLM",
    liveUrl: "https://ds-cx.vercel.app",
    tags: [
      "FastAPI",
      "React + TypeScript",
      "Qdrant",
      "Supabase (PostgreSQL, RLS)",
      "Groq",
      "Railway",
    ],
    stats: [
      { value: "3", label: "isolated brand tenants" },
      { value: "1–1.3s", label: "reply generation latency" },
      { value: "RAG + Policy", label: "deterministic guardrails" },
    ],
    summary:
      "An enterprise AI copilot that drafts high-fidelity customer support replies using RAG-retrieved brand knowledge and a deterministic policy engine that auto-escalates out-of-policy requests instead of letting the model hallucinate decisions, backed by multi-tenant isolation via Supabase Row-Level Security.",
    problem: {
      title: "Support Hallucination Risk & Multi-Tenant Data Leakage",
      description:
        "Support teams handling high-volume e-commerce requests face costly errors when LLMs hallucinate refund or warranty policies. Traditional chatbots often leak cross-tenant brand rules or fail to abide by strict escalation thresholds.",
      painPoints: [
        "Uncontrolled LLMs approving ungrounded returns or non-compliant refunds",
        "Cross-brand knowledge contamination across multi-tenant SaaS environments",
        "Slow LLM response times (4-6s) degrading live support agent efficiency",
        "Lack of granular observability on token costs, latency spikes, and escalation triggers",
      ],
    },
    approach: {
      title: "Deterministic Guardrails + Multi-Tier LLM Routing",
      description:
        "Engineered a hybrid architecture coupling vector retrieval (Qdrant) with a hard-coded deterministic policy validator executed before model generation. Multi-tenant isolation was enforced at the database level with Supabase RLS.",
      keyDecisions: [
        "Implemented hardcoded policy engine to inspect refund/cancellation rules BEFORE LLM generation, auto-escalating without trusting LLM self-evaluation",
        "Isolated multi-tenant brand data via Supabase PostgreSQL Row-Level Security and tenant-tagged vector spaces in Qdrant",
        "Designed a 3-tier gateway: Groq (primary ultra-fast inference), OpenRouter (failover), and deterministic template fallback for 99.9% uptime",
      ],
    },
    whatIBuilt: [
      {
        category: "LLM & Retrieval Architecture",
        items: [
          "Built an AI copilot drafting customer replies using Qdrant hybrid semantic search over tenant knowledge bases.",
          "Constructed a multi-tier LLM gateway (Groq LLaMA 3.3 primary, OpenRouter failover, deterministic rule-based fallback) delivering grounded answers in 1.0–1.3s.",
          "Configured token-efficient prompt pipelines caching repetitive system prompts to trim per-request costs.",
        ],
      },
      {
        category: "Policy Engine & Multi-Tenancy",
        items: [
          "Designed a deterministic policy engine checking return, refund, and cancellation policies before generation, immediately escalating to supervisors.",
          "Implemented strict tenant isolation using Supabase PostgreSQL Row-Level Security (RLS) and per-brand vector metadata filters across 3 isolated brand tenants.",
          "Built a human-in-the-loop agent review interface requiring explicit human approval before external dispatch.",
        ],
      },
      {
        category: "Observability & Platform",
        items: [
          "Developed a real-time observability telemetry view tracking token consumption, p95/p99 latency metrics, and escalation frequencies.",
          "Shipped high-performance React + TypeScript frontend with reactive agent suggestions and keyboard shortcuts.",
          "Deployed FastAPI microservice backend on Railway with automated health probes and CI/CD pipelines.",
        ],
      },
    ],
    architecture: {
      title: "Datastraw CX Zero-Trust RAG Pipeline",
      description:
        "Customer inbound triggers tenant verification, hybrid vector lookup, deterministic policy validation, and multi-tier LLM generation.",
      nodes: [
        {
          id: "inbound",
          label: "Inbound Support Ticket",
          sublabel: "Zendesk / Intercom / Email API",
          type: "input",
        },
        {
          id: "gateway",
          label: "FastAPI Gateway + RLS",
          sublabel: "Supabase JWT & Tenant Isolation",
          type: "gateway",
          highlight: true,
        },
        {
          id: "vector",
          label: "Qdrant Hybrid Search",
          sublabel: "Per-tenant brand vector index",
          type: "database",
        },
        {
          id: "policy",
          label: "Deterministic Policy Engine",
          sublabel: "Refund / Return hard rules",
          type: "security",
          highlight: true,
        },
        {
          id: "llm",
          label: "Multi-Tier LLM Gateway",
          sublabel: "Groq (1.1s) -> OpenRouter -> Fallback",
          type: "engine",
        },
        {
          id: "agent",
          label: "Agent-in-the-Loop UI",
          sublabel: "Human review & 1-click dispatch",
          type: "output",
        },
      ],
      flows: [
        { from: "inbound", to: "gateway", label: "Ticket payload" },
        { from: "gateway", to: "vector", label: "Tenant context" },
        { from: "vector", to: "policy", label: "Matched guidelines" },
        { from: "policy", to: "llm", label: "Verified prompt" },
        { from: "llm", to: "agent", label: "Drafted reply" },
      ],
    },
  },
  {
    id: "sevasetu",
    name: "SevaSetu",
    tagline: "Multilingual AI Health Assistant & OCR Triage",
    domain: "Healthcare AI / Multilingual RAG / Vision OCR",
    liveUrl: "https://health-ai-chatbot-amber.vercel.app",
    tags: [
      "Python",
      "FastAPI",
      "Next.js",
      "Groq LLMs",
      "RAG",
      "FAISS",
      "PostgreSQL",
      "JWT",
    ],
    stats: [
      { value: "Multilingual", label: "text & voice interface" },
      { value: "OCR Reader", label: "blood tests, X-rays, lab docs" },
      { value: "RAG + FAISS", label: "low-latency medical lookup" },
    ],
    summary:
      "A specialized healthcare assistant built for rural and semi-urban populations, empowering users to describe symptoms in vernacular languages via text or voice, process complex diagnostic lab reports and X-rays via OCR into plain language, and receive verified nearby clinic referrals and disease outbreak alerts.",
    problem: {
      title: "Language Barriers & Opaque Diagnostic Lab Reports",
      description:
        "Rural and semi-urban patients face immense hurdles understanding technical laboratory reports, medical terminology, and prescription directions. Existing symptom checkers are English-centric and fail to handle regional dialects or document scans.",
      painPoints: [
        "Inability of vernacular speakers to comprehend complex pathological lab values",
        "High barrier of entry for typing medical symptoms (requiring voice recognition)",
        "Lack of automated localization connecting patients to nearby operational clinics",
        "Delayed alerts during regional viral and seasonal health outbreaks",
      ],
    },
    approach: {
      title: "Vernacular Multimodal Pipeline with Grounded FAISS Retrieval",
      description:
        "Combined Tesseract OCR document extraction and speech interfaces with FAISS vector indexing over medical knowledge bases. Enforced clinical disclaimer boundaries and emergency escalation triggers.",
      keyDecisions: [
        "Adopted FAISS for instant local vector search without external cloud latency overheads",
        "Integrated Groq high-throughput LLaMA models for sub-second vernacular translation and plain-language summarization",
        "Architected dual-layer verification: OCR text extraction paired with automated confidence scoring to flag degraded scan inputs",
      ],
    },
    whatIBuilt: [
      {
        category: "Multilingual & Voice Interface",
        items: [
          "Built a voice-enabled conversational assistant allowing rural users to speak or type symptoms in regional languages.",
          "Integrated Edge-TTS and Groq LLMs for natural vernacular voice output and empathetic guidance.",
          "Designed automated triage classification flagging emergency red flags (chest pain, acute trauma) directly to emergency lines.",
        ],
      },
      {
        category: "OCR Medical Report Processing",
        items: [
          "Engineered an OCR-based report reader processing blood tests, CBC panels, X-rays, and prescription slips into accessible plain language.",
          "Programmed automatic anomaly detection highlighting out-of-range clinical metrics (hemoglobin, glucose, platelet counts).",
          "Implemented FAISS semantic search retrieval over vetted health protocols to contextualize report anomalies safely.",
        ],
      },
      {
        category: "Security & Regional Health Alerting",
        items: [
          "Implemented JWT-secured user sessions with PostgreSQL for encrypted patient health logs and authentication.",
          "Developed an integrated nearby-clinic locator mapped to local health centers and emergency services.",
          "Built an automated outbreak notification module broadcasting preventive alerts from government health bodies.",
        ],
      },
    ],
    architecture: {
      title: "SevaSetu Multilingual Health Triage Flow",
      description:
        "Vernacular voice/text or scanned document uploads are processed through OCR/speech pipelines, FAISS medical retrieval, and structured vernacular guidance generation.",
      nodes: [
        {
          id: "input",
          label: "Voice / Text / Report Upload",
          sublabel: "Vernacular audio or lab PDF/image",
          type: "input",
        },
        {
          id: "ocr",
          label: "OCR & Speech Preprocessing",
          sublabel: "Tesseract OCR + Audio transcription",
          type: "engine",
          highlight: true,
        },
        {
          id: "faiss",
          label: "FAISS Vector Index",
          sublabel: "Curated clinical knowledge base",
          type: "database",
        },
        {
          id: "reasoning",
          label: "Groq Multilingual LLM",
          sublabel: "Plain-language medical synthesis",
          type: "engine",
          highlight: true,
        },
        {
          id: "locator",
          label: "Clinic Locator & Outbreak Engine",
          sublabel: "Geo-spatial query + Gov alerts",
          type: "gateway",
        },
        {
          id: "response",
          label: "Vernacular Audio & Summary UI",
          sublabel: "Accessible patient dashboard",
          type: "output",
        },
      ],
      flows: [
        { from: "input", to: "ocr", label: "Raw scan / voice" },
        { from: "ocr", to: "faiss", label: "Extracted entities" },
        { from: "faiss", to: "reasoning", label: "Grounded context" },
        { from: "reasoning", to: "locator", label: "Triage recommendation" },
        { from: "locator", to: "response", label: "Localized response" },
      ],
    },
  },
  {
    id: "cognitive-assessment",
    name: "Cognitive Assessment Platform",
    tagline: "Clinical Neuropsychological Evaluation Engine",
    domain: "Clinical Psychology / Signal Detection Theory / Resilient Web Tasks",
    liveUrl: "https://cognitive-function-by-drm.vercel.app",
    tags: [
      "Python",
      "FastAPI",
      "Next.js",
      "PostgreSQL (Supabase)",
      "Railway",
    ],
    stats: [
      { value: "11-task", label: "clinical assessment battery" },
      { value: "5 areas", label: "cognitive domains evaluated" },
      { value: "SDT Math", label: "deterministic explainable scoring" },
    ],
    summary:
      "A comprehensive 11-task clinical cognitive assessment platform built for a practicing clinical psychologist at a Mumbai hospital. Evaluates 5 core cognitive domains using Signal Detection Theory (d' and response bias) and regression vigilance tracking to ensure 100% explainable diagnostic metrics, with native React components eliminating SSR hydration crashes.",
    problem: {
      title: "Black-Box Scoring Invalidation & Runtime Task Failures",
      description:
        "Clinical psychologists require mathematically auditable and explainable metrics (d', c criterion, vigilance slope) rather than opaque ML classifiers when diagnosing neurological conditions. Furthermore, third-party assessment widgets caused DOM-injecting hydration crashes during live patient testing.",
      painPoints: [
        "Clinicians unable to defend opaque black-box machine learning scores in diagnostic reports",
        "Patient session crashes caused by DOM-manipulating legacy test libraries during SSR hydration",
        "Unreliable score contamination caused by patient disengagement, fatigue, or random guessing",
        "Unsecured test sharing exposing clinical batteries to unauthorized participants",
      ],
    },
    approach: {
      title: "Signal Detection Theory Engine + Zero-Crash Native Components",
      description:
        "Replaced speculative ML with rigorous mathematical formulations of Signal Detection Theory (SDT) to isolate true perceptual sensitivity from response bias. Rebuilt all 11 psychological test tasks from scratch in pure React.",
      keyDecisions: [
        "Implemented Signal Detection Theory (d' sensitivity index and beta/c response bias) for mathematically rigorous, auditable scoring",
        "Engineered regression-based vigilance tracking over test progression to quantify attention decay over time",
        "Rebuilt all 11 psychometric tasks as 100% native React client components with strict lifecycle control, eliminating SSR hydration crashes",
        "Invented an automated confidence score algorithm flagging guessed or disengaged sessions before clinician review",
      ],
    },
    whatIBuilt: [
      {
        category: "Clinical Assessment Suite",
        items: [
          "Built an 11-task cognitive battery evaluating 5 domains: sustained attention, divided attention, executive function, impulsivity, and working memory.",
          "Engineered precision timing mechanisms capturing reaction times down to millisecond accuracy across diverse browsers.",
          "Implemented self-expiring assessment tokens and secure patient links preventing unauthorized retakes.",
        ],
      },
      {
        category: "Deterministic Scoring Engine",
        items: [
          "Developed scoring algorithms using Signal Detection Theory (d' and response bias) and linear regression vigilance tracking.",
          "Integrated automated disengagement detection to flag sessions with abnormal reaction variances or chance-level hit rates.",
          "Generated instant clinician diagnostic reports visualizing normative percentiles and domain-specific cognitive profiles.",
        ],
      },
      {
        category: "Architecture & Frontend Engineering",
        items: [
          "Re-architected all 11 assessment tasks as native React components, completely resolving SSR hydration issues from legacy DOM-injecting libraries.",
          "Engineered doctor and patient dashboards on Next.js and Supabase PostgreSQL with real-time session progress streaming.",
          "Deployed on Railway and Vercel with zero runtime crashes across real-world patient evaluations.",
        ],
      },
    ],
    architecture: {
      title: "Cognitive Assessment Pipeline & SDT Engine",
      description:
        "Time-locked patient tasks stream millisecond telemetry to the deterministic Signal Detection Theory engine for clinical report generation.",
      nodes: [
        {
          id: "link",
          label: "Self-Expiring Patient Link",
          sublabel: "Cryptographic single-use token",
          type: "security",
        },
        {
          id: "tasks",
          label: "11 Native React Tasks",
          sublabel: "Reaction time & stimulus capture",
          type: "input",
          highlight: true,
        },
        {
          id: "sdt",
          label: "Signal Detection Engine",
          sublabel: "d' sensitivity & response bias c",
          type: "engine",
          highlight: true,
        },
        {
          id: "confidence",
          label: "Disengagement Detector",
          sublabel: "Variance & fatigue filter",
          type: "security",
        },
        {
          id: "supabase",
          label: "Supabase Database",
          sublabel: "Encrypted clinical profiles",
          type: "database",
        },
        {
          id: "report",
          label: "Clinician Diagnostic Portal",
          sublabel: "Explainable charts & PDF export",
          type: "output",
        },
      ],
      flows: [
        { from: "link", to: "tasks", label: "Authenticated launch" },
        { from: "tasks", to: "sdt", label: "Millisecond event stream" },
        { from: "sdt", to: "confidence", label: "Computed metrics" },
        { from: "confidence", to: "supabase", label: "Validated assessment" },
        { from: "supabase", to: "report", label: "Diagnostic summary" },
      ],
    },
  },
];

export const clientDeploymentsData: ClientDeployment[] = [
  {
    id: "web-crm-production",
    name: "EstateFlow CRM / Web CRM",
    domain: "Enterprise Real Estate CRM & Lead Automations",
    category: "SaaS & CRM",
    liveUrl: "https://web-crm-production.vercel.app",
    githubUrl: "https://github.com/Rahulkalagadda/web-crm-production",
    description:
      "Enterprise lead qualification and deal stage tracking CRM built with automated lead discovery pipelines, status tracking, customer interaction logs, and analytics.",
    tags: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL", "Tailwind CSS"],
    highlight: true,
  },
  {
    id: "candere-vimal-mvp",
    name: "Candere / Vimal Jewellers MVP",
    domain: "Luxury E-Commerce & Dynamic Pricing",
    category: "E-Commerce",
    liveUrl: "https://candere-vimal-mvp-gw4u.vercel.app",
    description:
      "High-ticket luxury jewellery e-commerce platform supporting 100+ items (₹30K–₹5L+), multi-variant dynamic pricing calculations, and admin inventory control.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "E-Commerce"],
    highlight: true,
  },
  {
    id: "cosmetics-by-drm",
    name: "Cosmetics by DRM",
    domain: "Beauty & Personal Care E-Commerce",
    category: "E-Commerce",
    liveUrl: "https://cosmeticsbydrm.vercel.app",
    githubUrl: "https://github.com/Rahulkalagadda/cosmeticsbydrm",
    description:
      "Modern cosmetic brand storefront with interactive shade visualizers, multi-SKU bundle selectors, responsive catalog filtering, and high-conversion purchase flow.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "UI/UX"],
  },
  {
    id: "realestate-by-drm",
    name: "Real Estate Platform DRM",
    domain: "Luxury Property Discovery & Listing",
    category: "SaaS & CRM",
    liveUrl: "https://realestatepagebydrm-o4dl.vercel.app",
    githubUrl: "https://github.com/Rahulkalagadda/Realestatepagebydrm",
    description:
      "High-conversion luxury property showcase with interactive floorplan previews, amenity filters, neighborhood scoring, and direct agent inquiry capture.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Lead Gen"],
  },
  {
    id: "gsap-cocktails",
    name: "GSAP Cocktails Experience",
    domain: "Kinetic Web & Scroll-Driven Animation",
    category: "Creative & GSAP",
    liveUrl: "https://gsap-cocktails.vercel.app",
    description:
      "Fluid scroll-driven interactive cocktail experience engineered with GSAP ScrollTrigger, kinetic typography, dynamic bottle assembly, and zero lag 60fps animations.",
    tags: ["GSAP", "ScrollTrigger", "React", "Tailwind CSS", "Micro-animations"],
    highlight: true,
  },
  {
    id: "health-ai-chatbot",
    name: "SevaSetu Health AI Chatbot",
    domain: "Multilingual AI Triage & Clinical OCR",
    category: "AI & Health",
    liveUrl: "https://health-ai-chatbot-amber.vercel.app",
    description:
      "Multilingual health assistant allowing vernacular symptom input via voice/text, automated OCR lab report extraction, FAISS vector search, and emergency outbreak alerts.",
    tags: ["FastAPI", "Groq LLMs", "FAISS", "RAG", "Next.js", "PostgreSQL"],
    highlight: true,
  },
  {
    id: "dua-kitchens",
    name: "Dua Kitchens",
    domain: "Commercial & Modular Interior Suite",
    category: "E-Commerce",
    liveUrl: "https://dua-kitchens.vercel.app",
    githubUrl: "https://github.com/Rahulkalagadda/dua-kitchens",
    description:
      "Modular kitchen customizer platform with finish/material selectors, layout estimators, commercial quotation engine, and client project portfolios.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Customizer"],
  },
  {
    id: "mitticool",
    name: "Mitticool Clayware Platform",
    domain: "Traditional Eco Clay E-Commerce",
    category: "E-Commerce",
    liveUrl: "https://mitticool.vercel.app",
    githubUrl: "https://github.com/Rahulkalagadda/mitticool",
    description:
      "Full-stack artisanal clayware e-commerce store with persistent cart states, multi-variant dimensions, customer reviews, and responsive checkout.",
    tags: ["Next.js", "React", "Tailwind CSS", "Cart State"],
  },
  {
    id: "ghoomye-productpage",
    name: "Ghoomye Product Experience",
    domain: "Travel Luggage & Gear Product Experience",
    category: "Enterprise & Travel",
    liveUrl: "https://ghoomeye-productpage.vercel.app",
    description:
      "Interactive product launch showcase for premium travel gear featuring 360-degree feature callouts, material specs, and conversion-optimized purchase flows.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Interactive UX"],
  },
  {
    id: "hmskt-tech",
    name: "HMSKT Tech",
    domain: "Enterprise Technology & Cloud Services",
    category: "Enterprise & Travel",
    liveUrl: "https://hmskt-tech.vercel.app",
    githubUrl: "https://github.com/Rahulkalagadda/hmskt-tech",
    description:
      "Corporate tech consultancy portal featuring solution architecture matrices, enterprise case studies, cloud transformation roadmaps, and inquiry routing.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Enterprise"],
  },
  {
    id: "travelcars-drm",
    name: "TravelCars Fleet DRM",
    domain: "Fleet Booking & Travel Reservation",
    category: "Enterprise & Travel",
    liveUrl: "https://travelcars-drm.vercel.app",
    githubUrl: "https://github.com/Rahulkalagadda/travelcars-drm",
    description:
      "Fleet rental and booking platform with dynamic route distance calculators, live fleet availability, driver allocation, and instant WhatsApp booking dispatch.",
    tags: ["Next.js", "React", "Tailwind CSS", "Fleet Logistics"],
  },
];
