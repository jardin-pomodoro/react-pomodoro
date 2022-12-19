/* eslint-disable import/prefer-default-export */
import { SeedFreeRepository } from '../core/seed.repository';
import { SeedFree } from '../core/seed-free';

export class GetFreeSeedService {
  constructor(private readonly seedFreeRepository: SeedFreeRepository) {}

  async handle(): Promise<SeedFree> {
    return this.seedFreeRepository.getSeedFree();
  }
}
