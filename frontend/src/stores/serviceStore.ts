/* eslint-disable import/prefer-default-export */
import create from 'zustand';

export interface ServiceStore {
  services: Map<string, object>;
  addService: (name: string, service: object) => void;
}

export const useServiceStore = create<ServiceStore>((set) => ({
  services: new Map(),
  addService: (name: string, service: object) =>
    set((state) => ({ services: new Map(state.services).set(name, service) })),
}));
