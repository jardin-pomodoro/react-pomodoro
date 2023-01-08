import { SeedRepository } from '../core/seed.repository';

export class GetSeedService {
  constructor(private readonly seedRepository: SeedRepository) {}

  async handle(tokenId: number): Promise<number> {
    return this.seedRepository.getSeed(tokenId);
  }
}
