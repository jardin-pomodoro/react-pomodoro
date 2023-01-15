import { NftRepository } from '../core/nft.repository';

export class BuyNftService {
  constructor(private readonly nftRepository: NftRepository) {}

  async handle(): Promise<void> {
    await this.nftRepository.buyNft();
  }
}
