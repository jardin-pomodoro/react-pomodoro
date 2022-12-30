/* eslint-disable import/prefer-default-export */
import { ethers } from 'ethers';
import { Nft } from '../../core/nft';
import { NftRepository } from '../../core/nft.repository';

interface NftMetadata {
  name: string;
  external_link: string;
  image: string;
  id: number;
}

export class MetamaskNftRepository implements NftRepository {
  constructor(
    private provider: ethers.providers.Web3Provider,
    private signer: ethers.Signer,
    private contract: ethers.Contract
  ) {}

  async getMetadata(nft: Nft): Promise<string> {
    const uriAssociated = await this.contract.connect(this.signer).uri(nft.id);
    try {
      const jsonFounded: NftMetadata = await (
        await fetch(uriAssociated)
      ).json();
      return jsonFounded.image;
    } catch (e) {
      return '';
    }
  }

  async merge(nfts1: string, nfts2: string): Promise<void> {
    // promise resolve in one second

    await this.contract.connect(this.signer).breedTree(nfts1, nfts2);
  }

  async improve(nft: Nft): Promise<void> {
    await this.contract.connect(this.signer).updateSeeds(nft.id);
  }

  async getAll(): Promise<Nft[]> {
    const adress = await this.signer.getAddress();
    const adresses = [
      adress,
      adress,
      adress,
      adress,
      adress,
      adress,
      adress,
      adress,
      adress,
      adress,
    ];
    const tokenAsked = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const nftFounded: number[] = [];
    const result = await this.contract.balanceOfBatch(adresses, tokenAsked);
    if (Array.isArray(result)) {
      result.forEach((element) => {
        if (ethers.BigNumber.from(element).toNumber() === 1) {
          nftFounded.push(tokenAsked[result.indexOf(element)]);
        }
      });
    }
    return nftFounded.map((id) => ({ id: id.toString() }));
  }
}
