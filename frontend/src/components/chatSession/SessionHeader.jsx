import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function SessionHeader({ sessionId, isComplete, loading }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 h-14 border-b border-neutral-200/60 dark:border-neutral-800/60 bg-white/40 dark:bg-black/20 backdrop-blur-xl px-6 flex items-center justify-between select-none">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate("/features")}
          className="flex items-center gap-2 font-mono text-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          <span>back_to_features</span>
        </button>

        <span className="hidden sm:inline w-px h-4 bg-neutral-200 dark:bg-neutral-800" />

        <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-neutral-400 dark:text-neutral-500">
          <span>id:</span>
          <span className="text-neutral-950 dark:text-white font-medium">
            [{sessionId}]
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 font-mono text-xs">
        <span
          className={`h-2 w-2 rounded-full transition-all duration-300 ${
            isComplete
              ? "bg-neutral-400 dark:bg-neutral-600"
              : loading
              ? "bg-emerald-500 animate-pulse"
              : "bg-emerald-500"
          }`}
        />

        <span className="text-neutral-400 dark:text-neutral-500">
          {isComplete
            ? "session_closed"
            : loading
            ? "thinking..."
            : "active"}
        </span>
      </div>
    </header>
  );
}