import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    console.log("Data", data);
    // Before Room
    // socket.broadcast.emit("receive_message", data);
    // After Room
    socket.to(data.room).emit("receive_message", data);
  });
});

server.listen(3000, () => {
  console.log("Server Is Running");
});
