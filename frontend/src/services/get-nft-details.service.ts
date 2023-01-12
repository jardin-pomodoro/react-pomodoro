import { NftDetails, NftRepository } from '../core';
import { GetSeedService } from './get-seed.service';

export class GetNftDetailsService {
  constructor(
    private readonly nftRepository: NftRepository,
    private readonly getSeedService: GetSeedService
  ) {}

  async handle(tokenId: number): Promise<NftDetails> {
    const seed = await this.getSeedService.handle(tokenId);
    const seedInString = seed.toString();
    const leavesString = seedInString.slice(0, 2);
    const trunkString = seedInString.slice(3, 6);
    const leavesValue: number = leavesString
      .split('')
      .reduce((a, b) => a + parseInt(b, 10), 0);
    const trunkValue: number = trunkString
      .split('')
      .reduce((a, b) => a + parseInt(b, 10), 0);
    const leaves = await this.nftRepository.getLeavesUpgradePrice(
      { id: tokenId.toString() },
      leavesValue
    );
    const trunk = await this.nftRepository.getTrunkUpgradePrice(
      { id: tokenId.toString() },
      trunkValue
    );

    const nftUpgradeStats = await this.nftRepository.getUpgradeStats({
      id: tokenId.toString(),
    });

    return {
      seed,
      leavesUpgradePrice: leaves,
      trunkUpgradePrice: trunk,
      leavesStats: leavesValue + nftUpgradeStats.leavesUpgrade,
      trunkStats: trunkValue + nftUpgradeStats.trunkUpgrade,
      maxUpgrade: nftUpgradeStats.maxUpgrade,
      leavesUpgradeCount: nftUpgradeStats.leavesUpgrade,
      trunkUpgradeCount: nftUpgradeStats.trunkUpgrade,
      maxBreed: 2,
    };
  }
}
