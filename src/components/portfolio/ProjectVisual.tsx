import { Activity, ArrowUpRight, AudioLines, Bot, CalendarDays, Check, FileText, Heart, MapPin, MessageCircle, Search, Sparkles } from "lucide-react";
import type { ProjectVisualKind } from "@/data/portfolio";

export function ProjectVisual({ kind, name, large = false }: { kind: ProjectVisualKind; name: string; large?: boolean }) {
  return <div className={"project-art art-" + kind + (large ? " art-large" : "")} aria-label={name + " — conceptual interface illustration"} role="img">
    <div className="art-grid" />
    <span className="art-coordinate">RK / {kind.toUpperCase()}</span>
    {kind === "health" && <div className="health-art">
      <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
      <div className="health-symbol"><Heart size={76} strokeWidth={1.1} /><span className="symbol-plus">+</span></div>
      <div className="floating-note note-top"><Sparkles size={15} />A little clarity.</div>
      <div className="floating-note note-bottom"><Activity size={16} /><span className="mini-wave" />A little care.</div>
    </div>}
    {kind === "voice" && <div className="voice-art">
      <span className="voice-halo" />
      <div className="wave-bars">{[22, 38, 65, 92, 52, 112, 148, 96, 126, 172, 114, 65, 138, 96, 55, 30, 48].map((height, i) => <span key={i} style={{ height, animationDelay: (i * -0.14) + "s" }} />)}</div>
      <div className="voice-caption"><AudioLines size={16} />A conversation, in motion.</div>
    </div>}
    {kind === "crm" && <div className="mock-window crm-window">
      <div className="mock-chrome"><span /><span /><span /><p>estateflow / workspace</p></div>
      <div className="crm-heading"><span>Your next move.</span><span className="tiny-pill">Pipeline <ArrowUpRight size={11} /></span></div>
      <div className="kanban-art">{["New leads", "In progress", "Closed"].map((label, i) => <div className="kanban-column" key={label}><span className="kanban-label"><i />{label}</span>{Array.from({ length: i === 1 ? 3 : 2 }, (_, j) => <div className="kanban-card" key={j}><span className="skeleton-line" /><span className="skeleton-line short" /><div><i className={"mock-avatar avatar-" + i} /><span className="card-dot" /></div></div>)}</div>)}</div>
    </div>}
    {kind === "travel" && <div className="travel-art">
      <div className="travel-sun" /><div className="mountain mountain-back" /><div className="mountain mountain-front" />
      <div className="travel-title">Somewhere<br /><i>new.</i></div>
      <div className="travel-search"><MapPin size={14} /><span>Where will you go?</span><span className="search-circle"><ArrowUpRight size={16} /></span></div>
    </div>}
    {kind === "docs" && <div className="docs-art">
      <div className="document doc-back"><FileText size={25} /><span /><span /><span /></div>
      <div className="document doc-front"><div><Bot size={22} /><span className="tiny-pill">knowledge</span></div><strong>Ask better<br />questions.</strong><span /><span className="short" /><div className="doc-answer"><Search size={14} /><span>A place to start.</span></div></div>
      <span className="docs-spark"><Sparkles size={25} /></span>
    </div>}
    {kind === "doctor" && <div className="doctor-art">
      <div className="appointment-card"><div className="appointment-top"><CalendarDays size={24} /><span className="tiny-pill">DoctorEase</span></div><strong>A better<br /><i>next step.</i></strong><div className="calendar-art">{Array.from({ length: 21 }, (_, i) => <span key={i} className={i === 10 ? "selected-day" : ""}>{i + 1}</span>)}</div><div className="appointment-footer"><Check size={14} /><span>Designed around you.</span></div></div>
      <div className="floating-note doctor-note"><MessageCircle size={15} />Care, connected.</div>
    </div>}
    <span className="art-caption">INTERFACE STUDY</span>
  </div>;
}
