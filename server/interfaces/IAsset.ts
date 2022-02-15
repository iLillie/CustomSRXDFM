enum AssetType {
  Image,
  Audio,
  Zip
}


export interface IAsset {
  id: number;
  filePath: string;
  type: AssetType;
}