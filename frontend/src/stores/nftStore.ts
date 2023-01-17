import create from 'zustand';
import { NftRepository, SeedRepository } from '../core';
import { Nft } from '../core/nft';
import { MetamaskNftRepository, MetamaskSeedRepository } from '../repositories';
import {
  GetNftDetailsService,
  GetNftMetadataService,
  GetNftsService,
  GetSeedService,
  HarvestTreeService,
  PlantTreeService,
} from '../services';
import { useWalletStore } from './walletStore';

export interface NftStore {
  nfts: Nft[];
  retrieveNfts: () => Promise<boolean>;
  plantATree: (id: string) => Promise<void>;
  loadImage: () => Promise<void>;
  harvestATree: () => Promise<void>;
}
function getRepo(): NftRepository {
  const { wallet } = useWalletStore.getState();
  if (wallet === null) {
    throw new Error('Repository is undefined');
  }

  return new MetamaskNftRepository(wallet);
}

function getSeedRepo(): SeedRepository {
  const { wallet } = useWalletStore.getState();
  if (wallet === null) {
    throw new Error('Repository is undefined');
  }

  return new MetamaskSeedRepository(wallet);
}

export const useNftStore = create<NftStore>((set, get) => ({
  nfts: [],
  // return true if have found at lease one nft
  retrieveNfts: async (): Promise<boolean> => {
    const repository = getRepo();
    const nftService = new GetNftsService(repository);
    const nfts = await nftService.handle();
    set({ nfts });
    return nfts.length > 0;
  },
  plantATree: async (id: string) => {
    const repository = getRepo();
    const plantTreeService = new PlantTreeService(repository);
    await plantTreeService.handle(id);
  },
  loadImage: async () => {
    const repo = getRepo();
    const seedRepo = getSeedRepo();
    const getSeedService = new GetSeedService(seedRepo);
    const getNftDetails = new GetNftDetailsService(repo, getSeedService);
    const getNftMetadataService = new GetNftMetadataService(repo);
    const nfts = await Promise.all(
      get().nfts.map(async (nft) => {
        const nftDetailsResponse = await getNftDetails.handle(Number(nft.id));
        const fertility = await getSeedService.getSeeds(Number(nft.id));
        const imageLinkResponse = await getNftMetadataService.handle({
          id: nft.id,
        });
        const newNft = { ...nft };
        newNft.image = imageLinkResponse;
        newNft.detail = nftDetailsResponse;
        newNft.fert = fertility;
        return newNft;
      })
    );
    set({ nfts });
  },
  harvestATree: async () => {
    const repository = getRepo();
    const harverstTreeService = new HarvestTreeService(repository);
    await harverstTreeService.handle();
  },
}));
