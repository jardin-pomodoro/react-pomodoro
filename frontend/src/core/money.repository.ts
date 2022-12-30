export default abstract class MoneyRepository {
  abstract getBalance(): Promise<number>;
}
