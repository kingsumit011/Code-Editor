const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const http = require("http");
const { Server } = require("socket.io");
const ACTIONS = require("./src/Action");

const httpServer = http.createServer(app);
const io = new Server(httpServer);
const path = require('path');

app.use(express.static("build"));
app.use((req , res,next) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

const userSocketMap = {};

function getAllConnectedUsers(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        userName: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, userName }) => {
    userSocketMap[socket.id] = userName;
    console.log("join", roomId, userName);
    socket.join(roomId);

    const clients = getAllConnectedUsers(roomId);
    console.log("clients", clients);
    clients.forEach(({ socketId }) => {
      console.log("socketId Event", socketId);
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        userName,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    console.log("code-change", code);
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });
  socket.on(ACTIONS.SYNC_CODE, ({ code, socketId }) => {
    console.log("code-change", code);
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      console.log("disconnecting", roomId);
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        userName: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
