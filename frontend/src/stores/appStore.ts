import create from 'zustand';

export interface AppStore {
  isLoading: boolean;
  errorMessage: string;
  hasNfts: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setHasNfts: (hasNfts: boolean) => void;
  setErrorMessage: (errorMessage: string) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  isLoading: false,
  errorMessage: '',
  hasNfts: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setHasNfts: (hasNfts: boolean) => set({ hasNfts }),
  setErrorMessage: (errorMessage: string) => set({ errorMessage }),
}));
