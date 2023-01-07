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
  addService: (name: string, service: object) => void,
  addRepository: (repository: object) => void,
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
  addRepository(nftRepository);
  addRepository(seedRepository);
  addRepository(moneyRepository);
  addService('BuyFirstNftService', new BuyFirstNftService(nftRepository));
  addService('BuySeedService', new BuySeedService(seedRepository));
  addService('BuySeedService', new BuySeedService(seedRepository));
  addService('GetMoneyCountService', new GetMoneyCountService(moneyRepository));
  addService('GetNftMetadataService', new GetNftMetadataService(nftRepository));
  addService('GetNumberOfNftService', new GetNumberOfNftService(nftRepository));
  addService(
    'ImproveTrunkNftService',
    new ImproveTrunkNftService(nftRepository)
  );
  addService('GetSeedPriceService', new GetSeedPriceService(seedRepository));
  addService('GetNftsService', new GetNftsService(nftRepository));
  addService('GetFreeSeedService', new GetFreeSeedService(seedRepository));
  console.log('init finish');
}
