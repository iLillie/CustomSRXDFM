import { setDriftlessTimeout } from "driftless";
import { Track } from "./Track";
import { Song } from "./Song";

export class SongHandler {
  queuedSongs: Song[];
  tracks: Track[];

  randomTrack = () => this.tracks[Math.floor(Math.random() * this.tracks.length)];

  nextQueue() {
    this.queuedSongs.shift();
    let song = this.newSong(this.queuedSongs[1].endTime);
    this.queuedSongs.push(song);
    let firstEnd = song.endTime;
          setDriftlessTimeout(() => {
            console.log("Pog next song!");
            this.nextQueue();
          }, firstEnd);
  }

  newSong(previousEndTime: number) {
    let randomTrack = this.randomTrack();
    return new Song(
      randomTrack.difficulty,
      randomTrack.name,
      randomTrack.leaderboardKey,
      previousEndTime = Date.now() + previousEndTime,
      randomTrack.endTime * 1000 + (15 * 1000)
    );
  }

  updateQueue() {
    let endTime = 0;
    if (this.queuedSongs.length < 3) {
      for (let i = 0; i < 3; i++) {
        let song = this.newSong(endTime);
        this.queuedSongs.push(song);
        endTime += song.endTime;
        if (i == 0) {
          let firstEnd = song.endTime;
          setDriftlessTimeout(() => {
            console.log("Pog next song!");
            this.nextQueue();
          }, firstEnd);
        }
      }
    }
  }

  getStationSongs() {
    return this.queuedSongs.map(song => song.toStationObj())
  }


  getLeaderboardSongs() {
    return {
        difficulty: this.queuedSongs[0].difficulty,
        name: this.queuedSongs[0].name,
        startTime: Math.round(this.queuedSongs[0].startTime),
        topScore: 0,
        next: {
          difficulty: this.queuedSongs[1].difficulty,
          name: this.queuedSongs[1].name,
          startTime: Math.round(this.queuedSongs[1].startTime),
        }
      }
  }
  constructor(tracks: Track[]) {
    this.queuedSongs = [];
    this.tracks = tracks;
  }
}
