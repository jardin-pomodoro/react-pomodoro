import { Nft } from '../core/nft';
import { NftRepository } from '../core/nft.repository';

export class BuyFirstNftService {
  constructor(private readonly nftRepository: NftRepository) {}

  async handle(nftsOwned: Nft[]): Promise<void> {
    if (nftsOwned.length > 0) return;
    await this.nftRepository.buyNft();
  }
}
