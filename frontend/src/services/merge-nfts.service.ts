/* eslint-disable import/prefer-default-export */
import { NftRepository } from '../core/nft.repository';

export class MergeNftsService {
  constructor(private readonly nftRepository: NftRepository) {}

  async handle(mergeNftProps: { nft1: string; nft2: string }): Promise<void> {
    await this.nftRepository.merge(mergeNftProps.nft1, mergeNftProps.nft2);
  }
}
