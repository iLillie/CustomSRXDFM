class Station implements IStation {
  id: string;
  name: string;
  descriptionFallback: string;
  descriptionKey: string;
  trackQueue: ITrackQueue;
}