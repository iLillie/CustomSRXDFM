import EventEmitter from "events";
import SongPlayer from "./songplayer";

jest.useFakeTimers();
jest.spyOn(global, "setTimeout");

describe("SongPlayer", () => {
    test("Construct a new SongPlayer", () => {
        const songPlayer = new SongPlayer();
        expect(songPlayer.isPlaying).toBe(false);
        expect(songPlayer.eventEmitter).toBeInstanceOf(EventEmitter);
        expect(songPlayer.currentSong).toBe("");
    });
    test("Play a 10s song", () => {
        const songPlayer = new SongPlayer();
        const tenSecondsInMS = 10000;
        const songName = "Example Song";
        songPlayer.playSong(songName, tenSecondsInMS);
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(songPlayer.isPlaying).toBe(true);
        expect(songPlayer.currentSong).toBe(songName);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), tenSecondsInMS);
    });
})
