import { Nft } from './nft';

// eslint-disable-next-line import/prefer-default-export
export abstract class NftRepository {
  abstract getAll(): Promise<Nft[]>;
}
