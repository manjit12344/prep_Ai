import React from 'react';

// variant: "loading" | "empty"
// label: only needed for "empty" — the tab name to mention (e.g. "active")
const EmptyState = ({ variant, label }) => {
  if (variant === "loading") {
    return (
      <div className="border border-dashed border-line p-8 rounded-lg text-center font-mono text-xs text-muted opacity-60 animate-pulse">
        Loading sessions...
      </div>
    );
  }

  return (
    <div className="border border-dashed border-line p-8 rounded-lg text-center font-mono text-xs text-muted opacity-60">
      No {label} interview sessions recorded yet.
    </div>
  );
};

export default EmptyState;
