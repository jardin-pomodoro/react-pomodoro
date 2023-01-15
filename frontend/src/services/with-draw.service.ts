import { WalletState } from '@web3-onboard/core';
import { SmartContractService } from './smart-contract.service';

export class WithDrawService {
  constructor(private wallet: WalletState) {}

  async handle(): Promise<void> {
    await SmartContractService.loadContract(this.wallet).withdraw();
  }
}
