/* eslint-disable import/prefer-default-export */
import type { ethers } from 'ethers';
import create from 'zustand';

export interface WalletState {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  setSigner: (signer: ethers.Signer) => void;
  setProvider: (provider: ethers.providers.Web3Provider) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  provider: null,
  signer: null,
  setProvider: (provider: ethers.providers.Web3Provider) => set({ provider }),
  setSigner: (signer: ethers.Signer) => set({ signer }),
}));
