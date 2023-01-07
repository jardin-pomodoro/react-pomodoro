import create from 'zustand';
import { Nft } from '../core/nft';
import { MetamaskNftRepository } from '../repositories';
import { GetNftsService, PlantTreeService } from '../services';
import { useWalletStore } from './walletStore';

export interface NftStore {
  nfts: Nft[];
  retrieveNfts: () => Promise<boolean>;
  plantATree: () => Promise<void>;
}
function getRepo(): MetamaskNftRepository {
  const { wallet } = useWalletStore.getState();
  if (wallet === null) {
    throw new Error('Repository is undefined');
  }

  return new MetamaskNftRepository(wallet);
}

export const useNftStore = create<NftStore>((set) => ({
  nfts: [],
  // return true if have found at lease one nft
  retrieveNfts: async (): Promise<boolean> => {
    const repository = getRepo();
    const nftService = new GetNftsService(repository);
    const nfts = await nftService.handle();
    set({ nfts });
    return nfts.length > 0;
  },
  plantATree: async () => {
    const repository = getRepo();
    const getNfts = new GetNftsService(repository);
    const plantTreeService = new PlantTreeService(repository);
    const nfts = await getNfts.handle();
    const randomNft = nfts.sort(() => 0.5 - Math.random())[0];
    // en vrai c'est une seed qu'il me faut
    await plantTreeService.handle(randomNft.id);
  },
}));