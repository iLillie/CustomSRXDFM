interface Song {
    startTime: number,
    name: string,
    difficulty: TrackDifficulty,
}

interface DesiredSong extends Song{
    topScore: number,
    next: Song,
}

