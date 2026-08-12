import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import api from "../services/api";

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm your offline help assistant. Ask me how to use the site." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setSending(true);
    try {
      const { data } = await api.post("/ai/chat", { message: userMsg.text });
      setMessages((m) => [...m, { from: "bot", text: data.reply }]);
    } catch {
      setMessages((m) => [...m, { from: "bot", text: "Sorry, something went wrong." }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {open && (
        <div className="w-80 h-96 mb-3 card flex flex-col overflow-hidden shadow-xl">
          <div className="bg-primary-600 text-white px-4 py-3 flex justify-between items-center">
            <span className="font-medium text-sm">Help Assistant (Offline AI)</span>
            <button onClick={() => setOpen(false)}><X size={16} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3 py-2 rounded-lg ${
                  m.from === "user"
                    ? "bg-primary-600 text-white ml-auto"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-gray-100 dark:border-gray-700 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask something..."
              className="input-field text-sm"
            />
            <button onClick={send} disabled={sending} className="btn-primary px-3">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center shadow-lg"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
