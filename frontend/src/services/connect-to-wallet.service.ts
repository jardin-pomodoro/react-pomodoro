export enum ConnectToWalletResponse {
  OK = 'OK',
  NEW_ACCOUNT = 'NEW_ACCOUNT',
  NO_ACCOUNT = 'NO_ACCOUNT',
}

export class ConnectToWalletService {
  constructor() {}

  async connect(): Promise<ConnectToWalletResponse> {
    const NETWORK_ID = '80001';
    const METAMASK_PENDING_CONTRACT_REQUEST_ERROR_CODE = -32002;
    if (window.ethereum !== undefined) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        if (window.ethereum.networkVersion === NETWORK_ID) {
          return ConnectToWalletResponse.OK;
        }
        throw new Error('Acceptez le contrat sur la blockchain matic');
      } catch (error) {
        if (error.code === METAMASK_PENDING_CONTRACT_REQUEST_ERROR_CODE) {
          throw new Error(
            'Vous avez une demande de connexion en attente, veuillez la valider'
          );
        } else {
          throw new Error('Acceptez le contrat sur la blockchain matic');
        }
      }
    }
    throw new Error('En attente de la synchronisation du compte metamask');
  }

  async listenAccountChanged(callbackFunc: () => void): Promise<void> {
    window.ethereum.on('accountsChanged', ([address]) => {
      callbackFunc();
    });
    window.ethereum.on('chainChanged', (chainId) => {
      callbackFunc();
    });
  }
}
