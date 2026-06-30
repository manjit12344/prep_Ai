import React from "react";

export default function StepProgress({ step, total }) {
  const percentage = Math.round(((step + 1) / total) * 100);

  return (
    <div className="px-5 py-4 border-b border-line bg-canvas">
      {/* Metric Text Details */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">
          Step {step + 1} of {total}
        </span>

        <span className="text-xs text-muted">
          {percentage}%
        </span>
      </div>

      {/* Horizontal Status Track */}
      <div className="mt-3 h-2 bg-line rounded-full overflow-hidden">
        <div
          className="h-full bg-main transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}