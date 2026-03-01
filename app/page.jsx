"use client";

import { useState } from "react";
import Navbar from "../components/navbar";
import Typewriter from "../components/typewriter";
import useInView from "../components/useInView";
import AuthModal from "../components/authModal";
import { useThemeStore } from "@/lib/store/themeStore";

export default function Home() {
  const { theme } = useThemeStore();
  const dark = theme === "dark";

  const [heroRef, heroIn] = useInView(0.05);
  const [featRef, featIn] = useInView(0.08);
  const [howRef, howIn] = useInView(0.08);
  const [ctaRef, ctaIn] = useInView(0.1);
  const [authOpen, setAuthOpen] = useState(false);

  const paper   = dark ? "#0f0f0f" : "#f0efe9";
  const rule    = dark ? "#1e1e1e" : "#dddbd3";
  const margin  = dark ? "#3a2020" : "#f0c0c0";
  const ink     = dark ? "#e8e6e0" : "#1c1c1c";
  const muted   = dark ? "#7a7872" : "#b0ada6";

  return (
    <div
      className="font-mono"
      style={{
        backgroundColor: paper,
        color: ink,
        backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, ${rule} 31px, ${rule} 32px)`,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Instrument+Serif:ital@0;1&display=swap');
        .grain::after {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.045;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          z-index: 300;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        html { scroll-behavior: smooth; }
      `}</style>

      <div className="grain" />

      {/* Red margin line */}
      <div className="fixed top-0 bottom-0 left-[68px] w-px pointer-events-none z-10"
        style={{ background: margin }} />

      <Navbar onGetStarted={() => setAuthOpen(true)} />
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}

      <div className="relative">

        {/* ── HERO ── */}
        <section className="min-h-screen flex flex-col justify-center pt-14">
          <div ref={heroRef} className="max-w-4xl mx-auto px-8 md:px-20 py-24 w-full">

            <div className="flex items-center gap-2.5 mb-12"
              style={{ opacity: heroIn ? 1 : 0, animation: heroIn ? "fadeUp 0.5s ease forwards" : "none" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: muted }} />
              <span className="text-[11px] uppercase tracking-[0.18em]" style={{ color: muted }}>
                Linux CFS &nbsp;·&nbsp; Task Scheduling &nbsp;·&nbsp; Open Source
              </span>
            </div>

            <h1 className="leading-[0.92] mb-10"
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "clamp(60px, 11vw, 130px)",
                color: ink,
                opacity: heroIn ? 1 : 0,
                animation: heroIn ? "fadeUp 0.55s 0.08s ease forwards" : "none",
              }}>
              Task<br />
              <em style={{ color: muted }}>Scroller.</em>
            </h1>

            <p className="text-base mb-8"
              style={{
                color: dark ? "#9a9890" : "#52525b",
                minHeight: "1.5rem",
                opacity: heroIn ? 1 : 0,
                animation: heroIn ? "fadeUp 0.55s 0.16s ease forwards" : "none",
              }}>
              <Typewriter words={["Every task gets its turn.", "No starvation. Ever.", "Inspired by Linux CFS.", "Schedule smarter."]} />
            </p>

            <p className="text-[15px] leading-[2] mb-12 max-w-lg pl-4"
              style={{
                color: dark ? "#9a9890" : "#52525b",
                borderLeft: `2px solid ${dark ? "#333" : "#d4d4d8"}`,
                opacity: heroIn ? 1 : 0,
                animation: heroIn ? "fadeUp 0.55s 0.22s ease forwards" : "none",
              }}>
              A task scheduler built on the same algorithm Linux uses to run
              millions of processes simultaneously. The Completely Fair
              Scheduler, brought to your daily workflow. No task starves. No
              task hogs your time.
            </p>

            <div className="flex flex-wrap gap-3 mb-14"
              style={{ opacity: heroIn ? 1 : 0, animation: heroIn ? "fadeUp 0.55s 0.3s ease forwards" : "none" }}>
              <button
                onClick={() => setAuthOpen(true)}
                className="px-7 py-2.5 text-[11px] uppercase tracking-widest font-bold transition-colors"
                style={{
                  background: ink,
                  color: paper,
                }}>
                Open App →
              </button>
              <a href="#features"
                className="px-7 py-2.5 text-[11px] uppercase tracking-widest font-bold transition-colors"
                style={{
                  border: `1px solid ${dark ? "#555" : "#a1a1aa"}`,
                  color: dark ? "#9a9890" : "#52525b",
                }}>
                Learn More
              </a>
            </div>

            <div className="flex flex-wrap gap-2"
              style={{ opacity: heroIn ? 1 : 0, animation: heroIn ? "fadeUp 0.55s 0.36s ease forwards" : "none" }}>
              {["Fair Scheduling", "No Starvation", "Smart Priorities", "Balanced Workload", "Focus Flow"].map(t => (
                <span key={t} className="text-[12px] font-mono px-2.5 py-1"
                  style={{ color: muted, border: `1px solid ${dark ? "#333" : "#d4d4d8"}` }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" style={{ borderTop: `1px solid ${dark ? "#222" : "#d4d4d8"}` }}>
          <div ref={featRef} className="max-w-4xl mx-auto px-8 md:px-20 py-24 w-full">
            <div className="flex items-baseline gap-4 mb-14">
              <span className="text-[10px] uppercase tracking-widest font-mono" style={{ color: muted }}>01</span>
              <h2 className="text-3xl md:text-[2.5rem] leading-snug"
                style={{ fontFamily: "'Instrument Serif', serif", color: ink }}>
                What makes it <em>fair.</em>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-0" style={{ border: `1px solid ${dark ? "#222" : "#d4d4d8"}` }}>
              {[
                { title: "Work Awareness", body: "Each task understands how much work is needed per day to stay on track. Fall behind, and it rises naturally. Stay ahead, and it fades into the background." },
                { title: "Smart Prioritization", body: "A weighted score combines urgency, importance, consequences, effort, and difficulty — turning messy decisions into a clear, automatic order." },
                { title: "Deadline Protection", body: "When a task reaches a critical point, the system ensures it gets scheduled daily. You'll never miss deadlines because something slipped through the cracks." },
              ].map((f, i) => (
                <div key={i} className="p-8 transition-colors"
                  style={{
                    borderRight: i < 2 ? `1px solid ${dark ? "#222" : "#d4d4d8"}` : "none",
                    opacity: featIn ? 1 : 0,
                    transform: featIn ? "translateY(0)" : "translateY(16px)",
                    transition: `opacity 0.6s ease ${i * 110}ms, transform 0.6s ease ${i * 110}ms`,
                  }}>
                  <div className="text-[10px] font-mono uppercase tracking-widest mb-4" style={{ color: muted }}>0{i + 1}</div>
                  <h3 className="text-[11px] font-bold uppercase tracking-wide font-mono mb-3" style={{ color: dark ? "#c8c6c0" : "#3f3f46" }}>{f.title}</h3>
                  <p className="text-[13px] leading-[1.9]" style={{ color: dark ? "#9a9890" : "#52525b" }}>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" style={{ borderTop: `1px solid ${dark ? "#222" : "#d4d4d8"}` }}>
          <div ref={howRef} className="max-w-4xl mx-auto px-8 md:px-20 py-24 w-full">
            <div className="flex items-baseline gap-4 mb-14">
              <span className="text-[10px] uppercase tracking-widest font-mono" style={{ color: muted }}>02</span>
              <h2 className="text-3xl md:text-[2.5rem] leading-snug"
                style={{ fontFamily: "'Instrument Serif', serif", color: ink }}>
                How it <em>works.</em>
              </h2>
            </div>

            <div style={{ border: `1px solid ${dark ? "#222" : "#d4d4d8"}` }}>
              {[
                { step: "Add your tasks", detail: "Enter your tasks with a deadline, remaining work, and a few simple inputs like importance and effort. That's all the system needs to understand how to schedule your time." },
                { step: "It calculates your pace", detail: "Each task computes how much work you need to do per day to stay on track. Fall behind, and it becomes urgent. Stay ahead, and it quietly steps back." },
                { step: "Priorities are decided", detail: "A weighted score combines urgency, importance, consequences, effort, and difficulty. The system figures out what truly matters — so you don't have to." },
                { step: "Tasks are scheduled fairly", detail: "Tasks rotate based on when they were last worked on. Nothing dominates your time, and nothing gets ignored — every task gets its fair share of attention." },
              ].map((s, i) => (
                <div key={i} className="flex gap-8 p-8 transition-colors"
                  style={{
                    borderBottom: i < 3 ? `1px solid ${dark ? "#222" : "#d4d4d8"}` : "none",
                    opacity: howIn ? 1 : 0,
                    transform: howIn ? "translateY(0)" : "translateY(16px)",
                    transition: `opacity 0.6s ease ${i * 100}ms, transform 0.6s ease ${i * 100}ms`,
                  }}>
                  <div className="text-[10px] font-mono pt-1 shrink-0 w-5 text-right" style={{ color: dark ? "#555" : "#a1a1aa" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div className="text-[15px] font-bold uppercase tracking-wide font-mono mb-2" style={{ color: dark ? "#c8c6c0" : "#3f3f46" }}>{s.step}</div>
                    <p className="text-[13px] leading-[1.9] max-w-lg" style={{ color: dark ? "#9a9890" : "#52525b" }}>{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section id="get-started" style={{ borderTop: `1px solid ${dark ? "#222" : "#d4d4d8"}` }}>
          <div ref={ctaRef}
            className="max-w-4xl mx-auto px-8 md:px-20 py-24 w-full flex flex-col md:flex-row md:items-end justify-between gap-10"
            style={{ opacity: ctaIn ? 1 : 0, animation: ctaIn ? "fadeUp 0.6s ease forwards" : "none" }}>
            <div>
              <div className="text-[10px] uppercase tracking-widest font-mono mb-4" style={{ color: muted }}>03 / get started</div>
              <h2 className="text-3xl md:text-[2.6rem] leading-snug"
                style={{ fontFamily: "'Instrument Serif', serif", color: ink }}>
                Fair scheduling,<br />
                <em style={{ color: muted }}>starting now.</em>
              </h2>
              <p className="mt-5 text-[13px] leading-[1.9] max-w-sm" style={{ color: dark ? "#9a9890" : "#52525b" }}>
                Stop context-switching between to-do lists. Let the algorithm do the thinking. Open the app and add your first task — the scheduler handles everything else.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <button
                onClick={() => setAuthOpen(true)}
                className="px-8 py-3 text-[11px] uppercase tracking-widest font-bold transition-colors"
                style={{ background: ink, color: paper }}>
                Open App →
              </button>
              <a href="https://github.com/saisridhar77/TaskScroller" target="_blank" rel="noopener noreferrer"
                className="px-8 py-3 text-[11px] uppercase tracking-widest font-bold transition-colors"
                style={{ border: `1px solid ${dark ? "#555" : "#a1a1aa"}`, color: dark ? "#9a9890" : "#52525b" }}>
                GitHub
              </a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: `1px solid ${dark ? "#222" : "#d4d4d8"}` }}>
          <div className="max-w-4xl mx-auto px-8 md:px-20 py-6 flex flex-col md:flex-row items-center justify-between gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: muted }}>© 2026 Task Scroller</span>
            <span className="text-[12px] font-mono" style={{ color: dark ? "#555" : "#a1a1aa" }}>made with &lt;3 . intzaar</span>
          </div>
        </footer>

      </div>
    </div>
  );
}