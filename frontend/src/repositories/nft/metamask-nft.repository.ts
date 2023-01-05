/* eslint-disable import/prefer-default-export */
import { ethers } from 'ethers';
import { WalletState } from '@web3-onboard/core';
import { Nft } from '../../core/nft';
import { NftRepository } from '../../core/nft.repository';

interface NftMetadata {
  name: string;
  external_link: string;
  image: string;
  id: number;
}

export class MetamaskNftRepository implements NftRepository {
  constructor(private wallet: WalletState) {}

  async improveLeaves(nft: Nft): Promise<void> {
    //await this.contract.connect(this.signer).upgradeTreeLeaves(nft.id);
  }

  async improveTrunk(nft: Nft): Promise<void> {
    //await this.contract.connect(this.signer).upgradeTreeTrunk(nft.id);
  }

  async getMetadata(nft: Nft): Promise<string> {
    /*const uriAssociated = await this.contract.connect(this.signer).uri(nft.id);
    try {
      const jsonFounded: NftMetadata = await (
        await fetch(uriAssociated)
      ).json();
      return jsonFounded.image;
    } catch (e) {
      return '';
    }*/
    return '';
  }

  async merge(nfts1: string, nfts2: string): Promise<void> {
    // promise resolve in one second
    //await this.contract.connect(this.signer).breedTree(nfts1, nfts2);
  }

  async getAll(): Promise<Nft[]> {
    /*const adress = await this.signer.getAddress();
    const numberOfExistingToken = await this.getNumberOfExistingNft();
    const adresses: string[] = [];
    const tokenAsked: number[] = [];
    for (let i = 1; i < numberOfExistingToken; i += 1) {
      adresses.push(adress);
      tokenAsked.push(i);
    }
    const nftFounded: number[] = [];
    const result = await this.contract.balanceOfBatch(adresses, tokenAsked);
    if (Array.isArray(result)) {
      result.forEach((element) => {
        if (ethers.BigNumber.from(element).toNumber() === 1) {
          nftFounded.push(tokenAsked[result.indexOf(element)]);
        }
      });
    }
    return nftFounded.map((id) => ({ id: id.toString() }));*/
    return [{ id: '1' }, { id: '2' }];
  }

  async getNumberOfExistingNft(): Promise<number> {
    //const result = await this.contract.getTokenCount();
    //return ethers.BigNumber.from(result).toNumber();
    return 3;
  }

  async buyNft(): Promise<void> {
    //const result = await this.contract.connect(this.signer).mintRandomTree();
  }
}
