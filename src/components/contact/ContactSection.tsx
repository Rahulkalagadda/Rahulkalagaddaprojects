"use client";

import React, { useState } from "react";
import {
  Mail,
  Github,
  Linkedin,
  Phone,
  Copy,
  Check,
  Send,
  ArrowUpRight,
  Terminal,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { profileData } from "@/data/profile";
import { copyToClipboard } from "@/lib/utils";
import { triggerConfetti } from "@/lib/confetti";
import { useToast } from "../ui/Toast";

export const ContactSection: React.FC = () => {
  const { toast } = useToast();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "AI Systems Engineering / Project Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopyEmail = async () => {
    const success = await copyToClipboard(profileData.email);
    if (success) {
      setCopiedEmail(true);
      triggerConfetti(0.3, 0.8);
      toast(`Copied to clipboard: ${profileData.email}`);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleCopyPhone = async () => {
    const success = await copyToClipboard(profileData.phone);
    if (success) {
      setCopiedPhone(true);
      triggerConfetti(0.3, 0.85);
      toast(`Copied phone: ${profileData.phone}`);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast("Please fill in all required fields", "warning");
      return;
    }

    setIsSubmitting(true);
    triggerConfetti(0.6, 0.7);

    setTimeout(() => {
      setIsSubmitting(false);
      toast("Message dispatched successfully! Opening mail client...");

      const mailtoUrl = `mailto:${profileData.email}?subject=${encodeURIComponent(
        `[Portfolio Contact] ${formData.subject}`
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;
      window.location.href = mailtoUrl;
    }, 600);
  };

  return (
    <section id="contact" className="py-16 md:py-24 border-b border-[#1E1E1E] bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="border-b border-[#1E1E1E] pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-amber">
            <Mail className="w-3.5 h-3.5" />
            <span>COMMUNICATION_CHANNELS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-mono tracking-tight text-foreground">
            Let&apos;s build something
          </h2>
          <p className="text-sm text-muted max-w-2xl font-sans">
            Currently open for AI systems engineering roles, custom RAG/LLM architecture contracts,
            and high-throughput backend development.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Action & Coordinates */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Action Button */}
            <div className="border border-amber/40 rounded-lg p-6 bg-[#111111] space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-amber uppercase tracking-wider">
                  Direct Line
                </span>
                <h3 className="text-xl font-bold font-mono text-foreground">
                  Get in touch directly
                </h3>
                <p className="text-xs text-muted leading-relaxed font-sans">
                  Expect a response within 24 hours regarding technical scoping or interview discussions.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <a
                  href={`mailto:${profileData.email}`}
                  onClick={() => triggerConfetti(0.3, 0.8)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-amber text-[#0A0A0A] font-mono text-xs sm:text-sm font-semibold hover:bg-amber-hover transition-all active:scale-95 border border-amber"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email me</span>
                </a>

                <button
                  onClick={handleCopyEmail}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-[#161616] border border-[#282828] hover:border-amber/60 text-muted hover:text-foreground font-mono text-xs transition-all active:scale-95"
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? (
                    <Check className="w-4 h-4 text-amber" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>{copiedEmail ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Quick Links List */}
            <div className="border border-[#1E1E1E] rounded-lg p-5 bg-[#0E0E0E] space-y-3 font-mono text-xs">
              <div className="text-[11px] text-muted uppercase tracking-wider pb-1 border-b border-[#1A1A1A]">
                Connect & Socials
              </div>

              {/* LinkedIn */}
              <a
                href={profileData.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2 rounded hover:bg-[#161616] text-muted hover:text-foreground transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Linkedin className="w-4 h-4 text-muted group-hover:text-amber transition-colors" />
                  <span>linkedin.com/in/rahul-kalagadda</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-dark group-hover:text-amber" />
              </a>

              {/* GitHub */}
              <a
                href={profileData.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2 rounded hover:bg-[#161616] text-muted hover:text-foreground transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Github className="w-4 h-4 text-muted group-hover:text-amber transition-colors" />
                  <span>github.com/Rahulkalagadda</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-dark group-hover:text-amber" />
              </a>

              {/* Phone */}
              <div
                onClick={handleCopyPhone}
                className="flex items-center justify-between p-2 rounded hover:bg-[#161616] text-muted hover:text-foreground transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-muted group-hover:text-amber transition-colors" />
                  <span>{profileData.phone}</span>
                </div>
                <span className="text-[10px] text-muted-dark group-hover:text-amber">
                  {copiedPhone ? "Copied" : "Click to Copy"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="border border-[#1E1E1E] rounded-lg bg-[#0E0E0E] p-6 sm:p-8 space-y-5">
              <div className="space-y-1">
                <h3 className="font-mono text-sm sm:text-base font-bold text-foreground">
                  Send a Direct Message
                </h3>
                <p className="text-xs text-muted font-sans">
                  Fill out your details below to dispatch an inquiry directly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-muted text-[11px] block">
                      YOUR_NAME <span className="text-amber">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Jane Doe"
                      className="w-full bg-[#141414] border border-[#222222] focus:border-amber rounded-md px-3 py-2 text-foreground placeholder:text-muted/40 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-muted text-[11px] block">
                      YOUR_EMAIL <span className="text-amber">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="jane@company.com"
                      className="w-full bg-[#141414] border border-[#222222] focus:border-amber rounded-md px-3 py-2 text-foreground placeholder:text-muted/40 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted text-[11px] block">SUBJECT</label>
                  <select
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full bg-[#141414] border border-[#222222] focus:border-amber rounded-md px-3 py-2 text-foreground focus:outline-none transition-colors"
                  >
                    <option value="AI Systems Engineering / Project Inquiry">
                      AI Systems Engineering / Project Inquiry
                    </option>
                    <option value="Full-Time Engineering Role">
                      Full-Time Engineering Role
                    </option>
                    <option value="Consulting / Architecture Review">
                      Consulting / Architecture Review
                    </option>
                    <option value="General Technical Discussion">
                      General Technical Discussion
                    </option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted text-[11px] block">
                    PROJECT_DETAILS / MESSAGE <span className="text-amber">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell me about your architecture requirements, scale, or role expectations..."
                    className="w-full bg-[#141414] border border-[#222222] focus:border-amber rounded-md px-3 py-2 text-foreground placeholder:text-muted/40 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="text-[11px] text-muted-dark hidden sm:inline">
                    <span>Response within ~24h</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-amber text-[#0A0A0A] font-semibold hover:bg-amber-hover transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Dispatching...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Inquiry</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
