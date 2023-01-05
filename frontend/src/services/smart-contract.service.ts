/* eslint-disable import/prefer-default-export */
import { Contract, ethers, Wallet } from 'ethers';
import { WalletState } from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import { init } from '@web3-onboard/react';
import { utils } from 'ethers';
import { treeToken, contractAbi } from '../utils/constants';

export const initWeb3Onboard = init({
  wallets: [injectedModule()],
  chains: [
    {
      id: utils.hexValue(80001),
      token: 'Matic',
      label: 'matic-mumbai',
      rpcUrl: 'https://matic-mumbai.chainstacklabs.com',
    },
  ],
  accountCenter: {
    desktop: {
      position: 'bottomRight',
      enabled: true,
      minimal: false,
    },
    mobile: {
      position: 'bottomRight',
      enabled: true,
      minimal: false,
    },
  },
});

export class SmartContractService {
  private static growTreeContract: Contract;

  private static wallet: WalletState;

  static loadContract(wallet: WalletState | null): {
    growTreeContract: Contract;
  } {
    if (this.growTreeContract) {
      return { growTreeContract: this.growTreeContract };
    }
    if (!wallet) {
      throw new Error('Wallet is not defined');
    }

    const smartContractAddress = treeToken.Token as string;
    const abi = contractAbi;

    const provider = new ethers.providers.Web3Provider(wallet.provider, 'any');
    const signer = provider.getSigner();

    this.growTreeContract = new ethers.Contract(
      smartContractAddress,
      abi,
      signer
    );
    return { growTreeContract: this.growTreeContract };
  }

  static loadWallet(wallet?: WalletState): WalletState {
    if (!SmartContractService.wallet && wallet) {
      SmartContractService.wallet = wallet;
    }
    return SmartContractService.wallet;
  }

  static listenToEvent(
    contract: Contract,
    eventName: string,
    callback: (...parameters: any) => void
  ): void {
    contract.on(eventName, callback);
  }
}
