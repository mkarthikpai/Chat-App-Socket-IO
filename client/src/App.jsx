import { useState } from "react";
import "./App.css";
import io from "socket.io-client";
import { useEffect } from "react";
const socket = io.connect("http://localhost:3000");

function App() {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessageReceived(data.message);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  const sendMessage = () => {
    socket.emit("send_message", { message: message, room });
    setMessage("");
  };

  return (
    <div className="chat-app">
      <div className="chat-card">
        <div className="chat-header">
          <h3>Socket Chat</h3>
        </div>

        <div className="chat-body">
          <div className="message received">
            <p>{messageReceived || "No messages yet..."}</p>
          </div>
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
