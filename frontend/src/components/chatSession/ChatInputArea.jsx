import React, { useEffect, useRef } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function ChatInputArea({
  isComplete,
  answer,
  setAnswer,
  onKeyDown,
  onSend,
  loading,
  hasStarted,
}) {
  const textareaRef = useRef(null);
  const LINE_HEIGHT = 18;
  const MAX_ROWS = 4;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";

    const maxHeight = LINE_HEIGHT * MAX_ROWS + 16;
    const newHeight = Math.min(el.scrollHeight, maxHeight);

    el.style.height = `${newHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [answer]);

  return (
    <div className="sticky bottom-0 z-20 border-t border-line bg-canvas px-6 py-5 backdrop-blur-xl">
      <div className="mx-auto max-w-3xl">
        {isComplete ? (
          <div className="flex h-12 items-center justify-center gap-2 rounded-xl border border-line bg-card font-mono text-xs font-medium text-main">
            <CheckCircle2 size={15} />
            <span>
              Interview completed successfully — Sandbox state locked
            </span>
          </div>
        ) : (
          <div
            className="
              flex items-end gap-3
              rounded-xl
              border border-line
              bg-card
              px-4 py-3.5
              transition-all
              focus-within:border-neutral-900
              dark:focus-within:border-neutral-100
              focus-within:ring-2
              focus-within:ring-neutral-900/5
              dark:focus-within:ring-neutral-100/5
            "
          >
            <textarea
              ref={textareaRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={loading || isComplete}
              rows={1}
              placeholder={
                isComplete
                  ? "Interview completed."
                  : hasStarted
                  ? "Type your response..."
                  : "Type a message to begin the interview..."
              }
              className="
                flex-1
                resize-none
                self-center
                bg-transparent
                font-mono
                text-xs
                text-main
                placeholder:text-muted
                outline-none
                disabled:opacity-50
              "
              style={{
                lineHeight: `${LINE_HEIGHT}px`,
                overflowY: "hidden",
              }}
            />

            <button
              type="button"
              onClick={onSend}
              disabled={loading || isComplete || !answer.trim()}
              className="
                flex h-9 w-9 flex-shrink-0 items-center justify-center
                rounded-lg
                bg-neutral-900
                text-white
                transition-all
                duration-150
                hover:bg-neutral-800
                active:scale-95
                disabled:cursor-not-allowed
                disabled:opacity-40
                dark:bg-neutral-100
                dark:text-neutral-900
                dark:hover:bg-white
              "
            >
              <Send size={14} />
            </button>
          </div>
        )}

        <p className="mt-2.5 text-center font-mono text-[10px] tracking-wide text-muted">
          Press Enter to send, Shift + Enter for a new line
        </p>
      </div>
    </div>
  );
}