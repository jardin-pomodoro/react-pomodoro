/* eslint-disable import/prefer-default-export */
import { NftRepository } from '../core/nft.repository';
import { Nft } from '../core/nft';

export class ImproveNftService {
  constructor(private readonly nftRepository: NftRepository) {}

  async handle(improveNftProps: { nft: Nft }): Promise<void> {
    await this.nftRepository.improve(improveNftProps.nft);
  }
}
