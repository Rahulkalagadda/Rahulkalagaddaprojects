"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Command, Github, Linkedin, Menu, Moon, Search, Sun, X } from "lucide-react";
import { navigation, person, projects } from "@/data/portfolio";
import { MotionProvider, MotionToggle } from "./MotionProvider";
import { MotionEngine } from "./MotionEngine";
import { LeafMark } from "./Botanical";

export function Shell({ children }: { children: React.ReactNode }) {
  return <MotionProvider><ShellLayout>{children}</ShellLayout></MotionProvider>;
}

function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("dark");
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("rk-theme");
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
        document.documentElement.dataset.theme = saved;
      }
    } catch { /* Use the default theme if storage is unavailable. */ }
    const keydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(value => !value);
      }
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setCommandOpen(false);
  }, [pathname]);

  useEffect(() => {
    const modal = dialog.current;
    if (commandOpen && modal && !modal.open) {
      modal.showModal();
      input.current?.focus();
    } else if (!commandOpen && modal?.open) modal.close();
    if (commandOpen) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = previous; };
    }
  }, [commandOpen]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("rk-theme", next); } catch { /* Theme still works when storage is unavailable. */ }
  };

  const commands = [
    ...navigation.map(item => ({ ...item, subtitle: "Explore the portfolio" })),
    { href: "/resume", label: "Résumé", subtitle: "Read, print, or save as PDF" },
    ...projects.map(project => ({ href: "/projects/" + project.slug, label: project.name, subtitle: project.category + " · " + project.status })),
  ].filter(item => (item.label + " " + item.subtitle).toLowerCase().includes(query.toLowerCase()));

  return <>
    <MotionEngine blocked={commandOpen || menuOpen} />
    <a href="#main-content" className="skip-link" onClick={() => document.getElementById("main-content")?.focus()}>Skip to content</a>
    <header className="site-header">
      <span className="scroll-progress" aria-hidden="true" />
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="Rahul Kalagadda — home"><LeafMark className="brand-leaf" /><span className="brand-monogram">r<span>k</span><i /></span><span className="brand-caption">RAHUL<br />KALAGADDA</span></Link>
        <nav className="desktop-nav" aria-label="Main navigation">{navigation.slice(0, 5).map(item => <Link key={item.href} href={item.href} className={isActive(item.href) ? "nav-link active" : "nav-link"} aria-current={isActive(item.href) ? "page" : undefined}>{item.label}</Link>)}</nav>
        <div className="header-actions">
          <button className="icon-button command-trigger" onClick={() => { setQuery(""); setCommandOpen(true); }} aria-label="Search pages and projects" title="Search · Ctrl/⌘ K"><Command size={17} /></button>
          <MotionToggle />
          <button className="icon-button" onClick={toggleTheme} aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}>{theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}</button>
          <Link href="/contact" className="header-contact">Let&apos;s talk<ArrowUpRight size={16} /></Link>
          <button className="icon-button mobile-menu-toggle" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(value => !value)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
      {menuOpen && <nav id="mobile-navigation" className="mobile-nav container" aria-label="Mobile navigation">{navigation.map(item => <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined} onClick={() => setMenuOpen(false)}>{item.label}<ArrowUpRight size={18} /></Link>)}</nav>}
    </header>
    <main id="main-content" tabIndex={-1}>{children}</main>
    <footer className="site-footer container">
      <div className="footer-top"><Link href="/" className="footer-name">Rahul Kalagadda<span className="blue-dot">.</span></Link><p>Rooted in curiosity.<br />Built with intention.</p><div className="footer-social"><a href={person.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={19} /></a><a href={person.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={19} /></a><a href={"mailto:" + person.email} aria-label="Email Rahul"><ArrowUpRight size={22} /></a></div></div>
      <div className="footer-bottom mono"><span>© {new Date().getFullYear()} Rahul Kalagadda</span><span>WILD SYSTEMS · IDEAS IN BLOOM.</span><div><Link href="/credits">Forest credits<ArrowUpRight size={13} /></Link><Link href="/resume">Résumé<ArrowUpRight size={13} /></Link></div></div>
    </footer>
    <dialog ref={dialog} data-lenis-prevent className="command-dialog" onCancel={() => setCommandOpen(false)} onClose={() => setCommandOpen(false)} onClick={event => { if (event.target === event.currentTarget) setCommandOpen(false); }} aria-labelledby="command-title">
      <div className="command-top"><Search size={20} /><label id="command-title" className="sr-only" htmlFor="command-query">Search pages and projects</label><input id="command-query" ref={input} value={query} onChange={event => setQuery(event.target.value)} placeholder="Where would you like to go?" autoComplete="off" /><button className="icon-button" onClick={() => setCommandOpen(false)} aria-label="Close search"><X size={19} /></button></div>
      <div className="command-results">{commands.length ? commands.map(item => <Link href={item.href} key={item.href} onClick={() => setCommandOpen(false)}><span><strong>{item.label}</strong><small>{item.subtitle}</small></span><ArrowUpRight size={17} /></Link>) : <p className="empty-search">No results. Try “AI”, “projects”, or “contact”.</p>}</div>
      <p className="command-hint mono">Tab to move · Enter to open · Esc to close</p>
    </dialog>
  </>;
}
