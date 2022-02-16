import { IDifficulty } from "../interfaces";

class SRDifficulty implements IDifficulty {
  name: string;
  difficultyRating: number;
  noteHash: string;
  duration: number;
}