/* eslint-disable import/prefer-default-export */
import create from 'zustand';

export interface ServiceStore {
  services: Map<string, object>;
  setService: (services: Map<string, object>) => void;
}

export const useServiceStore = create<ServiceStore>((set) => ({
  services: new Map(),
  setService: (services: Map<string, object>) => set({ services }),
}));
