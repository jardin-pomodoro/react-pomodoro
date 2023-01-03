import { ethers } from 'ethers';
import MoneyRepository from '../../core/money.repository';

export default class MetamaskMoneyRepository implements MoneyRepository {
  constructor(
    private provider: ethers.providers.Web3Provider,
    private signer: ethers.Signer,
    private contract: ethers.Contract
  ) {}

  async getBalance(): Promise<number> {
    const money = await this.contract
      .connect(this.signer)
      .balanceOf(this.signer.getAddress(), 0);
    return Number(ethers.BigNumber.from(money).toNumber());
  }
}
