import React from "react";
import { motion } from "framer-motion";

export default function TerminalMockup() {
  return (
    <section className="relative z-10 px-6 pb-24 max-w-3xl mx-auto">
      {/* Inject localized animation for terminal blinking cursor */}
      <style>{`
        @keyframes pulse { 50% { opacity: 0; } }
        .cursor-pulse { animation: pulse 1.1s step-end infinite; }
      `}</style>

      {/* Wrapped the window in a motion.div.
        It starts slightly smaller (scale: 0.97) and faded out, 
        then cleanly expands to full size when scrolled into view.
      */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.97, y: 15 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ 
          duration: 0.6, 
          ease: [0.16, 1, 0.3, 1] // Custom premium cubic-bezier for a smooth deceleration
        }}
        className="bg-card border border-line rounded-lg overflow-hidden shadow-xl"
      >
        {/* Top Status Header Bar */}
        <div className="bg-canvas opacity-80 px-4 py-2.5 flex items-center justify-between border-b border-line">
          <span className="text-[11px] text-muted font-mono tracking-tight">
            interactive_environment.sh
          </span>
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-line" />
            <span className="w-2 h-2 rounded-full bg-line" />
          </div>
        </div>

        {/* Output Console Content */}
        <div className="p-6 font-mono text-xs text-muted space-y-2 whitespace-pre overflow-x-auto leading-relaxed">
          <p className="opacity-50">// Initialize specific evaluation parameter frameworks</p>
          <p className="text-main">
            <span className="opacity-40">$</span> prepai initialize --target="L5_Frontend"
          </p>
          <p className="text-emerald-500 font-semibold">
            ✓ System synchronized successfully with core question-bank matrices.
          </p>
          
          <p>&nbsp;</p>
          
          <p className="text-main">
            <span className="opacity-70 font-semibold">[PROMPT]</span> Design a performant virtualized lazy-loading engine in raw TS.
          </p>
          <p className="opacity-60">
            Constraints: Zero-jank thresholds, structural DOM recycling optimization.
          </p>
          
          <p>&nbsp;</p>
          
          <p className="text-main">
            <span className="opacity-40">$</span>{" "}
            <span className="cursor-pulse font-bold text-muted">_</span>
          </p>
        </div>
      </motion.div>
    </section>
  );
}