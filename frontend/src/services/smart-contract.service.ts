/* eslint-disable import/prefer-default-export */
import { Contract, ethers, utils } from 'ethers';
import { WalletState } from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import { init } from '@web3-onboard/react';
import { treeToken, contractAbi } from '../utils/constants';

export enum WalletError {
  ACTION_REJECTED = 'ACTION_REJECTED',
}

export const initWeb3Onboard = init({
  wallets: [injectedModule()],
  chains: [
    {
      id: utils.hexValue(137),
      token: 'Matic',
      label: 'polygon',
      rpcUrl: 'https://polygon-rpc.com',
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
  apiKey: '50afc552-a665-4163-8ead-24433e8b9b34',
  notify: {
    // eslint-disable-next-line consistent-return
    transactionHandler: (transaction) => {
      if (transaction.eventCode === 'txPool') {
        return {
          // autoDismiss set to zero will persist the notification until the user excuses it
          autoDismiss: 0,
          // message: `Your transaction is pending, click <a href="https://rinkeby.etherscan.io/tx/${transaction.hash}" rel="noopener noreferrer" target="_blank">here</a> for more info.`,
          // or you could use onClick for when someone clicks on the notification itself
          onClick: () =>
            window.open(`https://polygonscan.com/tx/${transaction.hash}`),
        };
      }
    },
  },
});

export class SmartContractService {
  private static growTreeContract: Contract;

  static loadContract(wallet: WalletState | null): Contract {
    if (!wallet) {
      throw new Error('Wallet is not defined');
    }
    if (!this.growTreeContract) {
      const smartContractAddress = treeToken.Token as string;
      const abi = contractAbi;

      const provider = new ethers.providers.Web3Provider(
        wallet.provider,
        'any'
      );
      const signer = provider.getSigner();

      this.growTreeContract = new ethers.Contract(
        smartContractAddress,
        abi,
        signer
      );
    }
    return this.growTreeContract;
  }

  static listenToEvent(
    eventName: string,
    callback: (...parameters: any) => void
  ): void {
    this.growTreeContract.on(eventName, callback);
  }
}
