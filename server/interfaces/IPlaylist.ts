import { ITrack } from './index';

export interface IPlaylist {
  version: number;
  id: number;
  title: string;
  description: string;
  songs: ITrack[];
}


