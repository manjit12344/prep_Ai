import React from "react";

export default function LandingFooter() {
  return (
    <footer className="relative z-10 max-w-6xl mx-auto px-6 py-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
      <span className="font-mono text-xs text-muted">
       { new Date().getFullYear()} prepAI.
      </span>
      <span className="text-xs text-muted font-mono">
        Made with ❤️ by Manjit
      </span>
    </footer>
  );
}