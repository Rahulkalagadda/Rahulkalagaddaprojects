export const person = {
  name: "Rahul Kalagadda",
  initials: "RK",
  roles: ["AI Engineer", "Software Engineer", "Software Developer"],
  location: "Thane, Maharashtra, India",
  email: "rahulkalagadda71@gmail.com",
  github: "https://github.com/Rahulkalagadda",
  linkedin: "https://www.linkedin.com/in/rahul-kalagadda-213373273/",
  intro: "I turn complex ideas into useful software. From conversational AI to full-stack products, I connect thoughtful interfaces with the systems behind them.",
};

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/expertise", label: "Expertise" },
  { href: "/playground", label: "Forest Lab" },
  { href: "/contact", label: "Contact" },
];

export type ProjectCategory = "AI & ML" | "Full stack" | "Interfaces";
export type ProjectVisualKind = "health" | "voice" | "crm" | "travel" | "docs" | "doctor";
export interface PortfolioProject {
  slug: string;
  name: string;
  category: ProjectCategory;
  status: string;
  eyebrow: string;
  description: string;
  tech: string[];
  visual: ProjectVisualKind;
  accent: string;
  repo: string;
  additionalRepo?: string;
  challenge: string;
  approach: string;
  features: { title: string; text: string }[];
  architecture: { title: string; detail: string }[];
  scope: string;
  takeaway: string;
}

