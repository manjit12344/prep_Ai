import React from "react";
import { Bot, User } from "lucide-react";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-start gap-4 w-full ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* Left Avatar Icon for AI */}
      {!isUser && (
        <div
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${
            message.complete
              ? "bg-neutral-950 border-neutral-950 text-white dark:bg-white dark:border-white dark:text-black"
              : "bg-[#FAFAFA] dark:bg-[#111111] border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-500"
          }`}
        >
          <Bot size={15} />
        </div>
      )}

      {/* Modern Monochrome Speech Container */}
      <div
        className={`max-w-xl rounded-xl px-4 py-3 font-mono text-xs leading-relaxed border transition-all ${
          isUser
            ? "bg-white dark:bg-[#161616] text-neutral-950 dark:text-white border-neutral-200 dark:border-neutral-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
            : message.complete
            ? "border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-900 text-neutral-950 dark:text-white font-medium"
            : "border-neutral-200 dark:border-neutral-800/60 bg-[#FAFAFA]/60 dark:bg-[#111111]/40 text-neutral-500 dark:text-neutral-400"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>        
      </div>

      {/* Right Avatar Icon for User */}
      {isUser && (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#FAFAFA] dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-500">
          <User size={15} />
        </div>
      )}
    </div>
  );
}