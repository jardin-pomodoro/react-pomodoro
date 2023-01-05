/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers } from 'ethers';
import { SeedFree } from '../../core/seed-free';
import { SeedRepository } from '../../core/seed.repository';
import { WalletState } from '@web3-onboard/core';
import { SmartContractService } from '../../services/smart-contract.service';

export default class MetamaskSeedRepository implements SeedRepository {
  constructor(private wallet: WalletState) {}

  async getSeedFree(): Promise<SeedFree> {
    const seedFree = await SmartContractService.loadContract(this.wallet)
      .connect(this.wallet.accounts[0].address)
      .getSeedFree();
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
    const value = await SmartContractService.loadContract(this.wallet)
      .connect(this.wallet.accounts[0].address)
      .getSeedCost(this.wallet.accounts[0].address);

    return Number(ethers.BigNumber.from(value).toNumber());
  }
}
