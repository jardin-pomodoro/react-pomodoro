import { useWallets } from '@web3-onboard/react';
import create from 'zustand';
import { Nft } from '../core/nft';
import { MetamaskNftRepository } from '../repositories';
import { GetNftsService } from '../services';
import { useWalletStore } from './walletStore';

export interface NftStore {
  nfts: Nft[];
  retieveNfts: () => Promise<boolean>;
}

export const useNftStore = create<NftStore>((set) => ({
  nfts: [],
  // return true if have found at lease one nft
  retieveNfts: async (): Promise<boolean> => {
    const { wallet } = useWalletStore.getState();
    if (wallet === null) {
      return false;
    }

    const repository = new MetamaskNftRepository(wallet);
    const nftService = new GetNftsService(repository);
    const nfts = await nftService.handle();
    set({ nfts });
    return nfts.length > 0;
  },
}));
