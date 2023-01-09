import { SeedRepository } from '../core/seed.repository';

export class BuySeedService {
  constructor(private readonly seedFreeRepository: SeedRepository) {}

  async handle(BuyProps: { tokenId: string; amount: number }): Promise<void> {
    return this.seedFreeRepository.buySeed(BuyProps.tokenId, BuyProps.amount);
  }
}
