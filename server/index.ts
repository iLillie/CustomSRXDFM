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
  console.log("Worked?");

  socket.on("ntp:client_sync", (d) => {
    socket.emit("ntp:server_sync", { t1: Date.now(), t0: d.t0 });
    console.log("synced");
  });
  socket.on("username", (d) => {
    //leaderboardResp = {"scores":[0],"names":[d["name"]],"ranks":[1],"playerIds":[d["id"]],"song":{"name":"This Is It","difficulty":"XD","leaderboardKey":"This Is It_XD_21","startTime":1629711092030.8003,"topScore":741650,"next":{"name":"Go Outside","difficulty":"XD","leaderboardKey":"Go Outside_XD_13","startTime":1629711442501.9001}},"totalScore":0,"maxRank":1,"totalPlayers":1,"aliveCount":1,"indexOfPlayer":0,"isAlive":true,"playerIdsToRegister":["76561198249679284"],"playerIdsToUnregister":[]}
    console.log(d);
  });
});
io.on("connection", (socket) => {});

app.get("/api/stations", function (req, res) {
  res.json({
    stations: [
      {
        id: "CustomFM",
        name: "CustomFM",
        players: 0,
        cover: "",
        nextSongs: [
          {
            name: "",
            difficulty: "Hard",
            startTime: Date.now(),
            topScore: 0,
          },
          {
            name: "",
            difficulty: "Hard",
            startTime: Date.now(),
            topScore: 0,
          },
          {
            name: "",
            difficulty: "Hard",
            startTime: Date.now(),
            topScore: 0,
          },
        ],
        descriptionFallback: "",
        descriptionKey: "",
      },
    ],
  });
});

httpServer.listen(3000);
