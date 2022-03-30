import express from "express";
import Server from "socket.io";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);
const customTracks: Track[] = require("./tracks.json");

import { setDriftlessTimeout } from "driftless";
import { PlayerHandler } from "./PlayerHandler";
import { SongHandler } from "./SongHandler";
import { Track } from "./Track";

const io = Server(httpServer, {
  origins: ["*:*"],
  pingTimeout: 60000,
  pingInterval: 25000,
});

io.use(require("socketio-wildcard")());

class Station {
  id: string;
  name: string;
  cover: string;
  playerHandler: PlayerHandler;
  songHandler: SongHandler;

  descriptionFallback: string;
  descriptionKey: string;

  constructor(id: string, name: string, cover: string, tracks: Track[]) {
    this.id = id;
    this.name = name;
    this.cover = cover;
    this.songHandler = new SongHandler(tracks);
    this.playerHandler = new PlayerHandler();
  }

  getStation() {
    return {
      id: this.id,
      name: this.name,
      players: this.playerHandler.players.size,
      nextSongs: this.songHandler.getStationSongs(),
      cover: this.cover,
      descriptionFallback: "",
      descriptionKey: ""
    }
  }

  getLeaderboard(socketId: string) {
    return {
      song: this.songHandler.getLeaderboardSongs(),
      ...this.playerHandler.getTotalStats(socketId),
      playerIdsToRegister: this.playerHandler.idsToRegister,
      playerIdsToUnregister: [],
      maxRank: 1
    }
  }
  setupStation() {
    this.songHandler.updateQueue();
  }
}

// TODO

let leaderboard: Station = new Station(
  "CustomFM",
  "CustomFM",
  "Cover-SpinFM1-Easy-Cruise",
  customTracks.filter(track => track.difficulty == "Normal")
);

leaderboard.setupStation();

// Handlers

function handleEmote(socket: Server.Socket, data: any) {
  let emote: string = data.val;
  if (emote === "Skull") {
    leaderboard.playerHandler.playerDied(socket.conn.id);
    return;
  }
  let playerId = leaderboard.playerHandler.getPlayer(socket.conn.id).id;
  socket.emit("emote", { emote: emote, playerId: playerId });
}

function handleSync(socket: Server.Socket, data: any) {
  socket.emit("ntp:server_sync", { t0: data.t0, t1: Date.now() });
  socket.emit("leaderboard", leaderboard.getLeaderboard(socket.conn.id));
}

function handlePlayer(socket: Server.Socket, data: any) {
  leaderboard.playerHandler.addPlayer(socket.conn.id, data.name, data.id);
  console.log(leaderboard.getLeaderboard(socket.conn.id));
  socket.emit("leaderboard", leaderboard.getLeaderboard(socket.conn.id));
}

function handleScore(socket: Server.Socket, data: any) {
  leaderboard.playerHandler.updateScore(socket.conn.id, data.val);
  socket.emit("leaderboard", leaderboard.getLeaderboard(socket.conn.id));
}

function handleDisconnect(socket: Server.Socket) {
  leaderboard.playerHandler.removePlayer(socket.conn.id);
}

io.of("/CustomFM").on("connection", (socket) => {
  socket.on("ntp:client_sync", (d) => {
    handleSync(socket, d);
  });

  socket.on("username", (d) => {
    handlePlayer(socket, d);
  });

  socket.on("score", (d) => {
    handleScore(socket, d);
  });

  socket.on("disconnect", () => {
    handleDisconnect(socket);
  });

  socket.on("emotein", (d) => {
    handleEmote(socket, d);
  });
});


app.get("/api/stations", function (req, res) {
  res.json({
    stations: [
      leaderboard.getStation()
    ],
  });
});

app.all("/**", function (req, res) {
  console.log(req.url);
});

const port = 3000;
httpServer.listen(port, () => {
  console.log(`SRXDFM server is running on ${port}.`);
});
