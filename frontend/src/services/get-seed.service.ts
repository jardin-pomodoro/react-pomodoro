import { Seed } from '../core/seed-free';
import { SeedRepository } from '../core/seed.repository';

export class GetSeedsService {
  constructor(private readonly seedFreeRepository: SeedRepository) {}

  async handle(): Promise<Seed[]> {
    // TODO implement
    return this.seedFreeRepository.getAllSeed();
  }
}
