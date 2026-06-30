import React from "react";

export default function WelcomeSection({ userName }) {
  return (
    <div className="mb-10 text-center sm:text-left">
      <h1 className="text-3xl font-medium tracking-tight text-main">
        Welcome, <span className="text-muted font-mono font-normal">{userName}</span>
      </h1>
      <p className="text-sm text-muted mt-2">
        Your personal interview dashboard is ready. Create a session below to get started.
      </p>
    </div>
  );
}