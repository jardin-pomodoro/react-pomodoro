/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers } from 'ethers';
import { SeedFree } from '../../core/seed-free';
import { SeedRepository } from '../../core/seed.repository';
import { WalletState } from '@web3-onboard/core';

export default class MetamaskSeedRepository implements SeedRepository {
  constructor(private wallet: WalletState) {}

  async getSeedFree(): Promise<SeedFree> {
    /*const seedFree = await this.contract.connect(this.signer).getSeedFree();
    return {
      numberSeed: Number(ethers.BigNumber.from(seedFree).toNumber()),
    };*/
    return {
      numberSeed: 0,
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
    /*const value = await this.contract
      .connect(this.signer)
      .getSeedCost(this.signer.getAddress());

    return Number(ethers.BigNumber.from(value).toNumber());*/
    return 1;
  }
}
