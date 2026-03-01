"use client";

import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../lib/store/authStore";
import { useThemeStore } from "@/lib/store/themeStore";
import { useRouter } from "next/navigation";

export default function AuthModal({ onClose }) {
  const router = useRouter();
  const { theme } = useThemeStore();
  const dark = theme === "dark";

  const [mode, setMode]       = useState("signup");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef(null);
  const { signUp, signIn }    = useAuthStore();

  useEffect(() => {
    const fn = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [onClose]);

  const switchMode = () => {
    setMode(m => m === "signup" ? "login" : "signup");
    setError(""); setEmail(""); setPassword(""); setConfirm("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (mode === "signup" && password !== confirm) { setError("Passwords don't match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      mode === "login" ? await signIn(email, password) : await signUp(email, password);
      onClose();
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ── theme tokens ────────────────────────────────────────────────────────
  const paper      = dark ? "#0f0f0f"                : "#f0efe9";
  const ink        = dark ? "#e8e6e0"                : "#1c1c1c";
  const muted      = dark ? "#7a7872"                : "#71716e";
  const sub        = dark ? "#555"                   : "#a1a1aa";
  const cardBg     = dark ? "rgba(18,18,18,0.96)"    : "rgba(243,242,236,0.82)";
  const cardBorder = dark ? "rgba(60,60,60,0.7)"     : "rgba(180,178,170,0.6)";
  const inputBg    = dark ? "rgba(255,255,255,0.05)" : "rgba(240,239,233,0.55)";
  const inputBgF   = dark ? "rgba(255,255,255,0.09)" : "rgba(240,239,233,0.8)";
  const inputBorderC = dark ? "#444"                 : "#d4d2cb";
  const inputBorderF = dark ? "#777"                 : "#71716e";
  const lineColor  = dark ? "rgba(50,50,45,0.5)"     : "rgba(210,208,200,0.5)";
  const marginLine = dark ? "rgba(90,40,40,0.7)"     : "rgba(240,192,192,0.7)";
  const divider    = dark ? "rgba(60,60,60,0.5)"     : "rgba(228,228,231,0.8)";

  return (
    <>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .modal-paper { animation: modalIn 0.22s ease forwards; }
        .auth-input {
          width: 100%;
          background: ${inputBg};
          border: 1px solid ${inputBorderC};
          padding: 10px 12px;
          font-size: 13px;
          font-family: 'Space Mono', monospace;
          color: ${ink};
          outline: none;
          transition: border-color 0.15s, background 0.15s;
        }
        .auth-input::placeholder { color: ${dark ? "#444" : "#a8a5a0"}; }
        .auth-input:focus {
          border-color: ${inputBorderF};
          background: ${inputBgF};
        }
      `}</style>

      {/* Overlay */}
      <div ref={overlayRef}
        onClick={e => { if (e.target === overlayRef.current) onClose(); }}
        className="fixed inset-0 z-[200] flex items-center justify-center"
        style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>

        {/* Card */}
        <div className="modal-paper relative w-full max-w-sm mx-4"
          style={{
            background: cardBg,
            backdropFilter: "blur(20px)",
            border: `1px solid ${cardBorder}`,
            boxShadow: dark
              ? "0 8px 40px rgba(0,0,0,0.5)"
              : "0 8px 40px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,0.6) inset",
            backgroundImage: `repeating-linear-gradient(transparent, transparent 27px, ${lineColor} 27px, ${lineColor} 28px)`,
          }}>

          {/* Red margin line */}
          <div className="absolute top-0 bottom-0 left-10 w-px pointer-events-none"
            style={{ background: marginLine }} />

          <div className="relative px-10 py-10">

            {/* Close */}
            <button onClick={onClose}
              className="absolute top-5 right-5 w-6 h-6 flex items-center justify-center transition-colors"
              style={{ color: sub }}
              onMouseEnter={e => e.currentTarget.style.color = ink}
              onMouseLeave={e => e.currentTarget.style.color = sub}
              aria-label="Close">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 flex items-center justify-center"
                  style={{ border: `1px solid ${muted}` }}>
                  <span className="text-[8px] font-black font-mono" style={{ color: muted }}>TS</span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: muted }}>
                  task scroller
                </span>
              </div>
              <h2 className="text-2xl leading-tight" style={{ fontFamily: "'Instrument Serif', serif", color: ink }}>
                {mode === "signup" ? <>Create an <em>account.</em></> : <>Welcome <em>back.</em></>}
              </h2>
              <p className="mt-1.5 text-[12px] font-mono" style={{ color: muted }}>
                {mode === "signup" ? "Start scheduling fairly." : "Sign in to your workspace."}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-mono mb-1.5" style={{ color: muted }}>Email</label>
                <input className="auth-input" type="email" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-mono mb-1.5" style={{ color: muted }}>Password</label>
                <input className="auth-input" type="password" placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"} />
              </div>

              {mode === "signup" && (
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-mono mb-1.5" style={{ color: muted }}>Confirm Password</label>
                  <input className="auth-input" type="password" placeholder="••••••••"
                    value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" />
                </div>
              )}

              {error && <p className="text-[11px] font-mono pt-1" style={{ color: dark ? "#e05555" : "#dc2626" }}>{error}</p>}

              <div className="pt-3">
                <button type="submit" disabled={loading}
                  className="w-full py-2.5 text-[11px] uppercase tracking-widest font-bold font-mono transition-colors disabled:opacity-40"
                  style={{ background: ink, color: paper }}>
                  {loading ? "Please wait..." : mode === "signup" ? "Create Account →" : "Sign In →"}
                </button>
              </div>
            </form>

            {/* Switch mode */}
            <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${divider}` }}>
              <p className="text-[11px] font-mono text-center" style={{ color: muted }}>
                {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
                <button onClick={switchMode}
                  className="underline underline-offset-2 transition-colors"
                  style={{ color: ink }}
                  onMouseEnter={e => e.currentTarget.style.color = muted}
                  onMouseLeave={e => e.currentTarget.style.color = ink}>
                  {mode === "signup" ? "Log in" : "Sign up"}
                </button>
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}