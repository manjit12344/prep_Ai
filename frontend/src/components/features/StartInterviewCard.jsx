import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

export default function StartInterviewCard() {
  const navigate = useNavigate();

  return (
    <div className="border border-line bg-card/40 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
      {/* Card Details Text */}
      <div className="text-center sm:text-left">
        <h3 className="text-sm font-medium text-main">Start a Mock Interview</h3>
        <p className="text-xs text-muted mt-1 leading-relaxed">
          Set up a custom AI session tailored to your specific role, target company, and experience level.
        </p>
      </div>
      
      {/* Stark Action Button */}
      <button
        type="button"
        onClick={() => navigate("/createNew")}
        className="w-full sm:w-auto bg-[#111827] text-[#fafaf9] dark:bg-[#f8fafc] dark:text-[#0f1117] px-4 h-9 rounded font-mono text-xs font-semibold tracking-tight transition-all hover:opacity-90 flex items-center justify-center gap-2 flex-shrink-0"
      >
        <Plus size={14} />
        <span>Create New</span>
      </button>
    </div>
  );
}