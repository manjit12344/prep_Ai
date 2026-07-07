import React, { useState, useEffect, useRef } from "react";
import { useParams,Link } from "react-router-dom";
import { userAuth } from "../store/01.auth.store";
import { userChat } from "../store/02.chat.store";
import { useHistory } from "../store/03.history";
import { buildChatMessages } from "../components/chatSession/buildChatMessages";
import UnauthorizedNotice from "../components/chatSession/UnauthorizedNotice";
import SessionHeader from "../components/chatSession/SessionHeader";
import MessageList from "../components/chatSession/MessageList";
import ChatInputArea from "../components/chatSession/ChatInputArea";

const ChatSession = () => {
  const { know, knowMe } = userAuth();
  const { aiResponse, running, loading } = userChat();
  const { chat, myChatHistory } = useHistory();

  const { id } = useParams();
  const nId = Number(id);

  const [answer, setAnswer] = useState("");
  const bottomRef = useRef(null);

  // Interview status
  const isComplete = aiResponse?.aiChat?.isInterviewComplete ?? false;

  useEffect(() => {
    const checkAuth = async () => {
      await knowMe();
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (nId) {
      myChatHistory(nId);
    }
  }, [nId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, aiResponse, loading]);

  const send = async () => {
    // Prevent sending if interview is complete
    if (!answer.trim() || loading || isComplete) return;

    const currentQId = chat?.[chat.length - 1]?.id || null;
    const text = answer;

    setAnswer("");

    try {
      await running(nId, currentQId, text);
      await myChatHistory(nId);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };
if (!know?.user) {
    return (
      <Link to = "/login-with-google">
      <div className="flex min-h-screen bg-canvas items-center justify-center font-mono text-xs text-muted">
        <div className="border border-line p-6 rounded bg-card/40">
          Please log in to get access .
        </div>
      </div></Link>
    );
  }
  const { messages, hasStarted } = buildChatMessages(
    chat,
    aiResponse,
    isComplete
  );
    return (
  <div className="flex h-[100dvh] flex-col bg-canvas text-main overflow-hidden">

    <SessionHeader
      sessionId={nId}
      isComplete={isComplete}
      loading={loading}
    />

    <div className="flex-1 min-h-0 overflow-hidden">
      <MessageList
        ref={bottomRef}
        messages={messages}
        loading={loading}
      />
    </div>

    <ChatInputArea
      isComplete={isComplete}
      answer={answer}
      setAnswer={setAnswer}
      onKeyDown={onKeyDown}
      onSend={send}
      loading={loading}
      hasStarted={hasStarted}
    />

  </div>

  );
};

export default ChatSession;
