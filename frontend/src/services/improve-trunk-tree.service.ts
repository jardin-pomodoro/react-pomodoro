import { NftRepository } from '../core/nft.repository';
import { Nft } from '../core/nft';

export class ImproveTrunkNftService {
  constructor(private readonly nftRepository: NftRepository) {}

  async handle(improveNftProps: { nft: Nft }): Promise<void> {
    await this.nftRepository.improveTrunk(improveNftProps.nft);
  }
}
