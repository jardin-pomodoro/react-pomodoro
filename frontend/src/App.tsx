import { MantineProvider } from '@mantine/core';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ethers } from 'ethers';
import { useState, useEffect, useCallback } from 'react';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Gallery from './pages/Gallery';
import BuySeed from './pages/BuySeedPage';
import { InstallPlugin } from './pages/installPlugin';
import LoadingMatamaskAccount from './pages/LoadingMetamaskAccount';
import {
  ConnectToWalletResponse,
  ConnectToWalletService,
} from './services';
import { contractAbi, treeToken } from './utils/constants';
import { GetNftsService } from './services';
import BuyNft from './pages/BuyNft';
import { useRepositoryStore, useServiceStore, useWalletStore } from './stores';
import {
  MetamaskMoneyRepository,
  MetamaskNftRepository,
  MetamaskSeedRepository,
} from './repositories';
import {
  BuyFirstNftService,
  BuySeedService,
  GetFreeSeedService,
  GetMoneyCountService,
  GetNftMetadataService,
  GetNumberOfNftService,
  GetSeedPriceService,
  ImproveTrunkNftService,
} from './services';

declare global {
  interface Window {
    ethereum?: import('ethers').providers.ExternalProvider;
  }
}

export function App() {
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadAccount, setLoadAccount] = useState(false);
  const [isNftOwner, setIsNftOnwer] = useState(false);
  const { provider, signer, setProvider, setSigner } = useWalletStore();
  const { addService } = useServiceStore();
  const { addRepository } = useRepositoryStore();

  const initBeans = useCallback(() => {
    if (!provider || !signer) {
      throw new Error('provider or signer not set');
    }
    const contract = new ethers.Contract(
      treeToken.Token,
      contractAbi,
      provider.getSigner(0)
    );
    const nftRepository = new MetamaskNftRepository(provider, signer, contract);
    const moneyRepository = new MetamaskMoneyRepository(
      provider,
      signer,
      contract
    );
    const seedRepository = new MetamaskSeedRepository(
      provider,
      signer,
      contract
    );
    addRepository(nftRepository);
    addRepository(seedRepository);
    addRepository(moneyRepository);
    addService('BuyFirstNftService', new BuyFirstNftService(nftRepository));
    addService('BuySeedService', new BuySeedService(seedRepository));
    addService('BuySeedService', new BuySeedService(seedRepository));
    addService(
      'GetMoneyCountService',
      new GetMoneyCountService(moneyRepository)
    );
    addService(
      'GetNftMetadataService',
      new GetNftMetadataService(nftRepository)
    );
    addService(
      'GetNumberOfNftService',
      new GetNumberOfNftService(nftRepository)
    );
    addService(
      'ImproveTrunkNftService',
      new ImproveTrunkNftService(nftRepository)
    );
    addService(
      'ImproveTrunkNftService',
      new ImproveTrunkNftService(nftRepository)
    );
    addService('GetSeedPriceService', new GetSeedPriceService(seedRepository));
    addService('GetNftsService', new GetNftsService(nftRepository));
    addService('GetFreeSeedService', new GetFreeSeedService(seedRepository));
    addService('ConnectToWalletService', new ConnectToWalletService());
  }, [addRepository, addService, signer, provider]);

  const initializeEthers = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('ether does not exist');
    }
    const localProvider = new ethers.providers.Web3Provider(window.ethereum);
    await localProvider.send('eth_requestAccounts', []);
    const localSigner = localProvider.getSigner();
    setProvider(localProvider);
    setSigner(localSigner);
    initBeans();
  }, [initBeans, setProvider, setSigner]);

  useEffect(() => {
    const initConnection = async (): Promise<void> => {
      const connectToWalletservice = new ConnectToWalletService();
      try {
        setLoadAccount(true);
        const result = await connectToWalletservice.connect();
        connectToWalletservice.listenAccountChanged(() => {
          window.location.reload();
        });

        if (result === ConnectToWalletResponse.OK) {
          await initializeEthers();
        }

        setLoadAccount(false);
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'message' in error) {
          setLoadingMessage(error.message as string);
          // todo mettre un system de store et de toast avec les erreur
        }
      }
    };
    initConnection();
  }, [initializeEthers]);

  useEffect(() => {
    const checkNft = async () => {
      if (provider && signer) {
        const getNftService = new GetNftsService(
          new MetamaskNftRepository(
            provider,
            signer,
            new ethers.Contract(
              treeToken.Token,
              contractAbi,
              provider.getSigner(0)
            )
          )
        );
        const numberOfNft = await getNftService.handle();
        if (numberOfNft.length > 0) {
          setIsNftOnwer(true);
        }
      }
    };
    checkNft();
  }, [provider, signer]);

  return (
    <Routes>
      {loadAccount && (
        <Route
          path="*"
          element={<LoadingMatamaskAccount message={loadingMessage} />}
        />
      )}
      {!loadAccount && isNftOwner && (
        <>
          <Route path="/buy" element={<BuySeed />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </>
      )}
      {!loadAccount && !isNftOwner && provider && signer && (
        <Route path="*" element={<BuyNft />} />
      )}
    </Routes>
  );
}

export function WrappedApp() {
  return (
    <MantineProvider
      withCSSVariables
      withNormalizeCSS
      theme={{
        colorScheme: 'light',
      }}
    >
      <BrowserRouter>
        {window.ethereum && <App />}
        {!window.ethereum && <InstallPlugin />}
      </BrowserRouter>
    </MantineProvider>
  );
}
