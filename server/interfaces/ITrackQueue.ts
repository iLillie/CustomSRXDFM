enum QueueType {
  Order,
  Shuffle,
}

interface ITrackQueue {
  type: QueueType;
  playlist: IPlaylist;
}