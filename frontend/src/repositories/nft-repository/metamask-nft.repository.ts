/* eslint-disable import/prefer-default-export */
import { Nft } from '../../core/nft';
import { NftRepository } from '../../core/nft.repository';

export class MetamaskNftRepository implements NftRepository {
  async getAll(): Promise<Nft[]> {
    return [];
  }
}
