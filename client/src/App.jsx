import { useState, useEffect, useRef } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3000");

function App() {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const chatEndRef = useRef(null); // auto-scroll

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          text: data.message,
          type: "received",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  // auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  const sendMessage = () => {
    if (message !== "") {
      socket.emit("send_message", { message, room });

      setMessages((prev) => [
        ...prev,
        {
          text: message,
          type: "sent",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      setMessage("");
    }
  };

  return (
    <div className="chat-app">
      <div className="chat-card">
        <div className="chat-header">
          <h3>Socket Chat</h3>
        </div>

        <div className="chat-body">
          {messages.length === 0 ? (
            <p className="empty-text">No messages yet...</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                <p>{msg.text}</p>
                <span className="timestamp">{msg.time}</span>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-controls">
          <div className="form-group">
            <input
              className="input-field"
              placeholder="Enter room..."
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
            <button className="btn join-btn" onClick={joinRoom}>
              Join
            </button>
          </div>

          <div className="form-group">
            <input
              className="input-field"
              placeholder="Type message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="btn send-btn" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
