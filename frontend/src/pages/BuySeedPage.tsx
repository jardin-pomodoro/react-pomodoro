import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useConnectWallet } from '@web3-onboard/react';
import { WalletState } from '@web3-onboard/core';
import BuySeed from '../components/buy/BuySeed';
import { HeaderMenu } from '../components/common/header';
import MetamaskMoneyRepository from '../repositories/money/metamask-money.repository';
import { GetMoneyCountService } from '../services/get-money-count.service';
import { useServiceStore, useWalletStore } from '../stores';

function BuySeedPage() {
  const [moneyCount, setMoneyCount] = useState<number | undefined>(undefined);
  const [{ wallet }] = useConnectWallet();

  const getMoneyCountService = useServiceStore((state) =>
    state.services.get('GetMoneyCountService')
  ) as GetMoneyCountService;

  useEffect(() => {
    const getMoneyCount = async () => {
      const money = await getMoneyCountService.handle();
      setMoneyCount(money);
    };
    if (wallet) {
      getMoneyCount();
    }
  }, [wallet, getMoneyCountService]);
  return (
    <>
      <HeaderMenu
        links={[
          { link: '/', label: 'Home', links: [] },
          { link: '/gallery', label: 'Gallery', links: [] },
          { link: '/buy', label: 'Acheter', links: [] },
        ]}
        moneyCount={moneyCount}
      />
      {wallet && <BuySeed />}
    </>
  );
}

export default BuySeedPage;
