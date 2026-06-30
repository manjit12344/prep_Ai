import React from "react";

export default function StepField({ current, value, onChange, onKeyDown, error, disabled }) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-2">
        {current.label}
      </h2>

      <p className="text-sm text-muted mb-6">
        {current.description}
      </p>

      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={current.placeholder}
        autoFocus
        disabled={disabled}
        className="w-full rounded-lg border border-line bg-canvas px-4 py-3 text-sm outline-none transition focus:border-main disabled:opacity-50"
      />

      {error && (
        <p className="mt-3 text-sm text-red-500">
          {error}
        </p>
      )}
    </>
  );
}