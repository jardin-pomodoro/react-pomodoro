export default abstract class MoneyRepository {
  getBalance(): Promise<number>;
}
