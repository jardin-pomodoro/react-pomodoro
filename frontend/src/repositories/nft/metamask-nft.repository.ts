import { ethers } from 'ethers';
import { WalletState } from '@web3-onboard/core';
import { Nft, NftRepository } from '../../core';
import { SmartContractService } from '../../services';
import { NftUpgradeStats } from '../../core/nft-upgrade-stats';

interface NftMetadata {
  name: string;
  external_link: string;
  image: string;
  id: number;
}

export class MetamaskNftRepository implements NftRepository {
  constructor(private wallet: WalletState) {}

  async improveLeaves(nft: Nft): Promise<void> {
    await SmartContractService.loadContract(this.wallet).upgradeTreeLeaves(
      nft.id
    );
  }

  async improveTrunk(nft: Nft): Promise<void> {
    await SmartContractService.loadContract(this.wallet).upgradeTreeTrunk(
      nft.id
    );
  }

  async getMetadata(nft: Nft): Promise<string> {
    const uriAssociated = await SmartContractService.loadContract(this.wallet)
      .connect(this.wallet.accounts[0].address)
      .uri(nft.id);
    try {
      const httpResponse = await fetch(uriAssociated);
      const jsonFounded: NftMetadata = await httpResponse.json();
      return jsonFounded.image;
    } catch (e) {
      return '';
    }
  }

  async merge(nfts1: string, nfts2: string): Promise<void> {
    await SmartContractService.loadContract(this.wallet).breedTree(
      nfts1,
      nfts2
    );
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
    await contract.mintRandomTree({
      value: ethers.utils.parseEther('0.1'),
    });
  }

  async plantTree(parentTree: string): Promise<void> {
    const result = await SmartContractService.loadContract(
      this.wallet
    ).plantTree(parentTree);
    // eslint-disable-next-line no-console
    console.log(result);
  }

  async getLeavesUpgradePrice(nft: Nft, baseStat: number): Promise<number> {
    const result = await SmartContractService.loadContract(
      this.wallet
    ).getLeavesUpgradeCost(nft.id, baseStat);
    return Number(ethers.BigNumber.from(result).toBigInt());
  }

  async getTrunkUpgradePrice(nft: Nft, baseStat: number): Promise<number> {
    const result = await SmartContractService.loadContract(
      this.wallet
    ).getTrunkUpgradeCost(nft.id, baseStat);
    return Number(ethers.BigNumber.from(result).toBigInt());
  }

  async getUpgradeStats(nft: Nft): Promise<NftUpgradeStats> {
    const result = await SmartContractService.loadContract(
      this.wallet
    ).getTreeStats(nft.id);

    return {
      maxUpgrade: ethers.BigNumber.from(result.maxUpgrades).toNumber(),
      leavesUpgrade: ethers.BigNumber.from(result.leavesUpgrade).toNumber(),
      trunkUpgrade: ethers.BigNumber.from(result.trunkUpgrade).toNumber(),
    };
  }

  async getBreedCount(nft: Nft): Promise<number> {
    const result = await SmartContractService.loadContract(
      this.wallet
    ).breedCount(nft.id);
    return ethers.BigNumber.from(result).toNumber();
  }

  async harvestTree(): Promise<number> {
    const result = await SmartContractService.loadContract(
      this.wallet
    ).collectTree();
    return result;
  }
}
