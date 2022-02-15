interface IDifficulty {
  name: string; 
  difficultyRating: number;
}

class SRDifficulty implements IDifficulty {
  name: string;
  difficultyRating: number;
  noteHash: string;
  duration: number;
}