/* eslint-disable import/prefer-default-export */
import { Nft } from '../../core/nft';
import { NftRepository } from '../../core/nft.repository';

export class InMemoryNftRepository implements NftRepository {
  private nfts: Nft[] = [
    { id: '82781378133' },
    { id: '82781378132' },
    { id: '62738329' },
    { id: '73937193013' },
    { id: '39138173913' },
    { id: '3891393913' },
    { id: '3993103103' },
  ];

  async getAll(): Promise<Nft[]> {
    return this.nfts;
  }
}
