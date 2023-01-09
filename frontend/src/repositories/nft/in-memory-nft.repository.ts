/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import { Nft } from '../../core/nft';
import { NftRepository } from '../../core/nft.repository';

export class InMemoryNftRepository implements NftRepository {
  private static nfts: Nft[] = [
    { id: '82781378133' },
    { id: '82781378132' },
    { id: '62738329' },
    { id: '73937193013' },
    { id: '39138173913' },
    { id: '3891393913' },
    { id: '3993103103' },
  ];

  async plantTree(parentTree: number): Promise<void> {
    return Promise.resolve(undefined); // TODO
  }

  async getAll(): Promise<Nft[]> {
    console.log('result de getAll', InMemoryNftRepository.nfts);
    return InMemoryNftRepository.nfts;
  }

  async merge(nfts1: string, nfts2: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`c'est bien merge ${nfts1} ${nfts2}`);
        InMemoryNftRepository.nfts.push({ id: 'newNftCreated' });
        console.log(InMemoryNftRepository.nfts);
        resolve();
      }, 1000);
    });
  }

  async getNumberOfExistingNft(): Promise<number> {
    throw new Error('Method not implemented.');
  }

  async improveLeaves(nft: Nft): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`${nft.id}has been improved`);
        resolve();
      }, 2000);
    });
  }

  async improveTrunk(nft: Nft): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`${nft.id}has been improved`);
        resolve();
      }, 2000);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getMetadata(nft: Nft): Promise<string> {
    throw new Error('Method not implemented.');
  }

  buyNft(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
