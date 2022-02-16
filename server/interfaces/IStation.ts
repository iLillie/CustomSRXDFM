import { ITrackQueue } from './index';
export interface IStation { 
  id: string;
  name: string;
  descriptionFallback: string;
  descriptionKey: string;
  trackQueue: ITrackQueue;
}
