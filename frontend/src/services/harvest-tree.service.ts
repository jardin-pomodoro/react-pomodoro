import { NftRepository } from '../core';

export class HarvestTreeService {
  constructor(private readonly nftRepository: NftRepository) {}

  async handle(): Promise<number> {
    return this.nftRepository.harvestTree();
  }
}
