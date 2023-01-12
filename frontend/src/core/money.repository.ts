export abstract class MoneyRepository {
  abstract getBalance(): Promise<number>;
}
