import { useState } from "react";

export default function SupportChat() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hello! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  async function send() {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages(m => [...m, userMsg]);

    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();
    setMessages(m => [...m, { from: "bot", text: data.reply }]);
    setInput("");
  }

  return (
    <div className="chat-widget">
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={m.from}>
            {m.text}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type your question..."
      />
      <button onClick={send}>Send</button>
    </div>
  );
}
