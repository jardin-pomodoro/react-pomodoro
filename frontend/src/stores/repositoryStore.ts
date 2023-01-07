/* eslint-disable import/prefer-default-export */
import create from 'zustand';

export interface RepositoryStore {
  repositories: Set<object>;
  addRepository: (service: object) => void;
}

export const useRepositoryStore = create<RepositoryStore>((set) => ({
  repositories: new Set(),
  addRepository: (repository: object) =>
    set((state) => ({
      repositories: new Set(state.repositories).add(repository),
    })),
}));
