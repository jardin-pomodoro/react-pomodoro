/* eslint-disable import/prefer-default-export */
import { NftRepository } from '../core/nft.repository';

export class PlantTreeService {
  constructor(private readonly nftRepository: NftRepository) {}

  async handle(parentTree: number): Promise<void> {
    await this.nftRepository.plantTree(parentTree);
  }
}
