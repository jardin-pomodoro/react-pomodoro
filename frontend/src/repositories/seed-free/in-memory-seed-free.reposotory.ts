import { SeedFree } from '../../core/seed-free';
import { SeedFreeRepository } from '../../core/seed.repository';

// eslint-disable-next-line import/prefer-default-export
export class InMemorySeedFreeRepository implements SeedFreeRepository {
  private seedFree: SeedFree = {
    numberSeed: 0,
  };

  async getSeedFree(): Promise<SeedFree> {
    return this.seedFree;
  }

  async BuySeed(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }
}
