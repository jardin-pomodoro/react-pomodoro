import { WalletState } from '@web3-onboard/core';
import create from 'zustand';

export interface WalletStore {
  wallet: WalletState | null;
  setWallet: (wallet: WalletState) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  wallet: null,
  setWallet: (wallet: WalletState) => set({ wallet }),
}));
