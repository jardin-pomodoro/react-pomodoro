/* eslint-disable import/prefer-default-export */
import { ethers } from 'ethers';
import { Nft } from '../../core/nft';
import { NftRepository } from '../../core/nft.repository';

export class MetamaskNftRepository implements NftRepository {
  constructor(
    private provider: ethers.providers.Web3Provider,
    private signer: ethers.Signer,
    private contract: ethers.Contract
  ) {}

  merge(nfts1: string, nfts2: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  improve(nft: Nft): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getAll(): Promise<Nft[]> {
    // get token associated to a contract and a wallet
    /*const tokenIds = await this.contract
      .connect(this.signer)
      .balanceOf(this.signer.getAddress());*/

    const adress = await this.signer.getAddress();

    this.contract.balanceOf(adress, 0).then((result) => {
      console.log('result => ', result); // un tableau contenant les identifiants des NFT possédées par le compte
      console.log('traduct -> ', ethers.BigNumber.from(result).toNumber());
    });
    //console.log(tokenIds);
    throw new Error('Method not implemented.');
  }
}
