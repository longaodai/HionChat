import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const app = express();
const http = createServer(app);
const io = new Server(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["*"],
  },
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});

const corsOrigin = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOrigin));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("chat-message", (message) => {
    console.log(message);
    io.emit("chat-message", message);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

http.listen(3001, () => {
  console.log("Server is running on port 3001");
});
