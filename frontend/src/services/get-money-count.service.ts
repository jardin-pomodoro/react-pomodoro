/* eslint-disable import/prefer-default-export */
import MoneyRepository from '../core/money.repository';

export class GetMoneyCountService {
  constructor(private readonly moneyRepository: MoneyRepository) {}

  async handle(): Promise<number> {
    const balance = await this.moneyRepository.getBalance();
    // eslint-disable-next-line no-console
    console.log(balance);
    return balance;
  }
}
