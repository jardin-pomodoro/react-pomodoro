import { NftRepository } from '../core/nft.repository';

export class GetNumberOfNftService {
  constructor(private readonly nftRepository: NftRepository) {}

  async handle(): Promise<number> {
    return this.nftRepository.getNumberOfExistingNft();
  }
}
