interface ITrack {
  title: string;
  subTitle: string;
  artist: string;
  charter: string;
  difficulties: IDifficulty[];
}

class SpinShareTrack implements ITrack {
  title: string;
  subTitle: string;
  artist: string;
  charter: string;
  uploaderID: number;
  difficulties: IDifficulty[];
  assets: {
    cover: IAsset;
    audio: IAsset;
    zip: IAsset;
  }
  fileReference: IAsset;
}
