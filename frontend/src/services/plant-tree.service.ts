import { NftRepository } from '../core/nft.repository';

export class PlantTreeService {
  constructor(private readonly nftRepository: NftRepository) {}

  async handle(parentTree: string): Promise<void> {
    await this.nftRepository.plantTree(parentTree);
  }
}
