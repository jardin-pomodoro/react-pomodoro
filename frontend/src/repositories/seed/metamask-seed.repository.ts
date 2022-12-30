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
    console.log(this.contract.connect(this.signer).getSeedFree());
    throw new Error('Method not implemented.');
  }

  async buySeed(tokenId: string, amount: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getPrice(): Promise<number> {
    const value = await this.contract
      .connect(this.signer)
      .getSeedCost(this.signer.getAddress());
    console.log(ethers.BigNumber.from(value).toNumber())
    return Number(ethers.BigNumber.from(value).toNumber());
  }
}
