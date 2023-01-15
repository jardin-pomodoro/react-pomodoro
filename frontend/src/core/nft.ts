export interface NftDetails {
  seed: number;
  leavesUpgradePrice: number;
  trunkUpgradePrice: number;
  leavesStats: number;
  trunkStats: number;
  maxUpgrade: number;
  maxBreed: number;
  leavesUpgradeCount: number;
  trunkUpgradeCount: number;
  breedCount: number;
}

export interface Nft {
  id: string;
  image?: string;
  detail?: NftDetails;
  fert?: number;
}
