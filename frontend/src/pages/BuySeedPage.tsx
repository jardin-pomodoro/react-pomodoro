import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useConnectWallet } from '@web3-onboard/react';
import { WalletState } from '@web3-onboard/core';
import BuySeed from '../components/buy/BuySeed';
import { HeaderMenu } from '../components/common/header';
import MetamaskMoneyRepository from '../repositories/money/metamask-money.repository';
import { GetMoneyCountService } from '../services/get-money-count.service';
import { SmartContractService } from '../services/smart-contract.service';

function BuySeedPage() {
  const [account, setAccount] = useState<string | undefined>(undefined);
  const [moneyCount, setMoneyCount] = useState<number | undefined>(undefined);
  const [{ wallet }] = useConnectWallet();
  const [walletService, setWalletService] = useState<undefined | WalletState>(
    undefined
  );
  useEffect(() => {
    const getAdress = async () => {
      const accountFromSerice = await SmartContractService.loadContract(
        wallet
      ).growTreeContract.signer.getAddress();
      setAccount(accountFromSerice);
    };
    if (wallet) {
      getAdress();
    }
    setWalletService(SmartContractService.loadWallet());
    console.log('walletService', walletService);
  }, [walletService, wallet]);

  useEffect(() => {
    const getMoneyCount = async () => {
      const getMoneyCountService = new GetMoneyCountService(
        new MetamaskMoneyRepository(wallet)
      );
      const money = await getMoneyCountService.handle();
      setMoneyCount(money);
    };
    if (wallet) {
      getMoneyCount();
    }
  }, [wallet]);
  return (
    <>
      <HeaderMenu
        links={[
          { link: '/', label: 'Home', links: [] },
          { link: '/gallery', label: 'Gallery', links: [] },
          { link: '/buy', label: 'Acheter', links: [] },
        ]}
        account={account || ''}
        moneyCount={moneyCount}
      />
      {walletService && <BuySeed />}
    </>
  );
}

export default BuySeedPage;
