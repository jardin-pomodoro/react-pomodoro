import { WalletState } from '@web3-onboard/core';
import {
  MetamaskNftRepository,
  MetamaskMoneyRepository,
  MetamaskSeedRepository,
} from '../repositories';
import {
  BuyNftService,
  BuySeedService,
  GetMoneyCountService,
  GetNftMetadataService,
  GetNumberOfNftService,
  ImproveTrunkNftService,
  GetSeedPriceService,
  GetNftsService,
  GetFreeSeedService,
} from '../services';
import { GetNftDetailsService } from '../services/get-nft-details.service';
import { GetSeedService } from '../services/get-seed.service';
import { ImproveLeavesNftService } from '../services/improve-leaves-tree.service';
import { MergeNftsService } from '../services/merge-nfts.service';
import { WithDrawService } from '../services/with-draw.service';

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
    'BuyNftService',
    new BuyNftService(nftRepository)
  );

  MapServices.getInstance().addService(
    'MergeNftsService',
    new MergeNftsService(nftRepository)
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
    'ImproveLeavesNftService',
    new ImproveLeavesNftService(nftRepository)
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

  MapServices.getInstance().addService(
    'GetSeedService',
    new GetSeedService(seedRepository)
  );

  MapServices.getInstance().addService(
    'WithDrawService',
    new WithDrawService(wallet)
  );

  MapServices.getInstance().addService(
    'GetNftDetailsService',
    new GetNftDetailsService(
      nftRepository,
      MapServices.getInstance().getService('GetSeedService') as GetSeedService
    )
  );
};
