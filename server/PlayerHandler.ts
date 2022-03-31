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

  getTotalStats(socketId: string) {
    let index = 0;
    let aliveCount = 0;
    let indexOfPlayer = 0;
    let totalScore: number = 0;
    let scores: number[] = [];
    let names: string[] = [];
    let ranks: number[] = [];
    let playerIds: string[] = [];
    let isAlive: boolean = true;
    let totalPlayers = 0;
    for (let entry of this.players.entries()) {
      if (entry[0] == socketId) {
        indexOfPlayer = index;
        isAlive = entry[1].isAlive;
      }
      index++;
      totalScore += entry[1].score;
      scores.push(entry[1].score);
      playerIds.push(entry[1].id);
      names.push(entry[1].name);
      ranks.push(entry[1].ranks);
      if (entry[1].isAlive) aliveCount++;
      totalPlayers++;
    }
    return {
      totalScore: totalScore,
      playerIds: playerIds,
      isAlive: isAlive,
      scores: scores,
      names: names,
      ranks: ranks,
      totalPlayers: totalPlayers,
      indexOfPlayer: indexOfPlayer,
      aliveCount: aliveCount,
      maxRank: totalPlayers
    };
  }

  constructor() {
    this.players = new Map();
    this.idsToRegister = [];
  }
}
