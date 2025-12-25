require("dotenv").config();
const http = require("http");
const app = require("./src/app");
const connectDB = require("./src/db/db");
const initSocket = require("./src/socket");

connectDB();

const server = http.createServer(app);

// 🔥 initialize socket.io with server
initSocket(server);

server.listen(3000, () => {
  console.log("Server running on 3000");
});
