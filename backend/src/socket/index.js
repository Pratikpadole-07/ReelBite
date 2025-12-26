const { Server } = require("socket.io");

let io;

function initIO(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true
    }
  });

  io.on("connection", socket => {
    console.log("Socket connected:", socket.id);

    socket.on("join-user", userId => {
      socket.join(`user:${userId}`);
    });

    socket.on("join-partner", partnerId => {
      socket.join(`partner:${partnerId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}

module.exports = { initIO, getIO };
