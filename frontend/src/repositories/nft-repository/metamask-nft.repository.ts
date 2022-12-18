/* eslint-disable import/prefer-default-export */
import { Nft } from '../../core/nft';
import { NftRepository } from '../../core/nft.repository';

export class MetamaskNftRepository implements NftRepository {
  async merge(nfts1: Nft[], nfts2: Nft[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async getAll(): Promise<Nft[]> {
    return [];
  }
}
