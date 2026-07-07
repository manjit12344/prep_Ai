import React from "react";

export default function DashboardFooter() {
  return (
    <footer className="max-w-3xl mx-auto w-full px-6 py-6 border-t border-line flex items-center justify-between font-mono text-[10px] text-muted">
      <span>Status: Connected</span>
      <span> {new Date().getFullYear()} prepAI. Made with ❤️ by Manjit </span>
    </footer>
  );
}