export const projects: PortfolioProject[] = [
  {
    slug: "sevasetu-ai",
    name: "SevaSetu AI",
    category: "AI & ML",
    status: "Full-stack application",
    eyebrow: "Healthcare access, with a conversational layer.",
    description: "An AI-assisted healthcare platform connecting multilingual chat, report workflows, scheme discovery, and cached first-aid resources.",
    tech: ["React", "TypeScript", "FastAPI", "Groq", "Supabase", "Qdrant", "FAISS"],
    visual: "health",
    accent: "#9fe8d2",
    repo: "https://github.com/Rahulkalagadda/HealthAIChatbot-LeadSphere",
    challenge: "Healthcare information is scattered across documents, schemes, and everyday questions. The interface needs to help people find a starting point without asking them to navigate all of those systems themselves.",
    approach: "A React interface brings the workflows together. FastAPI routes handle chat and report requests, while retrieval services provide document context to the model. A service worker caches static resources and the first-aid route for subsequent offline access.",
    features: [
      { title: "Conversation with context", text: "The chat route passes recent conversation history, a user identifier, language, and retrieved context to the AI service." },
      { title: "Retrieval in separate layers", text: "Qdrant supports contextual retrieval; the scheme-search service uses FAISS and Fastembed embeddings." },
      { title: "Offline resource caching", text: "The service worker uses network-first navigation and cache-first static assets, including a cached first-aid page." },
    ],
    architecture: [
      { title: "React interface", detail: "Chat, reports, scheme assistance" },
      { title: "FastAPI routes", detail: "Request handling and conversation context" },
      { title: "Retrieval services", detail: "Qdrant / FAISS document context" },
      { title: "Groq + storage", detail: "Model response and Supabase persistence" },
    ],
    scope: "A software showcase of healthcare information workflows. It does not establish clinical accuracy or medical effectiveness. Offline availability depends on resources being cached beforehand.",
    takeaway: "The interesting engineering happens at the boundaries: conversation state, retrieval, storage, and useful behavior when the network disappears.",
  },
  {
    slug: "voice-ai-agent",
    name: "Voice AI Agent",
    category: "AI & ML",
    status: "Integration prototype",
    eyebrow: "From a spoken question to a spoken answer.",
    description: "A speech pipeline that connects transcription, knowledge retrieval, language generation, and synthesized audio, with telephony integration paths.",
    tech: ["Python", "FastAPI", "Groq", "FAISS", "Twilio", "Edge TTS"],
    visual: "voice",
    accent: "#bbb1ff",
    repo: "https://github.com/Rahulkalagadda/Voice-Ai-Agent",
    challenge: "Voice interactions involve more than generating text. Audio input, retrieval, answer generation, and speech output need to work together behind a clear interface.",
    approach: "The audio-processing endpoint accepts an upload, transcribes it with Groq, retrieves knowledge-base context, generates a response, and returns synthesized audio. Separate call-management code provides Twilio integration paths.",
    features: [
      { title: "A complete audio request path", text: "Uploaded speech travels through transcription, retrieval, generation, and text-to-speech before being returned as encoded audio." },
      { title: "Knowledge-aware answers", text: "FAISS and sentence-transformer dependencies support the knowledge-base retrieval layer." },
      { title: "Telephony exploration", text: "Call-management and WebSocket code explore voice-agent use through Twilio, with credentials and provider configuration required." },
    ],
    architecture: [
      { title: "Audio input", detail: "Uploaded speech or telephony entry point" },
      { title: "Transcription", detail: "Groq speech-to-text" },
      { title: "Retrieval + model", detail: "Knowledge context and response generation" },
      { title: "Speech output", detail: "Synthesized audio returned to the client" },
    ],
    scope: "An integration prototype. The repository demonstrates the audio-processing path and telephony code; it does not establish measured latency, call reliability, or production readiness.",
    takeaway: "Each stage has a different failure mode. A good voice system makes those stages observable and keeps their contracts simple.",
  },
  {
    slug: "estateflow-crm",
    name: "EstateFlow CRM",
    category: "Full stack",
    status: "Full-stack application",
    eyebrow: "A clearer view of the next move.",
    description: "A real-estate workspace with lead management, a draggable sales pipeline, role-aware views, and authenticated API communication.",
    tech: ["React", "TypeScript", "Vite", "REST APIs", "JWT"],
    visual: "crm",
    accent: "#ffbf97",
    repo: "https://github.com/Rahulkalagadda/web-crm-production",
    additionalRepo: "https://github.com/Rahulkalagadda/crm-backend-production",
    challenge: "A CRM needs to turn scattered customer activity into a view that people can act on. Pipeline changes must be saved, and the application must respect who can access each view.",
    approach: "The React workspace separates leads, teams, properties, tasks, and reporting. The Kanban pipeline loads stages and leads from the API and persists stage changes. The API client attaches JWTs and coordinates token refresh for concurrent requests.",
    features: [
      { title: "A connected Kanban pipeline", text: "Dragging a lead updates its stage through the API rather than only changing the appearance of the board." },
      { title: "Role-aware navigation", text: "Private and role guards organize access to the workspace and its different responsibilities." },
      { title: "Session continuity", text: "The API client queues requests around refresh-token handling to coordinate authenticated calls." },
    ],
    architecture: [
      { title: "React workspace", detail: "Pipeline, leads, tasks, teams" },
      { title: "Access guards", detail: "Session and role checks" },
      { title: "API client", detail: "JWT headers and refresh queue" },
      { title: "Backend API", detail: "Lead records and stage updates" },
    ],
    scope: "The case study describes implemented frontend workflows and their API connections. No user counts, uptime, or commercial outcomes are claimed.",
    takeaway: "A convincing product interface depends on the less visible details: saved state, session behavior, and permission boundaries.",
  },
  {
    slug: "travel-booking",
    name: "Travel Booking",
    category: "Full stack",
    status: "Application",
    eyebrow: "One starting point for the next destination.",
    description: "A travel application bringing browsing and reservation flows together with account, owner, and administration views.",
    tech: ["Next.js", "TypeScript", "Firebase", "Redux Toolkit"],
    visual: "travel",
    accent: "#d5e4a0",
    repo: "https://github.com/Rahulkalagadda/travel-booking-system",
    challenge: "Travel products combine discovery with account and booking workflows. Those experiences need to stay coherent as visitors move between browsing, reservations, and management views.",
    approach: "The project uses Next.js and TypeScript for the application, Firebase services for backend capabilities, and Redux Toolkit for shared state. The repository organizes customer and management experiences within the same product.",
    features: [
      { title: "Travel discovery", text: "Browsing surfaces organize the destination and travel experience before a visitor reaches a reservation flow." },
      { title: "Reservation interfaces", text: "Booking-oriented views connect discovery with account and reservation steps." },
      { title: "Management views", text: "Owner and administration areas extend the product beyond its customer-facing pages." },
    ],
    architecture: [
      { title: "Next.js application", detail: "Browsing and reservation routes" },
      { title: "Shared state", detail: "Redux Toolkit" },
      { title: "Firebase services", detail: "Application backend capabilities" },
      { title: "Management views", detail: "Owner and administration workflows" },
    ],
    scope: "An application showcase based on the repository structure and dependencies. Supplier settlement, completed real-world bookings, and payment reliability have not been verified.",
    takeaway: "Consistency across discovery, account state, and management matters as much as the individual screens.",
  },
  {
    slug: "internal-docs-assistant",
    name: "Internal Docs Assistant",
    category: "AI & ML",
    status: "API prototype",
    eyebrow: "Exploring a better way to ask your documents.",
    description: "An API architecture for document ingestion and question answering, with integration routes for internal knowledge sources.",
    tech: ["Python", "FastAPI", "LangChain", "Chroma"],
    visual: "docs",
    accent: "#a9caff",
    repo: "https://github.com/Rahulkalagadda/Internal-AI-Assistant-Backend",
    challenge: "Internal knowledge is often spread across tools. A document assistant needs an ingestion boundary and a query boundary before it can offer useful answers.",
    approach: "FastAPI routes outline document ingestion from Notion, Google Docs, and Confluence, alongside a question-answering endpoint. The README describes a Chroma and LangChain retrieval design.",
    features: [
      { title: "Ingestion boundaries", text: "Separate document routes show where knowledge-source integrations belong in the API." },
      { title: "Question-answering contract", text: "The query route outlines how a question reaches a retrieval service." },
      { title: "A visible architectural gap", text: "The public source references service modules that are absent from its tree. That makes this a useful API exploration rather than a complete deployable assistant." },
    ],
    architecture: [
      { title: "Knowledge sources", detail: "Notion, Google Docs, Confluence routes" },
      { title: "Ingestion API", detail: "FastAPI document endpoints" },
      { title: "Retrieval design", detail: "Chroma / LangChain described in README" },
      { title: "Query API", detail: "Question-answering route scaffold" },
    ],
    scope: "The public repository is an API scaffold with missing service implementations. Authentication is also incomplete. It is presented as a prototype, with those boundaries explicit.",
    takeaway: "Clear architecture is a starting point. A deployable system still needs complete services, authentication, evaluation, and integration tests.",
  },
  {
    slug: "doctorease",
    name: "DoctorEase",
    category: "Interfaces",
    status: "UI prototype",
    eyebrow: "Making an appointment feel a little easier.",
    description: "A healthcare interface study with a five-step booking flow and dashboards for patients and clinic teams.",
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    visual: "doctor",
    accent: "#ffb3c7",
    repo: "https://github.com/Rahulkalagadda/doctorease",
    challenge: "Appointment booking should make the next step obvious. A clinic also needs different interfaces for patients, doctors, reception, labs, and administration.",
    approach: "A React application explores those roles through dedicated dashboard pages. The booking interface breaks the task into steps using local state, a mock doctor list, and static appointment slots.",
    features: [
      { title: "A stepped booking interface", text: "Doctor selection, appointment details, and confirmation are arranged into a five-step user flow." },
      { title: "Role-specific screens", text: "Dedicated pages explore the needs of patients, doctors, administrators, lab staff, pharmacists, and receptionists." },
      { title: "Prototype data, clearly scoped", text: "The booking implementation uses mock doctors, static slots, and local state. It does not create a live appointment or send an email." },
    ],
    architecture: [
      { title: "React interface", detail: "Role-specific dashboard pages" },
      { title: "Booking steps", detail: "Progressive appointment form" },
      { title: "Local state", detail: "Selection and confirmation state" },
      { title: "Mock data", detail: "Doctor list and static time slots" },
    ],
    scope: "A UI prototype. The source demonstrates interaction design, not a connected scheduling service or live clinical workflow.",
    takeaway: "A useful prototype exposes the shape of the experience while keeping its data and integration boundaries honest.",
  },
];

