
export class Song {
  difficulty: string;
  name: string;
  startTime: number;
  endTime: number;
  leaderboardKey: string;

  toStationObj() {
    return {name: this.name, difficulty: this.difficulty, leaderboardKey: this.leaderboardKey, topScore: 0};
  }
  constructor(
    difficulty: string,
    name: string,
    leaderboardKey: string,
    startTime: number,
    endTime: number
  ) {
    this.difficulty = difficulty;
    this.name = name;
    this.startTime = startTime;
    this.leaderboardKey = leaderboardKey;
    this.endTime = endTime;
  }
}
