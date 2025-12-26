require("dotenv").config();
const http = require("http");
const app = require("./src/app");
const connectDB = require("./src/db/db");
const { initIO } = require("./src/socket");

connectDB();

const server = http.createServer(app);

// 🔥 INITIALIZE SOCKET HERE
initIO(server);

server.listen(3000, () => {
  console.log("Server running on 3000");
});
