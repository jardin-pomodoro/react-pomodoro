import { Loader, MantineProvider } from '@mantine/core';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { useConnectWallet, useWallets } from '@web3-onboard/react';
import { WalletState } from '@web3-onboard/core';
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
import ConnectWallet from './pages/ConnectWallet';
import {
  initWeb3Onboard,
  SmartContractService,
} from './services/smart-contract.service';

export function App() {
  const [provider, setProvider] = useState<
    undefined | ethers.providers.Web3Provider
  >(undefined);
  const [signer, setSigner] = useState<undefined | ethers.Signer>(undefined);
  const [loadAccount, setLoadAccount] = useState(false);
  const connectedWallets = useWallets();
  const [
    { wallet, connecting },
    connect,
    disconnect,
    updateBalances,
    setWalletModules,
  ] = useConnectWallet();
  const [walletService, setWalletService] = useState<undefined | WalletState>(
    undefined
  );
  const [web3Onboard, setWeb3Onboard] = useState<any>(null);

  const initializeEthers = async () => {
    const localProvider = new ethers.providers.Web3Provider(window.ethereum);
    await localProvider.send('eth_requestAccounts', []);
    const localSigner = localProvider.getSigner();
    setProvider(localProvider);
    setSigner(localSigner);
  };

  useEffect(() => {
    setWeb3Onboard(initWeb3Onboard);
  }, []);

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
      {wallet && (
        <>
          <Route path="/buy" element={<BuySeed />} />
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
      {wallet && (
        <Route
          path="*"
          element={<BuyNft provider={provider} signer={signer} />}
        />
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
