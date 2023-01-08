import create from 'zustand';
import { Seed } from '../core/seed-free';
import { MetamaskSeedRepository } from '../repositories';
import { GetSeedsService } from '../services';
import { useWalletStore } from './walletStore';

export interface SeedsStore {
  seeds: Seed[];
  getSeeds: () => Promise<void>;
}
function getRepo(): MetamaskSeedRepository {
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
    const service = new GetSeedsService(repo);
    const seeds = await service.handle();
    set({ seeds });
  },
}));
