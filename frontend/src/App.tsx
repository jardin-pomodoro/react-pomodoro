/* eslint-disable no-inner-declarations */
/* eslint-disable no-console */
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useConnectWallet, useWallets } from '@web3-onboard/react';
import { OnboardAPI } from '@web3-onboard/core';
import { useState, useEffect, useCallback } from 'react';

import {
  initWeb3Onboard,
  SmartContractService,
} from './services/smart-contract.service';
import {
  useAppStore,
  useNftStore,
  useWalletStore,
  InitSingletonServiceStore,
  MapServices,
} from './stores';
import {
  BuyNft,
  ConnectWallet,
  Gallery,
  Home,
  LoadingMatamaskAccount,
  NotFound,
  ViewNft,
  BuySeedPage,
} from './pages';
import { GetMoneyCountService } from './services';

declare global {
  interface Window {
    ethereum?: import('ethers').providers.ExternalProvider;
  }
}

export function App() {
  const connectedWallets = useWallets();
  const [moneyCount, setMoneyCount] = useState<number | undefined>(undefined);
  const [{ wallet, connecting }, connect] = useConnectWallet();
  const [, setWeb3Onboard] = useState<OnboardAPI | null>(null);
  const retrieveNfts = useNftStore((store) => store.retrieveNfts);
  const { hasNfts, setHasNfts, setErrorMessage } = useAppStore((state) => ({
    hasNfts: state.hasNfts,
    setHasNfts: state.setHasNfts,
    setErrorMessage: state.setErrorMessage,
  }));
  const { setWallet } = useWalletStore();

  const initBeans = useCallback(() => {
    if (!wallet) {
      return;
    }
    InitSingletonServiceStore(wallet);
    setWallet(wallet);
  }, [wallet, setWallet]);

  useEffect(() => {
    initBeans();
    setWeb3Onboard(initWeb3Onboard);
  }, [initBeans, wallet]);

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
        (providerWallet: { label: string }) =>
          providerWallet.label === 'Magic Wallet'
      );
      async function setMagicUser() {
        // eslint-disable-next-line no-useless-catch
        try {
          const { email } = (
            (await magicWalletProvider.instance) as any
          ).user.getMetadata();
          const magicUserEmail = localStorage.getItem('magicUserEmail');
          if (!magicUserEmail || magicUserEmail !== email)
            localStorage.setItem('magicUserEmail', email);
        } catch (error: unknown) {
          if (error && typeof error === 'object' && 'message' in error) {
            setErrorMessage(error.message as string);
            // todo mettre un system de store et de toast avec les erreur
          }
        }
      }
      setMagicUser();
    }
  }, [connectedWallets, wallet, setErrorMessage]);

  useEffect(() => {
    const previouslyConnectedWallets = JSON.parse(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      window.localStorage.getItem('connectedWallets')!
    );

    if (previouslyConnectedWallets?.length) {
      async function setWalletFromLocalStorage() {
        const walletConnected = await connect({
          autoSelect: previouslyConnectedWallets[0],
        });
        console.log('connected wallets: ', walletConnected);
      }
      setWalletFromLocalStorage();
    }
  }, [connect]);

  useEffect(() => {
    if (!wallet) return;
    const searchIfHasNft = async () => {
      const isOwner = await retrieveNfts();
      if (isOwner) {
        setHasNfts(true);
      }
    };
    searchIfHasNft();
  }, [connectedWallets, wallet, retrieveNfts, setHasNfts]);

  useEffect(() => {
    const getMoneyCount = async () => {
      const getMoneyCountService = MapServices.getInstance().getService(
        'GetMoneyCountService'
      ) as GetMoneyCountService;
      const money = await getMoneyCountService.handle();
      setMoneyCount(money);
    };
    if (wallet) {
      getMoneyCount();
      SmartContractService.listenToEvent('TreeUpgraded', (event) => {
        console.log('TreeUpgraded', event);
        setMoneyCount(-1);
        setTimeout(() => {
          getMoneyCount();
        }, 1000);
      });
      SmartContractService.listenToEvent('TreeMinted', (event) => {
        console.log('TreeMinted', event);
        setMoneyCount(-1);
        setTimeout(() => {
          getMoneyCount();
        }, 1000);
      });
      SmartContractService.listenToEvent('SeedRefreshed', (event) => {
        console.log('SeedRefreshed', event);
        setMoneyCount(-1);
        setTimeout(() => {
          getMoneyCount();
        }, 1000);
      });
    }
  }, [wallet]);

  if (!connecting && !wallet) {
    return <ConnectWallet />;
  }
  if (connecting) {
    return (
      <LoadingMatamaskAccount message="le compte est entrain de charger" />
    );
  }
  if (!hasNfts) {
    return <BuyNft />;
  }
  return (
    <Routes>
      <Route path="/buy" element={<BuySeedPage moneyCount={moneyCount} />} />
      <Route path="/gallery" element={<Gallery moneyCount={moneyCount} />} />
      <Route
        path="/gallery/:id"
        element={<ViewNft moneyCount={moneyCount} />}
      />
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
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
