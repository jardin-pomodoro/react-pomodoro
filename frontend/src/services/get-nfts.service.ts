import { Nft } from '../core/nft';
import { NftRepository } from '../core/nft.repository';

export class GetNftsService {
  constructor(private readonly nftRepository: NftRepository) {}

  async handle(): Promise<Nft[]> {
    console.log('dans le getAll');
    return this.nftRepository.getAll();
  }
}
