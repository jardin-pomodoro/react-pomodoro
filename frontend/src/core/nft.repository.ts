import { Nft } from './nft';

// eslint-disable-next-line import/prefer-default-export
export abstract class NftRepository {
  abstract getAll(): Promise<Nft[]>;
  abstract getNumberOfExistingNft(): Promise<number>;
  abstract merge(nfts1: string, nfts2: string): Promise<void>;
  abstract improveLeaves(nft: Nft): Promise<void>;
  abstract improveTrunk(nft: Nft): Promise<void>;
  abstract getMetadata(nft: Nft): Promise<string>;
  abstract buyNft(): Promise<void>;
  abstract plantTree(parentTree: number): Promise<void>;
}
