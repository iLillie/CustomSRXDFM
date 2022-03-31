import {setDriftlessTimeout} from "driftless";
import {Track} from "./Track";
import {Song} from "./Song";

export class SongHandler {
    queuedSongs: Song[];
    tracks: Track[];

    randomTrack = () => this.tracks[Math.floor(Math.random() * this.tracks.length)];


    // 3 songs
    // 1
    // callback - ends
    // 2
    //

    nextQueue() {
        this.queuedSongs.shift();
        let song = this.newSong(this.queuedSongs[1].endTime);
        this.queuedSongs.push(song);
    }

    newSong(startTime: number) {
        let randomTrack = this.randomTrack();
        return new Song(
            randomTrack.difficulty,
            randomTrack.name,
            randomTrack.leaderboardKey,
            startTime + 5000,
            this.trackTimeToMS(randomTrack.endTime)
        );
    }

    addSongToQueue() {
        let newSong = this.newSong(this.queuedSongs[1].startTime + this.queuedSongs[1].endTime)
        this.queuedSongs.push(newSong);
    }

    nextSong() {
        this.queuedSongs.shift();
        setDriftlessTimeout(() => {
            this.nextSong();
        }, this.queuedSongs[0].endTime + 5000)
        this.addSongToQueue();
    }


    setupQueue() {
        if (this.queuedSongs.length != 0) return;
        let globalStartTime = 0;
        for (let i = 0; i < 3; i++) {
            let track = this.randomTrack();
            this.queuedSongs.push(new Song(track.difficulty, track.name, track.leaderboardKey, Date.now() + globalStartTime, this.trackTimeToMS(track.endTime)))
            globalStartTime += this.trackTimeToMS(track.endTime + 5);
            if (i != 0) continue;
            setDriftlessTimeout(() => {
                this.nextSong();
            }, globalStartTime)
        }
    }

    trackTimeToMS(time: number) {
        return Math.floor(time * 1000);
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
