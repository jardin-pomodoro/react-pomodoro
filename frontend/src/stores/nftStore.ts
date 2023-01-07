import create from 'zustand';
import { Nft } from '../core/nft';
import { MetamaskNftRepository } from '../repositories';
import { GetNftsService } from '../services';
import { getContract } from '../utils/contract';
import { useWalletStore } from './walletStore';

export interface NftStore {
  nfts: Nft[];
  retieveNfts: () => Promise<boolean>;
}

export const useNftStore = create<NftStore>((set) => ({
  nfts: [],
  // return true if have found at lease one nft
  retieveNfts: async (): Promise<boolean> => {
    const { provider, signer } = useWalletStore.getState();
    if (!provider || !signer) {
      console.log('provider or signer is null inside app state');
      return false;
    }
    const contract = getContract(provider);
    const repository = new MetamaskNftRepository(provider, signer, contract);
    const nftService = new GetNftsService(repository);
    const nfts = await nftService.handle();
    set({ nfts });
    return nfts.length > 0;
  },
}));
