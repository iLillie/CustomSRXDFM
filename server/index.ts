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

const port = process.env.PORT || 3000;

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
    this.descriptionFallback = "";
    this.descriptionKey = "";
  }

  getStation() {
    return {
      id: this.id,
      name: this.name,
      players: this.playerHandler.players.size,
      nextSongs: this.songHandler.getStationSongs(),
      cover: this.cover,
      descriptionFallback: this.descriptionFallback,
      descriptionKey: this.descriptionKey
    }
  }

  getLeaderboard(socketId: string) {
    this.playerHandler.calculateRanks();
    return {
      song: this.songHandler.getLeaderboardSongs(),
      ...this.playerHandler.getPlayerLeaderboard(socketId),
      playerIdsToRegister: this.playerHandler.idsToRegister,
      playerIdsToUnregister: [],
    }
  }
  setupStation() {
    this.songHandler.setupQueue();
  }
}

// TODO

let leaderboard: Station = new Station(
  "CustomFM",
  "CustomFM",
  "Cover-SpinFM1-Easy-Cruise",
  customTracks.filter(track => track.difficulty == "XD")
);

leaderboard.setupStation();

let leaderboard2: Station = new Station(
    "CustomFM2",
    "CustomFM Expert",
    "Cover-SpinFM1-Easy-Cruise",
    customTracks.filter(track => track.difficulty == "Expert")
);

leaderboard2.setupStation();

// Handlers

function handleEmote(socket: Server.Socket, data: any, station: Station) {
  let emote: string = data.val;
  if (emote === "Skull") {
    station.playerHandler.playerDied(socket.conn.id);
    return;
  }
  let playerId = station.playerHandler.getPlayer(socket.conn.id).id;
  socket.nsp.emit("emote", { emote: emote, playerId: playerId });
}

function handleSync(socket: Server.Socket, data: any, station: Station) {
  socket.emit("ntp:server_sync", { t0: data.t0, t1: Date.now() });
  if(station.playerHandler.getPlayer(socket.conn.id) == undefined) return;
  socket.emit("leaderboard", station.getLeaderboard(socket.conn.id));
}

function handlePlayer(socket: Server.Socket, data: any, station: Station) {
  station.playerHandler.addPlayer(socket.conn.id, data.name, data.id);
  socket.emit("leaderboard", station.getLeaderboard(socket.conn.id));
}

function handleScore(socket: Server.Socket, data: any, station: Station) {
  station.playerHandler.updateScore(socket.conn.id, data.val);
  socket.emit("leaderboard", station.getLeaderboard(socket.conn.id));
}

function handleDisconnect(socket: Server.Socket, station: Station) {
  station.playerHandler.removePlayer(socket.conn.id);
}

io.of("/CustomFM").on("connection", (socket) => {
  socket.on("ntp:client_sync", (d) => {
    handleSync(socket, d, leaderboard);
  });

  socket.on("username", (d) => {
    handlePlayer(socket, d, leaderboard);
  });

  socket.on("score", (d) => {
    handleScore(socket, d, leaderboard);
  });

  socket.on("disconnect", () => {
    handleDisconnect(socket, leaderboard);
  });

  socket.on("emotein", (d) => {
    handleEmote(socket, d, leaderboard);
  });
});

io.of("/CustomFM2").on("connection", (socket) => {
  console.log(`Id: ${socket.id} conn.id: ${socket.conn.id}`)
  socket.on("ntp:client_sync", (d) => {
    handleSync(socket, d, leaderboard2);
  });

  socket.on("username", (d) => {
    handlePlayer(socket, d, leaderboard2);
  });

  socket.on("score", (d) => {
    handleScore(socket, d, leaderboard2);
  });

  socket.on("disconnect", () => {
    handleDisconnect(socket, leaderboard2);
  });

  socket.on("emotein", (d) => {
    handleEmote(socket, d, leaderboard2);
  });
});

app.get("/api/stations", function (req, res) {
  res.json({
    stations: [
      leaderboard.getStation(),
        leaderboard2.getStation()
    ],
  });
});

app.all("/**", function (req, res) {
  console.log(req.url);
});

httpServer.listen(port, () => {
  console.log(`SRXDFM server is running on ${port}.`);
});
