/* eslint-disable import/prefer-default-export */
import { SeedFree } from './seed-free';

export abstract class SeedRepository {
  abstract getSeeds(tokenId: number): Promise<number>;
  abstract getSeedFree(): Promise<SeedFree>;
  abstract buySeed(tokenId: string, amount: number): Promise<void>;
  abstract getPrice(): Promise<number>;
  abstract getSeed(tokenId: number): Promise<number>;
}
