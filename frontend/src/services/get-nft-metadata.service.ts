/* eslint-disable import/prefer-default-export */
import { NftRepository } from '../core/nft.repository';
import { Nft } from '../core/nft';

export class GetNftMetadataService {
  constructor(private readonly nftRepository: NftRepository) {}

  async handle(nft: Nft): Promise<string> {
    return this.nftRepository.getMetadata(nft);
  }
}
