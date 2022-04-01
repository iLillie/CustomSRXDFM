import { Player } from "./Player";

export class PlayerHandler {
  players: Map<string, Player>;
  idsToRegister: string[];
  getPlayer(socketId: string) {
    return this.players.get(socketId);
  }

  addPlayer(socketId: string, name: string, id: string) {
    this.idsToRegister.push(id);
    this.players.set(socketId, new Player(name, id));
  }

  removePlayer(socketId: string) {
    this.players.delete(socketId);
  }

  playerDied(socketId: string) {
    this.getPlayer(socketId).isAlive = false;
  }

  updateScore(socketId: string, newScore: number) {
    this.getPlayer(socketId).score = newScore;
  }

  calculateRanks() {
    let ranks = [...this.players.values()].sort(function (a, b) {
      return b.score - a.score;
    });

    for (let i = 0; i < ranks.length; i++) {
      ranks[i].ranks = i+1;
    }
  }

  getTotalScore() {
    const initialValue = 0;
    return [...this.players.values()].reduce(
        (previousValue, currentValue) => previousValue + currentValue.score,
        initialValue
    )
  }

  scores() {
    return [...this.players.values()].map(players => players.score);
  }

  names() {
    return [...this.players.values()].map(players => players.name);
  }

  playerIds() {
    return [...this.players.values()].map(players => players.id);
  }

  isAlive(socketId: string) {
    return this.getPlayer(socketId).isAlive;
  }

  indexOfPlayer(socketId: string) {
    return [...this.players.keys()].findIndex(value => value === socketId);
  }

  totalPlayers() {
    return this.players.size;
  }

  aliveCount() {
    return [...this.players.values()].filter(player => player.isAlive).length;
  }

  maxRank() {
    return [...this.players.values()].filter(player => player.ranks != null).length;
  }

  ranks() {
    return [...this.players.values()].map(player => player.ranks);
  }

  resetScore() {
    [...this.players.values()].forEach(player => {
      player.score = 0;
      player.ranks = 0;
    })
}




  getPlayerLeaderboard(socketId: string) {
    return {
      playerIds: this.playerIds(),
      names: this.names(),
      scores: this.scores(),
      isAlive: this.isAlive(socketId),
      indexOfPlayer: this.indexOfPlayer(socketId),
      totalScore: this.getTotalScore(),
      totalPlayers: this.totalPlayers(),
      aliveCount: this.aliveCount(),
      maxRank: this.maxRank(),
      ranks: this.ranks()
    }
  }

  constructor() {
    this.players = new Map();
    this.idsToRegister = [];
  }
}
