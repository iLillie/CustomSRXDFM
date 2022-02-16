import { IDifficulty } from './index';
export interface ITrack {
  title: string;
  subTitle: string;
  artist: string;
  charter: string;
  difficulties: IDifficulty[];
}

