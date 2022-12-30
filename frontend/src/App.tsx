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
import LoadingEtherAccount from './pages/LoadingEtherAccount';

export function App() {
  const [provider, setProvider] = useState(
    undefined as ethers.providers.Web3Provider | undefined
  );

  const [signer, setSigner] = useState(undefined as ethers.Signer | undefined);
  const [loadAccount, setLoadAccount] = useState(false);

  const initializeEthers = async () => {
    const localProvider = new ethers.providers.Web3Provider(window.ethereum);

    await localProvider.send('eth_requestAccounts', []);
    const localSigner = localProvider.getSigner();
    setProvider(localProvider);
    setSigner(localSigner);
  };

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const connectToWallet = async (): Promise<boolean> => {
      const NETWORK_ID = '80001';
      if (window.ethereum !== undefined) {
        try {
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          if (window.ethereum.networkVersion === NETWORK_ID) {
            await initializeEthers();
            return true;
          }
          alert('Please connect Metamask to the network of your contract');
          return false;
        } catch (error) {
          alert('Error when connecting to wallet');
        }
      }
      alert('Please connect a metamask account');
      return false;
    };
    setLoadAccount(true);
    connectToWallet().finally(() => {
      setLoadAccount(false);
    });
  }, []);

  return (
    <Routes>
      {loadAccount && <Route path="*" element={<LoadingEtherAccount />} />}
      {!loadAccount && (
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
    </Routes>
  );
}

export function UnAuthApp() {
  return (
    <Routes>
      <Route
        path="/*"
        element={<InstallPlugin dismiss={() => {}} networkErrorMessage="" />}
      />
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
        {!window.ethereum && <UnAuthApp />}
      </BrowserRouter>
    </MantineProvider>
  );
}
