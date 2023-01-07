import type ethers from 'ethers';
import {
  MetamaskSeedRepository,
  MetamaskNftRepository,
  MetamaskMoneyRepository,
} from './repositories';
import {
  BuySeedService,
  BuyFirstNftService,
  GetNftsService,
  GetSeedPriceService,
  GetNftMetadataService,
  GetFreeSeedService,
  ImproveTrunkNftService,
  GetNumberOfNftService,
  GetMoneyCountService,
} from './services';

export function initDeps(
  setService: (services: Map<string, object>) => void,
  provider: ethers.providers.Web3Provider,
  signer: ethers.Signer,
  contract: ethers.ethers.Contract
) {
  const nftRepository = new MetamaskNftRepository(provider, signer, contract);
  const moneyRepository = new MetamaskMoneyRepository(
    provider,
    signer,
    contract
  );
  const seedRepository = new MetamaskSeedRepository(provider, signer, contract);
  const services: Map<string, object> = new Map();
  services.set('BuyFirstNftService', new BuyFirstNftService(nftRepository));
  services.set('BuySeedService', new BuySeedService(seedRepository));
  services.set('BuySeedService', new BuySeedService(seedRepository));
  services.set(
    'GetMoneyCountService',
    new GetMoneyCountService(moneyRepository)
  );
  services.set(
    'GetNftMetadataService',
    new GetNftMetadataService(nftRepository)
  );
  services.set(
    'GetNumberOfNftService',
    new GetNumberOfNftService(nftRepository)
  );
  services.set(
    'ImproveTrunkNftService',
    new ImproveTrunkNftService(nftRepository)
  );
  services.set('GetSeedPriceService', new GetSeedPriceService(seedRepository));
  services.set('GetNftsService', new GetNftsService(nftRepository));
  services.set('GetFreeSeedService', new GetFreeSeedService(seedRepository));
  setService(services);
  console.log('init finish');
}
