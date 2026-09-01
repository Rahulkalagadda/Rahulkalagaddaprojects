export interface ProfileData {
  name: string;
  initials: string;
  role: string;
  subheading: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  stats: {
    label: string;
    sub?: string;
  }[];
  availability: {
    status: string;
    description: string;
  };
}

export const profileData: ProfileData = {
  name: "RAHUL KALAGADDA",
  initials: "RK",
  role: "AI Engineer",
  subheading:
    "AI Engineer — LLM & RAG Systems, Backend Engineering, Full-Stack AI Products",
  bio: "Specializing in low-latency LLM orchestration, hybrid RAG retrieval architectures, deterministic policy guardrails, and mission-critical full-stack production systems.",
  location: "Mumbai, India",
  email: "rahulkalagadda71@gmail.com",
  phone: "+91-9022761861",
  linkedin: "https://linkedin.com/in/rahul-kalagadda",
  github: "https://github.com/Rahulkalagadda",
  stats: [
    { label: "10+ projects shipped", sub: "Production SaaS & AI solutions" },
    { label: "3 production AI systems", sub: "Enterprise & clinical deployments" },
    { label: "CGPA 8.74", sub: "BCA · CSMU Navi Mumbai" },
  ],
  availability: {
    status: "Active & Available",
    description: "Open for AI Systems Engineering & Senior Technical Roles",
  },
};
