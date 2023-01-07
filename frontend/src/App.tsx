import { MantineProvider } from '@mantine/core';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Gallery from './pages/Gallery';
import BuySeed from './pages/BuySeedPage';
import { InstallPlugin } from './pages/installPlugin';
import LoadingMatamaskAccount from './pages/LoadingMetamaskAccount';
import { ConnectToWalletResponse, ConnectToWalletService } from './services';
import BuyNft from './pages/BuyNft';
import { useWalletStore, useAppStore, useNftStore } from './stores';

declare global {
  interface Window {
    ethereum?: import('ethers').providers.ExternalProvider;
  }
}

export function App() {
  const { provider, signer, setProvider, setSigner } = useWalletStore();
  const nftStore = useNftStore();
  const {
    isLoading,
    hasNfts,
    errorMessage,
    setIsLoading,
    setHasNfts,
    setErrorMessage,
  } = useAppStore();

  const initializeEthers = async () => {
    if (!window.ethereum) {
      throw new Error('ether does not exist');
    }
    const localProvider = new ethers.providers.Web3Provider(window.ethereum);
    await localProvider.send('eth_requestAccounts', []);
    const localSigner = localProvider.getSigner();
    setProvider(localProvider);
    setSigner(localSigner);
  };

  useEffect(() => {
    const initConnection = async (): Promise<void> => {
      try {
        setIsLoading(true);

        const connectToWalletService = new ConnectToWalletService();
        const result = await connectToWalletService.connect();
        connectToWalletService.listenAccountChanged(() => {
          window.location.reload();
        });

        if (result === ConnectToWalletResponse.OK) {
          await initializeEthers();
          setHasNfts(await nftStore.retieveNfts());
        }

        setIsLoading(false);
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'message' in error) {
          setErrorMessage(error.message as string);
          // todo mettre un system de store et de toast avec les erreur
        }
      }
    };
    if (!provider || !signer) {
      initConnection();
    }
  }, [provider, signer]);

  return (
    <Routes>
      {isLoading && (
        <Route
          path="*"
          element={<LoadingMatamaskAccount message={errorMessage} />}
        />
      )}
      {!isLoading && hasNfts && (
        <>
          <Route path="/buy" element={<BuySeed />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </>
      )}
      {!hasNfts && !hasNfts && provider && signer && (
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
