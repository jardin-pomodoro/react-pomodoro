/* eslint-disable class-methods-use-this */
import { Seed, SeedFree } from '../../core/seed-free';
import { SeedRepository } from '../../core/seed.repository';

export class InMemorySeedRepository implements SeedRepository {
  getAllSeed(): Promise<Seed[]> {
    throw new Error('Method not implemented.');
  }

  private seedFree: SeedFree = {
    numberSeed: 0,
  };

  async getSeedFree(): Promise<SeedFree> {
    return this.seedFree;
  }

  async buySeed(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }

  async getPrice(): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(1);
      }, 1000);
    });
  }

  async getSeed(tokenId: number): Promise<number> {
    throw new Error('Method not implemented.');
  }
}
