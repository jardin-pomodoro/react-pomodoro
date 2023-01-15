import { SeedRepository } from '../core';

export class GetSeedService {
  constructor(private readonly seedRepository: SeedRepository) {}

  async handle(tokenId: number): Promise<number> {
    return this.seedRepository.getSeed(tokenId);
  }

  async getSeeds(tokenId: number): Promise<number> {
    return this.seedRepository.getSeeds(tokenId);
  }
}
