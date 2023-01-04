import { Contract, ethers } from 'ethers';
import { WalletState } from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import { init } from '@web3-onboard/react';
import { treeToken, contractAbi } from '../utils/constants';

export class SmartContractService {
  private static growTreeContract: Contract;

  static initOnBoard(): void {
    const injected = injectedModule();
    init({
      wallets: [injected],
      chains: [
        {
          id: '0x1',
          token: 'ETH',
          label: 'Ethereum Mainnet',
          rpcUrl: 'http://localhost:8545',
        },
      ],
    });
  }

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

  static listenToEvent(
    contract: Contract,
    eventName: string,
    callback: (...parameters: any) => void
  ): void {
    contract.on(eventName, callback);
  }
}
