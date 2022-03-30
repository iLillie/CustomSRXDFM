// player stuff
export class Player {
  name: string;
  id: string;
  score: number;
  ranks: number;
  isAlive: boolean;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
    this.score = 0;
    this.ranks = 1;
    this.isAlive = true;
  }
}
