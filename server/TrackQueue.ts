import {Track} from "./Track";

export class TrackQueue {
    trackList: Track[];
    pos: number;

    IncrementPos() {
        if(this.pos >= this.trackList.length) {
            this.pos = 0;
            return;
        }
        this.pos++;
    }

    GetTracks(amount: number) {
        let tracks: Track[] = [];
        for (let i = 0; i < amount; i++) {
            let indexToGet: number = this.pos + i;
            if(indexToGet > this.trackList.length) {
                indexToGet = 0 + i;
            }
            tracks.push(this.trackList[indexToGet]);
        }
        return tracks;
    }

    constructor(trackList: Track[], startPos: number) {
        this.trackList = trackList;
        this.pos = startPos;
    }
}