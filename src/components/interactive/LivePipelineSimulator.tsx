"use client";

import React, { useState } from "react";
import {
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Database,
  Server,
  Zap,
  CheckCircle2,
  Terminal,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { triggerConfetti } from "@/lib/confetti";
import { cn } from "@/lib/utils";

interface Scenario {
  id: string;
  title: string;
  system: "Datastraw CX" | "SevaSetu" | "Cognitive SDT";
  inputLabel: string;
  inputText: string;
  steps: {
    name: string;
    duration: number;
    status: "ok" | "escalated" | "computed";
    detail: string;
  }[];
  finalOutput: {
    status: "ESCALATED_SUPERVISOR" | "TRIAGE_VERIFIED" | "SDT_EXPLAINABLE_METRICS";
    badgeText: string;
    badgeColor: string;
    totalLatency: string;
    cost: string;
    summary: string;
    metrics?: Record<string, string>;
  };
}

const SCENARIOS: Scenario[] = [
  {
    id: "datastraw-refund",
    title: "Datastraw CX: Out-of-Policy Refund Request",
    system: "Datastraw CX",
    inputLabel: "Inbound Customer Ticket (Zendesk)",
    inputText:
      "Customer: 'I bought this camera 48 days ago, opened the box, used it on a trip, and now I want a 100% cash refund without receipt.'",
    steps: [
      {
        name: "FastAPI Gateway + Supabase RLS",
        duration: 18,
        status: "ok",
        detail: "Tenant brand context verified (Brand ID: 0x88F). RLS tenant isolation active.",
      },
      {
        name: "Qdrant Hybrid Vector Search",
        duration: 84,
        status: "ok",
        detail: "Retrieved 3 tenant policy chunks: 'Returns strictly allowed within 30 days unopened'.",
      },
      {
        name: "Deterministic Policy Validator",
        duration: 32,
        status: "escalated",
        detail: "RULE_TRIGGER: Request exceeds 30-day max + opened box. Escalation enforced before LLM call.",
      },
      {
        name: "Groq LLaMA 3.3 Draft + Supervisor Queue",
        duration: 410,
        status: "escalated",
        detail: "Drafted polite refusal + routed ticket directly to Tier-2 Support Supervisor.",
      },
    ],
    finalOutput: {
      status: "ESCALATED_SUPERVISOR",
      badgeText: "AUTO-ESCALATED (Zero Hallucination)",
      badgeColor: "text-amber border-amber/40 bg-amber/10",
      totalLatency: "1.12s",
      cost: "$0.00018 / query",
      summary:
        "Deterministic policy guardrails prevented LLM from hallucinating unauthorized refund approval. Polite standard policy response drafted and pinned for human supervisor sign-off.",
      metrics: {
        "Policy Rule Match": "100% Deterministic",
        "Tenant Leakage": "0.00% (RLS Verified)",
        "Human in the Loop": "Required",
      },
    },
  },
  {
    id: "sevasetu-ocr",
    title: "SevaSetu: Low-Platelet CBC Report Analysis",
    system: "SevaSetu",
    inputLabel: "Patient Report Upload (Image / Scan)",
    inputText:
      "Scanned Lab Slip: 'Platelet Count: 82,000 / μL (Ref Range: 150,000 - 450,000)'. Marathi voice note attached.",
    steps: [
      {
        name: "Tesseract OCR & Audio Transcription",
        duration: 110,
        status: "ok",
        detail: "OCR extracted numeric platelet count (82,000 / μL). Marathi voice query parsed.",
      },
      {
        name: "FAISS Clinical Vector Retrieval",
        duration: 45,
        status: "ok",
        detail: "Matched clinical protocol: 'Thrombocytopenia Tier 2 triage & hydration guidance'.",
      },
      {
        name: "Groq Vernacular Synthesis",
        duration: 380,
        status: "ok",
        detail: "Generated plain-language Marathi & Hindi summary explaining results without medical jargon.",
      },
      {
        name: "Local Clinic Geo-Dispatcher",
        duration: 65,
        status: "ok",
        detail: "Located nearest operational PHC clinic with pathology equipment (2.4 km away).",
      },
    ],
    finalOutput: {
      status: "TRIAGE_VERIFIED",
      badgeText: "PLAIN LANGUAGE VERNACULAR REPORT",
      badgeColor: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
      totalLatency: "0.89s",
      cost: "$0.00012 / query",
      summary:
        "Extracted low platelet warning in plain language, avoided panic, and dispatched nearest government health clinic coordinates with emergency precautions.",
      metrics: {
        "OCR Confidence": "98.4%",
        "Language": "Marathi / Hindi / English",
        "Clinic Referrals": "1 Available (2.4 km)",
      },
    },
  },
  {
    id: "cognitive-sdt",
    title: "Cognitive Assessment: Neuropsych SDT Scoring",
    system: "Cognitive SDT",
    inputLabel: "Patient Telemetry Event Stream",
    inputText:
      "11-Task Rapid Visual Continuous Performance Test (RVCPT): 96 Target Hits, 14 False Alarms, 340ms Median RT.",
    steps: [
      {
        name: "Task Timing Telemetry Stream",
        duration: 22,
        status: "ok",
        detail: "Millisecond reaction timestamps verified across all 11 native React client tasks.",
      },
      {
        name: "Signal Detection Theory (SDT) Math",
        duration: 15,
        status: "computed",
        detail: "Computed sensitivity d' = 2.48 and response bias criterion c = +0.14.",
      },
      {
        name: "Linear Regression Vigilance Tracking",
        duration: 18,
        status: "computed",
        detail: "Quantified attention slope over 12-minute session: Slope = -0.024 (Normal fatigue decay).",
      },
      {
        name: "Disengagement & Guessing Filter",
        duration: 12,
        status: "computed",
        detail: "Variance analysis passed. Zero guessing artifacts. Diagnostic session verified.",
      },
    ],
    finalOutput: {
      status: "SDT_EXPLAINABLE_METRICS",
      badgeText: "100% EXPLAINABLE MATHEMATICAL SCORING",
      badgeColor: "text-amber border-amber/40 bg-amber/10",
      totalLatency: "0.067s",
      cost: "$0.00 (Zero API calls / Native Math)",
      summary:
        "Deterministic psychometric evaluation completed with zero black-box ML opacity. Clinician diagnostic report generated instantly with normative percentiles.",
      metrics: {
        "Perceptual Sensitivity (d')": "2.48 (High)",
        "Response Bias (c)": "+0.14 (Conservative)",
        "Session Confidence Score": "99.2% (Clinically Valid)",
      },
    },
  },
];

export const LivePipelineSimulator: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [isCompleted, setIsCompleted] = useState(false);

  const runSimulation = () => {
    setIsRunning(true);
    setIsCompleted(false);
    setActiveStepIndex(0);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current < selectedScenario.steps.length) {
        setActiveStepIndex(current);
      } else {
        clearInterval(interval);
        setActiveStepIndex(selectedScenario.steps.length);
        setIsRunning(false);
        setIsCompleted(true);
        triggerConfetti(0.5, 0.6);
      }
    }, 450);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setActiveStepIndex(-1);
    setIsCompleted(false);
  };

  return (
    <div className="rounded-2xl bg-surface/50 border border-hairline p-5 sm:p-7 space-y-5 my-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline/60 pb-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 font-mono text-xs text-amber font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>INTERACTIVE_SANDBOX</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-foreground">
            Live AI Telemetry & RAG Sandbox
          </h3>
          <p className="text-xs text-muted max-w-xl font-sans">
            Simulate packet flow across deterministic guardrails, vector retrieval, and inference latency.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={resetSimulation}
            disabled={isRunning || activeStepIndex === -1}
            className="p-2 rounded-full bg-surface border border-hairline text-muted hover:text-foreground disabled:opacity-30 text-xs font-mono transition-all"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber text-[#0A0A0A] font-mono text-xs font-bold hover:bg-amber-hover transition-all hover:scale-105 shadow-sm disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? "Running..." : "Run Simulation"}</span>
          </button>
        </div>
      </div>

      {/* Scenario Selector Pills */}
      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map((sc) => (
          <button
            key={sc.id}
            onClick={() => {
              setSelectedScenario(sc);
              resetSimulation();
            }}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-mono transition-all border",
              selectedScenario.id === sc.id
                ? "bg-amber text-[#0A0A0A] border-amber font-bold shadow-sm"
                : "bg-surface text-muted border-hairline hover:border-hairline-hover hover:text-foreground"
            )}
          >
            <span className="opacity-70 mr-1">[{sc.system}]</span>
            <span>{sc.title.split(":")[1] || sc.title}</span>
          </button>
        ))}
      </div>

      {/* Scenario Input */}
      <div className="rounded-xl p-3.5 bg-surface-subtle border border-hairline/60 space-y-1 font-mono">
        <div className="text-[10px] uppercase tracking-wider text-muted-dark font-semibold">
          {selectedScenario.inputLabel}
        </div>
        <div className="text-xs text-foreground/90 font-sans italic">
          &ldquo;{selectedScenario.inputText}&rdquo;
        </div>
      </div>

      {/* Pipeline Steps View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {selectedScenario.steps.map((step, idx) => {
          const isCurrent = activeStepIndex === idx && isRunning;
          const isDone = activeStepIndex > idx || isCompleted;

          return (
            <div
              key={idx}
              className={cn(
                "p-3 rounded-xl border text-xs font-mono transition-all duration-200 space-y-1.5",
                isCurrent &&
                  "border-amber bg-amber/5 ring-1 ring-amber/30 scale-[1.02]",
                isDone && "border-hairline bg-surface/80",
                !isCurrent && !isDone && "border-hairline/40 bg-surface/30 opacity-40"
              )}
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted-dark">NODE 0{idx + 1}</span>
                {isCurrent && (
                  <span className="text-amber animate-pulse font-bold">
                    EXEC...
                  </span>
                )}
                {isDone && (
                  <span className="text-emerald-500 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    {step.duration}ms
                  </span>
                )}
              </div>

              <div
                className={cn(
                  "font-bold text-xs",
                  isCurrent ? "text-amber" : isDone ? "text-foreground" : "text-muted"
                )}
              >
                {step.name}
              </div>

              <p className="text-[11px] text-muted leading-tight font-sans">
                {step.detail}
              </p>
            </div>
          );
        })}
      </div>

      {/* Final Output */}
      {isCompleted && (
        <div className="rounded-xl border border-amber/40 p-4 bg-surface space-y-2.5 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline/60 pb-2">
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border",
                selectedScenario.finalOutput.badgeColor
              )}
            >
              {selectedScenario.finalOutput.badgeText}
            </span>

            <div className="flex items-center gap-4 text-xs font-mono text-muted">
              <span>
                Latency: <strong className="text-amber">{selectedScenario.finalOutput.totalLatency}</strong>
              </span>
              <span>
                Cost: <strong className="text-foreground">{selectedScenario.finalOutput.cost}</strong>
              </span>
            </div>
          </div>

          <p className="text-xs text-foreground/90 font-sans leading-relaxed">
            {selectedScenario.finalOutput.summary}
          </p>

          {selectedScenario.finalOutput.metrics && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1.5 border-t border-hairline/50">
              {Object.entries(selectedScenario.finalOutput.metrics).map(
                ([k, v]) => (
                  <div
                    key={k}
                    className="p-2 rounded-lg bg-surface-subtle font-mono text-[11px]"
                  >
                    <div className="text-muted-dark">{k}</div>
                    <div className="text-amber font-semibold">{v}</div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
