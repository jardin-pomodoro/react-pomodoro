/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers } from 'ethers';
import { WalletState } from '@web3-onboard/core';
import { Seed, SeedFree } from '../../core/seed-free';
import { SeedRepository } from '../../core/seed.repository';
import { SmartContractService } from '../../services/smart-contract.service';

export class MetamaskSeedRepository implements SeedRepository {
  constructor(private wallet: WalletState) {}

  async getAllSeed(): Promise<Seed[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const seeds: any[] = await SmartContractService.loadContract(
      this.wallet
    ).getSeeds(this.wallet.accounts[0].address);
    return seeds.map((seed) => ({
      numberSeed: seed,
    }));
  }

  async getSeedFree(): Promise<SeedFree> {
    const seedFree = await SmartContractService.loadContract(
      this.wallet
    ).getSeeds();
    return {
      numberSeed: Number(ethers.BigNumber.from(seedFree).toNumber()),
    };
  }

  async buySeed(tokenId: string, amount: number): Promise<void> {
    await SmartContractService.loadContract(this.wallet).buySeeds(
      tokenId,
      amount
    );
  }

  async getPrice(): Promise<number> {
    const value = await SmartContractService.loadContract(
      this.wallet
    ).getSeedCost(this.wallet.accounts[0].address);

    return Number(ethers.BigNumber.from(value).toNumber());
  }
}
