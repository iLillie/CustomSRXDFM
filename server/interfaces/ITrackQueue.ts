import { IPlaylist } from './index';
enum QueueType {
  Order,
  Shuffle,
}

export interface ITrackQueue {
  type: QueueType;
  playlist: IPlaylist;
}