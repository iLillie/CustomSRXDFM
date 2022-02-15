import express from "express";
import { createServer } from "http";
import Server from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = Server(httpServer, {
  origins: ["*:*"],
  pingTimeout: 60000,
  pingInterval: 25000,
});
io.of("/CustomFM").on("connection", (socket) => {
  socket.on("ntp:client_sync", (d) => {
    socket.emit("ntp:server_sync", { t1: Date.now(), t0: d.t0 });
  });
  socket.on("username", (d) => {
  });
});

io.on("connection", (socket) => {});

app.get("/api/stations", function (req, res) {
  res.json({});
});

httpServer.listen(3000);
