/* eslint-disable import/prefer-default-export */
import { ethers } from 'ethers';
import { WalletState } from '@web3-onboard/core';
import { Nft } from '../../core/nft';
import { NftRepository } from '../../core/nft.repository';
import { SmartContractService } from '../../services/smart-contract.service';

interface NftMetadata {
  name: string;
  external_link: string;
  image: string;
  id: number;
}

export class MetamaskNftRepository implements NftRepository {
  constructor(private wallet: WalletState) {}

  async improveLeaves(nft: Nft): Promise<void> {
    await SmartContractService.loadContract(this.wallet)
      .connect(this.wallet.accounts[0].address)
      .upgradeTreeLeaves(nft.id);
  }

  async improveTrunk(nft: Nft): Promise<void> {
    await SmartContractService.loadContract(this.wallet)
      .connect(this.wallet.accounts[0].address)
      .upgradeTreeTrunk(nft.id);
  }

  async getMetadata(nft: Nft): Promise<string> {
    const uriAssociated = await SmartContractService.loadContract(this.wallet)
      .connect(this.wallet.accounts[0].address)
      .uri(nft.id);
    try {
      const jsonFounded: NftMetadata = await (
        await fetch(uriAssociated)
      ).json();
      return jsonFounded.image;
    } catch (e) {
      return '';
    }
    return '';
  }

  async merge(nfts1: string, nfts2: string): Promise<void> {
    await SmartContractService.loadContract(this.wallet)
      .connect(this.wallet.accounts[0].address)
      .breedTree(nfts1, nfts2);
  }

  async getAll(): Promise<Nft[]> {
    const adress = this.wallet.accounts[0].address;
    const numberOfExistingToken = await this.getNumberOfExistingNft();
    const adresses: string[] = [];
    const tokenAsked: number[] = [];
    for (let i = 1; i < numberOfExistingToken; i += 1) {
      adresses.push(adress);
      tokenAsked.push(i);
    }
    const nftFounded: number[] = [];
    const result = await SmartContractService.loadContract(
      this.wallet
    ).balanceOfBatch(adresses, tokenAsked);
    if (Array.isArray(result)) {
      result.forEach((element) => {
        if (ethers.BigNumber.from(element).toNumber() === 1) {
          nftFounded.push(tokenAsked[result.indexOf(element)]);
        }
      });
    }
    return nftFounded.map((id) => ({ id: id.toString() }));
  }

  async getNumberOfExistingNft(): Promise<number> {
    const result = await SmartContractService.loadContract(
      this.wallet
    ).getTokenCount();
    return ethers.BigNumber.from(result).toNumber();
  }

  async buyNft(): Promise<void> {
    const contract = SmartContractService.loadContract(this.wallet);
    const result = await contract.mintRandomTree({
      value: ethers.utils.parseEther('0.1'),
    });
    // eslint-disable-next-line no-console
    console.log(result);
  }

  async plantTree(parentTree: number): Promise<void> {
    const contract = SmartContractService.loadContract(this.wallet).connect(
      this.wallet.accounts[0].address
    );
    const result = await contract.plantTree(parentTree);
    // eslint-disable-next-line no-console
    console.log(result);
  }
}
