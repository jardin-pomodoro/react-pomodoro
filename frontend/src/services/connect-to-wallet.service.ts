/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
export enum ConnectToWalletResponse {
  OK = 'OK',
}

export class ConnectToWalletService {
  async connect(): Promise<ConnectToWalletResponse> {
    const NETWORK_ID = '80001';
    const METAMASK_PENDING_CONTRACT_REQUEST_ERROR_CODE = -32002;
    if (!window.ethereum) {
      throw new Error('En attente de la synchronisation du compte metamask');
    }
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      if (window.ethereum.networkVersion === NETWORK_ID) {
        return ConnectToWalletResponse.OK;
      }
      throw new Error('Acceptez le contrat sur la blockchain matic');
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === METAMASK_PENDING_CONTRACT_REQUEST_ERROR_CODE
      ) {
        throw new Error(
          'Vous avez une demande de connexion en attente, veuillez la valider'
        );
      } else {
        throw new Error('Acceptez le contrat sur la blockchain matic');
      }
    }
  }

  listenAccountChanged(callbackFunc: () => void): void {
    window.ethereum.on('accountsChanged', () => {
      callbackFunc();
    });
    window.ethereum.on('chainChanged', () => {
      callbackFunc();
    });
  }
}
