export function buildChatMessages(chat, aiResponse, isComplete) {
  const hasStarted = Array.isArray(chat) && chat.length > 0;
  const messages = [];

  if (Array.isArray(chat)) {
    chat.forEach((item) => {
      if (item.question) {
        messages.push({ id: `q-${item.id}`, role: "ai", text: item.question });
      }
      if (item.answer) {
        messages.push({
          id: `a-${item.id}`,
          role: "user",
          text: item.answer,
          score: item.score,
        });
      }
    });
  }

  let pendingQuestion = "";
  if (aiResponse && Object.keys(aiResponse).length > 0) {
    pendingQuestion = aiResponse.aiChat?.nextQuestion || aiResponse.Question || "";
  }

  const lastMsg = messages[messages.length - 1];
  const pendingAlreadyShown =
    lastMsg && lastMsg.role === "ai" && lastMsg.text === pendingQuestion;

  if (isComplete) {
    messages.push({
      id: "complete",
      role: "ai",
      text: "That's a wrap! Thanks for completing the interview — your responses have been fully recorded.",
      complete: true,
    });
  } else if (pendingQuestion && !pendingAlreadyShown) {
    messages.push({ id: "pending", role: "ai", text: pendingQuestion });
  } else if (!hasStarted && !pendingQuestion) {
    messages.push({
      id: "greeting",
      role: "ai",
      text: "Hi, I'm your AI interviewer 👋 Whenever you're ready, send a message below and we'll get started.",
    });
  }

  return { messages, hasStarted };
}
