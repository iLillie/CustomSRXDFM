import {setDriftlessTimeout} from "driftless";
import {Track} from "./Track";
import {Song} from "./Song";
import EventEmitter from "events";
import {TrackQueue} from "./TrackQueue";

export class SongHandler {
    queuedSongs: Song[];
    eventEmitter: EventEmitter;
    trackQueue: TrackQueue;


    newSong(startTime: number) {
        this.trackQueue.IncrementPos();
        let track = this.trackQueue.GetTracks(1)[0];
        return new Song(
            track.difficulty,
            track.name,
            track.leaderboardKey,
            startTime + 15000,
            this.trackTimeToMS(track.endTime)
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
        }, this.queuedSongs[0].endTime + 15000)
        this.addSongToQueue();
        this.eventEmitter.emit("nextSong");
    }


    setupQueue() {
        if (this.queuedSongs.length != 0) return;
        let globalStartTime = 0;
        let tracks: Track[] = this.trackQueue.GetTracks(3);
        for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i];
            this.queuedSongs.push(new Song(track.difficulty, track.name, track.leaderboardKey, Date.now() + globalStartTime, this.trackTimeToMS(track.endTime)))
            globalStartTime += this.trackTimeToMS(track.endTime + 15);
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

    constructor(trackQueue: TrackQueue) {
        this.queuedSongs = [];
        this.eventEmitter = new EventEmitter();
        this.trackQueue = trackQueue;
    }
}
