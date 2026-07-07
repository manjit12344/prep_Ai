import React from 'react';
import { ChevronRight } from "lucide-react";

const SessionCard = ({ session, userId,activeTab, onClick }) => {
  const isCompleted =
    activeTab === "completed" ||
    session.status === "complete" ||
    session.status === "COMPLETED";

  return (
    <div
      onClick={onClick}
      className="group border border-line bg-card/30 hover:bg-card/60 p-4 rounded-lg flex items-center justify-between transition-all cursor-pointer select-none"
    >
      <div className="flex flex-col gap-1.5 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-xs text-main font-semibold truncate">
            {session.type}
          </span>
          <span className="w-1 h-1 rounded-full bg-line hidden sm:inline" />
          <span className="text-xs text-muted font-mono">
            {session.level}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-muted opacity-80 font-mono">
          <span>company: <span className="text-main opacity-90">{session.company || "global"}</span></span>
          <span>•</span>
          <span>id: <span className="text-main opacity-90">#{session.id}</span></span>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-4 flex-shrink-0">
        {/* Status Badge */}
        <span className={`font-mono text-[10px] uppercase px-2.5 py-0.5 rounded-full border tracking-wide font-medium transition-colors ${isCompleted
            ? "bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200"
            : "bg-neutral-50 dark:bg-neutral-950 border-line text-muted"
          }`}>
          {activeTab === "completed" ? "view-analytics" : (session.status?.toLowerCase() || "active")}
        </span>

        <ChevronRight size={14} className="text-muted group-hover:text-main transform group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
};

export default SessionCard;
