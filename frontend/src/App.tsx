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
import {
  ConnectToWalletResponse,
  ConnectToWalletService,
  GetNftsService,
} from './services';
import { contractAbi, treeToken } from './utils/constants';
import BuyNft from './pages/BuyNft';
import { useServiceStore, useWalletStore } from './stores';
import { initDeps } from './init-dependency';

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
  const { setService } = useServiceStore();

  const initBeans = () => {
    if (!provider || !signer) {
      throw new Error('provider or signer not set');
    }
    const contract = new ethers.Contract(
      treeToken.Token,
      contractAbi,
      provider.getSigner(0)
    );
    initDeps(setService, provider, signer, contract);
  };

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

  const checkNft = async () => {
    const getNftService = undefined;
    if (!provider || !signer || !getNftService) {
      console.log('cannot check nft service unavailable', getNftService);
      return;
    }
    const numberOfNft = await getNftService.handle();
    if (numberOfNft.length > 0) {
      setIsNftOnwer(true);
    }
  };

  useEffect(() => {
    const initConnection = async (): Promise<void> => {
      try {
        setLoadAccount(true);

        const connectToWalletService = new ConnectToWalletService();
        const result = await connectToWalletService.connect();
        connectToWalletService.listenAccountChanged(() => {
          window.location.reload();
        });

        if (result === ConnectToWalletResponse.OK) {
          await initializeEthers();
          initBeans();
          await checkNft();
        }

        setLoadAccount(false);
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'message' in error) {
          setLoadingMessage(error.message as string);
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
