import { useState } from "react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello 👋 How can I help?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      text: input,
      sender: "user",
    };

    setMessages([...messages, newMessage]);
    setInput("");

    // Example bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "Thanks for your message!",
          sender: "bot",
        },
      ]);
    }, 500);
  };

  return (
    <div>
      {/* Chat Window */}
      {isOpen && (
        <div style={styles.chatWindow}>
          <div style={styles.header}>
            Chat Support
          </div>

          <div style={styles.messages}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.message,
                  alignSelf:
                    msg.sender === "user"
                      ? "flex-end"
                      : "flex-start",
                  background:
                    msg.sender === "user"
                      ? "#0078ff"
                      : "#e5e5ea",
                  color:
                    msg.sender === "user"
                      ? "white"
                      : "black",
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div style={styles.inputArea}>
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              style={styles.input}
            />

            <button onClick={sendMessage} style={styles.sendButton}>
              Send
            </button>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <button onClick={toggleChat} style={styles.chatButton}>
        💬
      </button>
    </div>
  );
}

const styles = {
  chatButton: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "#0078ff",
    color: "white",
    fontSize: "24px",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },

  chatWindow: {
    position: "fixed",
    bottom: "90px",
    right: "20px",
    width: "320px",
    height: "420px",
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  header: {
    backgroundColor: "#0078ff",
    color: "white",
    padding: "15px",
    fontWeight: "bold",
  },

  messages: {
    flex: 1,
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowY: "auto",
  },

  message: {
    padding: "10px 14px",
    borderRadius: "14px",
    maxWidth: "75%",
  },

  inputArea: {
    display: "flex",
    borderTop: "1px solid #ddd",
  },

  input: {
    flex: 1,
    border: "none",
    padding: "12px",
    outline: "none",
  },

  sendButton: {
    border: "none",
    backgroundColor: "#0078ff",
    color: "white",
    padding: "0 18px",
    cursor: "pointer",
  },
};