import React from "react";
import { Link } from "react-router-dom";
import { useTypewriter } from "./useTypewriter.js";
import { ROLES } from "./landing.js";

export default function LandingHero() {
  const role = useTypewriter(ROLES);

  return (
    <section className="relative z-10 max-w-5xl mx-auto px-6 pt-24 md:pt-32 pb-20 text-center">
      {/* Dynamic Cursor Styles Injection */}
      <style>{`
        @keyframes pulse { 50% { opacity: 0; } }
        .cursor-pulse { animation: pulse 1.1s step-end infinite; }
      `}</style>

      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 text-[10px] font-mono text-muted tracking-wider uppercase mb-8 bg-card border border-line px-3 py-1 rounded">
        AI Mock Interview Platform
      </div>

      {/* Main Heading */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl tracking-tight leading-none text-main mb-6">
        Practice interviews.
        <br />
        Get hired faster.
      </h1>

      {/* Subtitle */}
      <p className="max-w-2xl mx-auto text-sm md:text-base text-muted font-mono leading-relaxed mb-8">
        AI-powered mock interviews for frontend, backend, system design and full-stack roles.
      </p>

      {/* Typewriter Selection Display */}
      <div className="text-sm font-mono text-main mb-10 min-h-[28px]">
        Preparing for{" "}
        <span className="border-b border-line pb-1">
          {role}
          <span className="cursor-pulse ml-1">_</span>
        </span>
      </div>

      {/* Call to Action Actions Wrapper */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to="/login-with-google">
          <button 
            type="button"
            className="bg-[#111827] text-[#fafaf9] dark:bg-[#f8fafc] dark:text-[#0f1117] px-7 py-3 rounded-md text-sm font-mono hover:opacity-90 transition"
          >
            Start Free
          </button>
        </Link>

        <span className="font-mono text-xs text-muted">
          3 free interview credits
        </span>
      </div>
    </section>
  );
}