export const disciplines = [
  {
    number: "01", title: "AI engineering", subtitle: "Intelligence with a purpose.",
    text: "Conversational products, retrieval pipelines, and voice interfaces that connect models to useful workflows.",
    skills: ["LLM orchestration", "Retrieval augmented generation", "FastAPI", "Groq", "FAISS", "Qdrant", "Python"],
    projectSlugs: ["sevasetu-ai", "voice-ai-agent", "internal-docs-assistant"],
  },
  {
    number: "02", title: "Software engineering", subtitle: "The systems behind the experience.",
    text: "API contracts, authentication flows, application state, and the boundaries that hold a product together.",
    skills: ["REST APIs", "JWT authentication", "PostgreSQL", "Supabase", "Firebase", "System design", "Git"],
    projectSlugs: ["estateflow-crm", "travel-booking"],
  },
  {
    number: "03", title: "Software development", subtitle: "Interfaces people can move through.",
    text: "Responsive web applications, connected dashboards, and carefully considered interactions from first screen to final step.",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Three.js", "Vite", "Redux Toolkit"],
    projectSlugs: ["estateflow-crm", "doctorease", "travel-booking"],
  },
];

export const journey = [
  { period: "May — Aug 2026", role: "AI Engineer / Full Stack Developer", company: "Digital Rise Marketing", text: "AI tooling, CRM workflows, automation, and full-stack client applications." },
  { period: "Aug 2025 — May 2026", role: "AI Engineer / Associate Product Manager", company: "SM Digital Technologies", text: "Application architecture, AI workflows, API development, and product delivery." },
  { period: "Nov 2024 — Feb 2025", role: "Software Engineering Intern", company: "SM Digital Technologies", text: "Payment and billing interfaces, API integrations, and business applications." },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
