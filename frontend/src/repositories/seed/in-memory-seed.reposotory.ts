/* eslint-disable class-methods-use-this */
import { SeedFree } from '../../core/seed-free';
import { SeedRepository } from '../../core/seed.repository';

// eslint-disable-next-line import/prefer-default-export
export class InMemorySeedRepository implements SeedRepository {
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
}
