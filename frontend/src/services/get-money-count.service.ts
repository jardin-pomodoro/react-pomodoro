/* eslint-disable import/prefer-default-export */
import MoneyRepository from '../core/money.repository';

export class GetMoneyCountService {
  constructor(private readonly moneyRepository: MoneyRepository) {}

  async handle(): Promise<number> {
    return this.moneyRepository.getBalance();
  }
}
