import React from "react";
import { Link } from "react-router-dom";
import Theme from "../theme"

export default function LandingHeader() {
  return (
    <header className="relative z-10 border-b border-line bg-canvas/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo & Version */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm tracking-tight font-semibold text-main opacity-90">
            prepAI
          </span>
          <span className="text-[10px] bg-card border border-line text-muted font-mono px-1.5 py-0.5 rounded">
            v1.0
          </span>
        </div>

        {/* Navigation Action */}
        <nav className="flex items-center gap-6">
          <Theme />
          <Link to="/login-with-google">
            <button 
              type="button" 
              className="bg-[#111827] text-[#fafaf9] dark:bg-[#f8fafc] dark:text-[#0f1117] px-3 py-1.5 rounded text-xs font-medium font-mono hover:opacity-90 transition-opacity"
            >
              Sign In
            </button>
          </Link>
        </nav>
      </div>
    </header>
  );
}