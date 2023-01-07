import { MantineProvider } from '@mantine/core';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ethers } from 'ethers';
import { useConnectWallet, useWallets } from '@web3-onboard/react';
import { WalletState } from '@web3-onboard/core';
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
  GetNftsService,
  BuyFirstNftService,
  BuySeedService,
  GetFreeSeedService,
  GetMoneyCountService,
  GetNftMetadataService,
  GetNumberOfNftService,
  GetSeedPriceService,
  ImproveTrunkNftService,
} from './services';
import BuyNft from './pages/BuyNft';
import { useRepositoryStore, useServiceStore, useWalletStore } from './stores';
import { MetamaskNftRepository } from './repositories';
import ConnectWallet from './pages/ConnectWallet';
import {
  initWeb3Onboard,
  SmartContractService,
} from './services/smart-contract.service';
import MetamaskMoneyRepository from './repositories/money/metamask-money.repository';
import MetamaskSeedRepository from './repositories/seed/metamask-seed.repository';
import { InitSingletonServiceStore } from './stores/singletonServiceStore';

declare global {
  interface Window {
    ethereum?: import('ethers').providers.ExternalProvider;
  }
}

export function App() {
  const [isNftOwner, setIsNftOnwer] = useState(false);
  const { addService } = useServiceStore();
  const { addRepository } = useRepositoryStore();
  const connectedWallets = useWallets();
  const [{ wallet, connecting }, connect] = useConnectWallet();
  const [servicesLoad, setServicesLoad] = useState<boolean>(false);
  const [web3Onboard, setWeb3Onboard] = useState<any>(null);

  const initBeans = useCallback(() => {
    console.log('call initBeans');
    console.log(wallet);
    if (!wallet) {
      return;
    }
    console.log('start initBeans');
    const nftRepository = new MetamaskNftRepository(wallet);
    const moneyRepository = new MetamaskMoneyRepository(wallet);
    const seedRepository = new MetamaskSeedRepository(wallet);
    addRepository(nftRepository);
    addRepository(seedRepository);
    addRepository(moneyRepository);
    addService('BuyFirstNftService', new BuyFirstNftService(nftRepository));
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
    addService('GetSeedPriceService', new GetSeedPriceService(seedRepository));
    addService('GetNftsService', new GetNftsService(nftRepository));
    addService('GetFreeSeedService', new GetFreeSeedService(seedRepository));
    addService('ConnectToWalletService', new ConnectToWalletService());
    InitSingletonServiceStore(wallet);
    setServicesLoad(true);
    console.log('end initBeans');
    console.log(wallet);
  }, [wallet, addRepository, addService]);

  useEffect(() => {
    initBeans();
    setWeb3Onboard(initWeb3Onboard);
  }, [initBeans]);

  useEffect(() => {
    if (!connectedWallets.length) return;

    const connectedWalletsLabelArray = connectedWallets.map(
      ({ label }) => label
    );
    window.localStorage.setItem(
      'connectedWallets',
      JSON.stringify(connectedWalletsLabelArray)
    );

    // Check for Magic Wallet user session
    if (connectedWalletsLabelArray.includes('Magic Wallet')) {
      const [magicWalletProvider] = connectedWallets.filter(
        (providerWallet) => providerWallet.label === 'Magic Wallet'
      );
      // eslint-disable-next-line no-inner-declarations
      async function setMagicUser() {
        // eslint-disable-next-line no-useless-catch
        try {
          const { email } =
            await magicWalletProvider.instance.user.getMetadata();
          const magicUserEmail = localStorage.getItem('magicUserEmail');
          if (!magicUserEmail || magicUserEmail !== email)
            localStorage.setItem('magicUserEmail', email);
        } catch (err) {
          throw err;
        }
      }
      setMagicUser();
    }
  }, [connectedWallets, wallet]);

  useEffect(() => {
    const checkNft = async () => {
      if (wallet) {
        const getNftService = new GetNftsService(
          new MetamaskNftRepository(wallet)
        );
        const numberOfNft = await getNftService.handle();
        if (numberOfNft.length > 0) {
          setIsNftOnwer(true);
        }
      }
    };
    checkNft();
  }, [connectedWallets, wallet]);

  useEffect(() => {
    const previouslyConnectedWallets = JSON.parse(
      window.localStorage.getItem('connectedWallets')!
    );

    if (previouslyConnectedWallets?.length) {
      // eslint-disable-next-line no-inner-declarations
      async function setWalletFromLocalStorage() {
        const walletConnected = await connect({
          autoSelect: previouslyConnectedWallets[0],
        });
        console.log('connected wallets: ', walletConnected);
      }
      setWalletFromLocalStorage();
    }
  }, [connect]);

  return (
    <Routes>
      {!connecting && !wallet && <Route path="*" element={<ConnectWallet />} />}
      {isNftOwner && wallet && servicesLoad && (
        <>
          <Route path="/buy" element={<BuySeed />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </>
      )}
      {!isNftOwner && wallet && servicesLoad && (
        <Route path="*" element={<BuyNft />} />
      )}
      {connecting && (
        <Route
          path="*"
          element={
            <LoadingMatamaskAccount message="le compte est entrain de charger" />
          }
        />
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
        <App />
      </BrowserRouter>
    </MantineProvider>
  );
}
