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

  async improveLeaves(nft: Nft): Promise<void> {
    await this.contract.connect(this.signer).upgradeTreeLeaves(nft.id);
  }

  async improveTrunk(nft: Nft): Promise<void> {
    await this.contract.connect(this.signer).upgradeTreeTrunk(nft.id);
  }

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

  async getAll(): Promise<Nft[]> {
    const adress = await this.signer.getAddress();
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
    return nftFounded.map((id) => ({ id: id.toString() }));
  }

  async getNumberOfExistingNft(): Promise<number> {
    const result = await this.contract.getTokenCount();
    return ethers.BigNumber.from(result).toNumber();
  }

  async buyNft(): Promise<void> {
    const contract = this.contract.connect(this.signer);
    const result = await contract.mintRandomTree({
      value: ethers.utils.parseEther('0.1'),
    });
    // eslint-disable-next-line no-console
    console.log(result);
  }

  async plantTree(parentTree: number): Promise<void> {
    const contract = this.contract.connect(this.signer);
    const result = await contract.plantTree(parentTree);
    // eslint-disable-next-line no-console
    console.log(result);
  }
}
