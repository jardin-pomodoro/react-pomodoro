import create from 'zustand';
import { Nft, Seed, SeedRepository } from '../core';
import { MetamaskSeedRepository } from '../repositories';
import { GetSeedService } from '../services';
import { useWalletStore } from './walletStore';

export interface SeedsStore {
  seeds: number[];
  getSeeds: (tree: Nft) => Promise<void>;
}
function getRepo(): SeedRepository {
  const { wallet } = useWalletStore.getState();
  if (wallet === null) {
    throw new Error('Repository is undefined');
  }

  return new MetamaskSeedRepository(wallet);
}

export const useSeedsStore = create<SeedsStore>((set) => ({
  seeds: [],
  getSeeds: async () => {
    const repo = getRepo();
    const service = new GetSeedService(repo);
    const seed = await service.handle(1);// TODO 1 is dummy value
    set((state) => ({ seeds: [...state.seeds, seed] }));
  },
}));
