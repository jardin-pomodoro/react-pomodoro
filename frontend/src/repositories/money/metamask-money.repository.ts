import { ethers } from 'ethers';
import MoneyRepository from '../../core/money.repository';
import { SmartContractService } from '../../services/smart-contract.service';

export default class MetamaskMoneyRepository implements MoneyRepository {
  constructor(private wallet: WalletState) {}

  async getBalance(): Promise<number> {
    const money = await SmartContractService.loadContract(this.wallet)
      .growTreeContract.connect(this.wallet.SignerWithAddress)
      .balanceOf(this.wallet.SignerWithAddress, 0);
    return Number(ethers.BigNumber.from(money).toNumber());
  }
}
