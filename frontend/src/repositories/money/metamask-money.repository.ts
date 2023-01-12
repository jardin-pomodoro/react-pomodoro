import { WalletState } from '@web3-onboard/core';
import { ethers } from 'ethers';
import { MoneyRepository } from '../../core';
import { SmartContractService } from '../../services/smart-contract.service';

export class MetamaskMoneyRepository implements MoneyRepository {
  constructor(private wallet: WalletState) {}

  async getBalance(): Promise<number> {
    const money = await SmartContractService.loadContract(this.wallet)
      .connect(this.wallet.accounts[0].address)
      .balanceOf(this.wallet.accounts[0].address, 0);
    return Number(ethers.BigNumber.from(money).toNumber());
  }
}
