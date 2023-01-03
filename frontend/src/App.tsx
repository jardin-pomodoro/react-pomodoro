import { Loader, MantineProvider } from '@mantine/core';

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
import GetNumberOfNftService from './services/get-number-of-nft.service';
import {
  ConnectToWalletResponse,
  ConnectToWalletService,
} from './services/connect-to-wallet.service';
import { MetamaskNftRepository } from './repositories/nft/metamask-nft.repository';
import { contractAbi, treeToken } from './utils/constants';
import { GetNftsService } from './services/get-nfts.service';
import BuyNft from './pages/BuyNft';

export function App() {
  const [provider, setProvider] = useState<
    undefined | ethers.providers.Web3Provider
  >(undefined);
  const [signer, setSigner] = useState<undefined | ethers.Signer>(undefined);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadAccount, setLoadAccount] = useState(false);
  const [hasNft, setHasNft] = useState(false);

  const initializeEthers = async () => {
    const localProvider = new ethers.providers.Web3Provider(window.ethereum);
    await localProvider.send('eth_requestAccounts', []);
    const localSigner = localProvider.getSigner();
    setProvider(localProvider);
    setSigner(localSigner);
  };

  // eslint-disable-next-line consistent-return
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
      } catch (error) {
        if (error.message) {
          setLoadingMessage(error.message);
        }
      }
    };
    initConnection();
  }, []);

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
          setHasNft(true);
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
      {!loadAccount && hasNft && (
        <>
          <Route
            path="/buy"
            element={<BuySeed provider={provider} signer={signer} />}
          />
          <Route
            path="/gallery"
            element={<Gallery provider={provider} signer={signer} />}
          />
          <Route
            path="/"
            element={<Home provider={provider} signer={signer} />}
          />
          <Route path="*" element={<NotFound />} />
        </>
      )}
      {!loadAccount && !hasNft && provider && signer && (
        <Route
          path="*"
          element={<BuyNft provider={provider} signer={signer} />}
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
        {window.ethereum && <App />}
        {!window.ethereum && <InstallPlugin />}
      </BrowserRouter>
    </MantineProvider>
  );
}
