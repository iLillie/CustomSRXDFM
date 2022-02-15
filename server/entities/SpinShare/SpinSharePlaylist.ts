class SpinSharePlaylist implements IPlaylist {
  version: number;
  id: number;
  title: string;
  description: string;
  songs: ITrack[];
  isOfficial: boolean;
}