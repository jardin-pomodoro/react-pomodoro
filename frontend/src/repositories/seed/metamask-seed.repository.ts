/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers } from 'ethers';
import { SeedFree } from '../../core/seed-free';
import { SeedRepository } from '../../core/seed.repository';

export default class MetamaskSeedRepository implements SeedRepository {
  constructor(
    private provider: ethers.providers.Web3Provider,
    private signer: ethers.Signer,
    private contract: ethers.Contract
  ) {}

  async getSeedFree(): Promise<SeedFree> {
    const seedFree = await this.contract.connect(this.signer).getSeedFree();
    return {
      numberSeed: Number(ethers.BigNumber.from(seedFree).toNumber()),
    };
  }

  async buySeed(tokenId: string, amount: number): Promise<void> {
    //await this.contract.connect(this.signer).buySeeds(tokenId, amount);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }

  async getPrice(): Promise<number> {
    const value = await this.contract
      .connect(this.signer)
      .getSeedCost(this.signer.getAddress());

    return Number(ethers.BigNumber.from(value).toNumber());
  }
}
