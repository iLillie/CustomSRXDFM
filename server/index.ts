import express from "express";
import Server from "socket.io";
import {createServer} from "http";

const app = express();
const httpServer = createServer(app);
const customTracks: Track[] = require("./tracks.json");

import {setDriftlessTimeout} from "driftless";
import {PlayerHandler} from "./PlayerHandler";
import {SongHandler} from "./SongHandler";
import {Track} from "./Track";
import {TrackQueue} from "./TrackQueue";

const port = process.env.PORT || 3000;


const io = Server(httpServer);

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
        this.songHandler = new SongHandler(new TrackQueue(tracks, 0));
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

let stationXD: Station = new Station(
    "CustomFM",
    "CustomFM XD",
    "Cover-SpinFM1-Easy-Cruise",
    customTracks.filter(track => track.difficulty == "XD")
);

stationXD.setupStation();

let stationEx: Station = new Station(
    "CustomFM2",
    "CustomFM Expert",
    "Cover-SpinFM1-Easy-Cruise",
    customTracks.filter(track => track.difficulty == "Expert")
);

stationEx.setupStation();


let stationHard: Station = new Station(
    "CustomFM3",
    "CustomFM Hard",
    "Cover-SpinFM1-Easy-Cruise",
    customTracks.filter(track => track.difficulty == "Hard")
);

stationHard.setupStation();

// Handlers

function handleEmote(socket: Server.Socket, data: any, station: Station) {
    let emote: string = data.val;
    if (emote === "Skull") {
        station.playerHandler.playerDied(socket.conn.id);
        return;
    }
    let playerId = station.playerHandler.getPlayer(socket.conn.id).id;
    socket.nsp.emit("emote", {emote: emote, playerId: playerId});
}

function handleSync(socket: Server.Socket, data: any, station: Station) {
    socket.emit("ntp:server_sync", {t0: data.t0, t1: Date.now()});
}

function handlePlayer(socket: Server.Socket, data: any, station: Station) {
    station.playerHandler.addPlayer(socket.conn.id, data.name, data.id);
    console.log(`Added player: ${socket.conn.id} : ${data.name}`);
    socket.emit("leaderboard", station.getLeaderboard(socket.conn.id));
}

function handleScore(socket: Server.Socket, data: any, station: Station) {
    station.playerHandler.updateScore(socket.conn.id, data.val);
    socket.emit("leaderboard", station.getLeaderboard(socket.conn.id));
}

function handleDisconnect(socket: Server.Socket, station: Station) {
    station.playerHandler.removePlayer(socket.conn.id);
}

let nspArray = ["CustomFM", "CustomFM2", "CustomFM3"];
let stationArray = [stationXD, stationEx, stationHard];

for (let i = 0; i < 2; i++) {
    io.of(`/${nspArray[i]}`).on("connection", (socket) => {
        socket.on("ntp:client_sync", (d) => {
            handleSync(socket, d, stationArray[i]);
        });


        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });

        socket.on("username", (d) => {
            handlePlayer(socket, d, stationArray[i]);
        });

        socket.on("score", (d) => {
            handleScore(socket, d, stationArray[i]);
        });

        socket.on("disconnect", () => {
            console.log()
            handleDisconnect(socket, stationArray[i]);
        });

        socket.on("emotein", (d) => {
            handleEmote(socket, d, stationArray[i]);
        });

        stationArray[i].songHandler.eventEmitter.on("nextSong", () => {
            stationArray[i].playerHandler.resetScore();
            if (stationArray[i].playerHandler.getPlayer(socket.conn.id) == null) return;
            socket.emit("leaderboard", stationArray[i].getLeaderboard(socket.conn.id));
        })
    });
}

    /*
    io.of("/CustomFM").on("connection", (socket) => {
      socket.on("ntp:client_sync", (d) => {
        handleSync(socket, d, leaderboard);
      });


      socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });

      socket.on("username", (d) => {
        handlePlayer(socket, d, leaderboard);
      });

      socket.on("score", (d) => {
        handleScore(socket, d, leaderboard);
      });

      socket.on("disconnect", () => {
        console.log()
        handleDisconnect(socket, leaderboard);
      });

      socket.on("emotein", (d) => {
        handleEmote(socket, d, leaderboard);
      });

      leaderboard.songHandler.eventEmitter.on("nextSong", () => {
        leaderboard.playerHandler.resetScore();
        if(leaderboard2.playerHandler.getPlayer(socket.conn.id) == null) return;
        socket.emit("leaderboard", leaderboard.getLeaderboard(socket.conn.id));
      })
    });

    io.of("/CustomFM2").on("connection", (socket) => {
      socket.on("ntp:client_sync", (d) => {
        handleSync(socket, d, leaderboard2);
      });


      socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
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

      leaderboard2.songHandler.eventEmitter.on("nextSong", () => {
        leaderboard2.playerHandler.resetScore();
        if(leaderboard2.playerHandler.getPlayer(socket.conn.id) == null) return;
        socket.emit("leaderboard", leaderboard2.getLeaderboard(socket.conn.id));
      })
    */





app.get("/api/stations", function (req, res) {
    res.json({
        stations: [
            stationXD.getStation(),
            stationEx.getStation(),
            stationHard.getStation()
        ],
    });
});

httpServer.listen(port, () => {
    console.log(`SRXDFM server is running on ${port}.`);
});
