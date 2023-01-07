import { WalletState } from '@web3-onboard/core';
import {
  MetamaskNftRepository,
  MetamaskMoneyRepository,
  MetamaskSeedRepository,
} from '../repositories';
import {
  BuyFirstNftService,
  BuySeedService,
  GetFreeSeedService,
  GetMoneyCountService,
  GetNftMetadataService,
  GetNftsService,
  GetNumberOfNftService,
  GetSeedPriceService,
  ImproveTrunkNftService,
} from '../services';

export class MapServices {
  private static instance: MapServices;

  private constructor(private services: Map<string, object>) {}

  static getInstance(): MapServices {
    if (!MapServices.instance) {
      MapServices.instance = new MapServices(new Map());
    }
    return MapServices.instance;
  }

  addService(name: string, service: object) {
    this.services.set(name, service);
  }

  getService(name: string) {
    if (!this.services.has(name)) {
      throw new Error(`Service ${name} not found`);
    }
    return this.services.get(name);
  }
}

export const InitSingletonServiceStore = (wallet: WalletState) => {
  const nftRepository = new MetamaskNftRepository(wallet);
  const moneyRepository = new MetamaskMoneyRepository(wallet);
  const seedRepository = new MetamaskSeedRepository(wallet);

  MapServices.getInstance().addService(
    'BuyFirstNftService',
    new BuyFirstNftService(nftRepository)
  );

  MapServices.getInstance().addService(
    'BuySeedService',
    new BuySeedService(seedRepository)
  );

  MapServices.getInstance().addService(
    'GetMoneyCountService',
    new GetMoneyCountService(moneyRepository)
  );

  MapServices.getInstance().addService(
    'GetNftMetadataService',
    new GetNftMetadataService(nftRepository)
  );

  MapServices.getInstance().addService(
    'GetNumberOfNftService',
    new GetNumberOfNftService(nftRepository)
  );

  MapServices.getInstance().addService(
    'ImproveTrunkNftService',
    new ImproveTrunkNftService(nftRepository)
  );

  MapServices.getInstance().addService(
    'GetSeedPriceService',
    new GetSeedPriceService(seedRepository)
  );

  MapServices.getInstance().addService(
    'GetNftsService',
    new GetNftsService(nftRepository)
  );

  MapServices.getInstance().addService(
    'GetFreeSeedService',
    new GetFreeSeedService(seedRepository)
  );
};
