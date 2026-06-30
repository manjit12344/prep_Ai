import React from "react";

export default function StepNavigation({ step, isLastStep, loading, onBack, onNext }) {
  return (
    <div className="mt-8 flex items-center justify-between gap-3 select-none">
      
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        disabled={step === 0 || loading}
        className="px-4 py-2 rounded-lg border border-line text-sm bg-canvas hover:bg-card text-muted active:scale-[0.98] disabled:pointer-events-none disabled:opacity-30 transition-all duration-200"
      >
        Back
      </button>

      {/* Next / Action Button */}
      <button
  type="button"
  onClick={onNext}
  disabled={loading}
  className="
    px-5 py-2 rounded-lg text-sm font-medium
    active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40
    transition-all duration-200

    bg-black text-white hover:bg-neutral-800
    dark:bg-white dark:text-black dark:hover:bg-neutral-200

    shadow-md
  "
>
  {loading ? (
    <span className="flex items-center gap-1.5 animate-pulse">
      Creating...
    </span>
  ) : isLastStep ? (
    "Start Interview"
  ) : (
    "Continue"
  )}
</button>

    </div>
  );
}