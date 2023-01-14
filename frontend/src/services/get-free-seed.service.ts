import { SeedRepository } from '../core/seed.repository';
import { SeedFree } from '../core/seed-free';

export class GetFreeSeedService {
  constructor(private readonly seedFreeRepository: SeedRepository) {}

  async handle(): Promise<SeedFree> {
    return this.seedFreeRepository.getSeedFree();
  }
}
