import React from "react";
import { Bot } from "lucide-react";
import MessageBubble from "./MessageBubble";

const MessageList = React.forwardRef(function MessageList(
  { messages, loading },
  bottomRef
) {
  return (
     <div className="h-full overflow-y-auto bg-white/40 dark:bg-black/20 w-full">
      <div className="mx-auto max-w-3xl space-y-8 px-6 py-8 xl:py-12">
        
        {/* Streamed Messages Frame */}
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}

        {/* Minimalist Bouncing-Dot Typing Block */}
        {loading && (
          <div className="flex items-start gap-4 justify-start">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#FAFAFA] dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-500">
              <Bot size={15} />
            </div>
            
            <div className="flex items-center gap-1.5 border border-neutral-200 dark:border-neutral-800 bg-[#FAFAFA]/40 dark:bg-[#111111]/20 px-4 py-3.5 rounded-xl">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 dark:bg-neutral-600" style={{ animationDelay: "0ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 dark:bg-neutral-600" style={{ animationDelay: "150ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 dark:bg-neutral-600" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {/* Bottom anchor for scrolling */}
        <div ref={bottomRef} className="h-2" />
      </div>
    </div>
  );
});

export default MessageList;