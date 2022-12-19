/* eslint-disable import/prefer-default-export */
import { SeedFree } from './seed-free';

export abstract class SeedFreeRepository {
  abstract getSeedFree(): Promise<SeedFree>;
}
