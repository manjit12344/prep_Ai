import React from "react";

// Dev-only helper for visualizing form state while building/testing.
// Delete this component (and its usage in CreateNew.jsx) before shipping
// to production, or gate it behind an env flag if you want to keep it
// around for debugging.
export default function FormDebugPreview({ form }) {
  return (
    <div className="hidden md:block mt-8 rounded-lg border border-line bg-canvas/40 p-4">
      <div className="text-xs text-muted mb-2 font-mono">
        Session Preview
      </div>

      <pre className="text-xs text-muted overflow-auto font-mono">
        {JSON.stringify(form, null, 2)}
      </pre>
    </div>
  );
}