"use client";
import { useState, useEffect } from "react";
import { useThemeStore } from "@/lib/store/themeStore";
import { Sun, Moon } from "lucide-react";

const links = [
  { label: "get started", href: "#get-started", primary: true },
];

function Navbar({ onGetStarted }) {
  const { theme, toggleTheme } = useThemeStore();
  const dark = theme === "dark";

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const paper     = dark ? "#0f0f0f" : "#f0efe9";
  const ink       = dark ? "#e8e6e0" : "#1c1c1c";
  const muted     = dark ? "#7a7872" : "#71716e";
  const border    = dark ? "#333"    : "#3f3f46";
  const navBg     = scrolled
    ? dark ? "rgba(15,15,15,0.92)" : "rgba(240,239,233,0.9)"
    : "transparent";
  const navBorder = scrolled ? (dark ? "#222" : "#d4d4d8") : "transparent";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: navBg,
        backdropFilter: scrolled ? "blur(8px)" : "none",
        borderBottom: `1px solid ${navBorder}`,
      }}>

      <div className="max-w-4xl mx-auto px-8 h-14 flex items-center justify-between">

        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <div className="w-6 h-6 flex items-center justify-center"
            style={{ border: `1px solid ${border}` }}>
            <span className="text-[9px] font-black font-mono" style={{ color: ink }}>TS</span>
          </div>
          <span className="text-sm font-semibold tracking-tight font-mono" style={{ color: ink }}>
            task scroller
          </span>
        </a>

        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={toggleTheme}
            className="transition-colors"
            style={{ color: muted }}
            onMouseEnter={e => e.currentTarget.style.color = ink}
            onMouseLeave={e => e.currentTarget.style.color = muted}
            aria-label="Toggle theme">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {links.map(link =>
            link.primary ? (
              <button key={link.href} onClick={onGetStarted}
                className="text-[11px] uppercase tracking-widest font-mono font-bold px-4 py-1.5 transition-all duration-200"
                style={{ border: `1px solid ${border}`, color: ink }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = ink;
                  e.currentTarget.style.color = paper;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = ink;
                }}>
                {link.label}
              </button>
            ) : (
              <a key={link.href} href={link.href}
                className="text-[11px] uppercase tracking-widest font-mono transition-colors"
                style={{ color: muted }}>
                {link.label}
              </a>
            )
          )}
        </div>

        <button aria-label="Toggle menu" aria-expanded={open}
          className="md:hidden" onClick={() => setOpen(!open)}>
          <div className="flex flex-col gap-[5px]">
            <span className={`block w-5 h-px transition-all ${open ? "rotate-45 translate-y-[6px]" : ""}`}
              style={{ background: ink }} />
            <span className={`block w-5 h-px transition-all ${open ? "opacity-0" : ""}`}
              style={{ background: ink }} />
            <span className={`block w-5 h-px transition-all ${open ? "-rotate-45 -translate-y-[6px]" : ""}`}
              style={{ background: ink }} />
          </div>
        </button>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? "max-h-96" : "max-h-0"}`}
        style={{ backgroundColor: dark ? "rgba(15,15,15,0.97)" : "rgba(240,239,233,0.97)" }}>
        <div className="px-8 py-4 flex flex-col gap-4">
          <button onClick={toggleTheme}
            className="text-xs uppercase tracking-widest font-mono text-left flex items-center gap-2"
            style={{ color: muted }}>
            {dark ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
            {dark ? "Light mode" : "Dark mode"}
          </button>
          {links.map(link =>
            link.primary ? (
              <button key={link.href}
                onClick={() => { onGetStarted(); setOpen(false); }}
                className="text-xs uppercase tracking-widest font-mono font-bold text-left"
                style={{ color: ink }}>
                {link.label}
              </button>
            ) : (
              <a key={link.href} href={link.href}
                onClick={() => setOpen(false)}
                className="text-xs uppercase tracking-widest font-mono"
                style={{ color: muted }}>
                {link.label}
              </a>
            )
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;