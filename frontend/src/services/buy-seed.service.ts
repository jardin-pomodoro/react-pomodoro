/* eslint-disable import/prefer-default-export */
import { SeedFreeRepository } from '../core/seed.repository';

export class BuySeedService {
  constructor(private readonly seedFreeRepository: SeedFreeRepository) {}

  async handle(BuyProps: { tokenId: string; amount: number }): Promise<void> {
    return this.seedFreeRepository.BuySeed(BuyProps.tokenId, BuyProps.amount);
  }
}
