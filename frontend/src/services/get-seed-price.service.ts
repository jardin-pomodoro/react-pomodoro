import { SeedRepository } from '../core/seed.repository';

export class GetSeedPriceService {
  constructor(private readonly seedRepository: SeedRepository) {}

  async handle(): Promise<number> {
    return this.seedRepository.getPrice();
  }
}
