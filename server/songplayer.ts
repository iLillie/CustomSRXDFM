import EventEmitter from "events";

export default class SongPlayer {
    isPlaying: boolean;
    eventEmitter: EventEmitter
    currentSong: string
    constructor() {
        this.isPlaying = false;
        this.eventEmitter = new EventEmitter();
        this.currentSong = "";
    }

    playSong(name: string, time: number) {
        if(this.isPlaying) return;
        this.currentSong = name;
        this.isPlaying = true;
        setTimeout(this.songFinished, time);
    }

    songFinished() {
        this.isPlaying = false;
        this.eventEmitter.emit("songFinished");
        this.currentSong = "";
    }
}