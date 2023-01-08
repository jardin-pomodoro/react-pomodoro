/* eslint-disable import/prefer-default-export */
import { Seed, SeedFree } from './seed-free';

export abstract class SeedRepository {
  abstract getSeedFree(): Promise<SeedFree>;
  abstract buySeed(tokenId: string, amount: number): Promise<void>;
  abstract getPrice(): Promise<number>;
  abstract getAllSeed(): Promise<Seed[]>;
}
