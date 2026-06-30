import React from "react";

export default function UnauthorizedNotice() {
  return (
    <div className="flex min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] items-center justify-center font-mono text-xs p-4 antialiased select-none">
      <div className="w-full max-w-md border border-neutral-200 dark:border-neutral-800 p-5 rounded-xl bg-white dark:bg-[#161616] shadow-[0_20px_60px_rgba(0,0,0,0.03)] text-neutral-400 dark:text-neutral-500">
        <div className="flex items-center gap-2 text-red-500 dark:text-red-400 font-bold uppercase tracking-wider text-[10px] mb-2">
          <span>●</span> CRITICAL_ERROR
        </div>
        <p className="leading-relaxed">
          Unauthorized context. Handshake token missing. Please log in to authenticate this channel.
        </p>
      </div>
    </div>
  );
}