import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useConnectWallet } from '@web3-onboard/react';
import { WalletState } from '@web3-onboard/core';
import BuySeed from '../components/buy/BuySeed';
import { HeaderMenu } from '../components/common/header';
import MetamaskMoneyRepository from '../repositories/money/metamask-money.repository';
import { GetMoneyCountService } from '../services/get-money-count.service';

function BuySeedPage() {
  const [moneyCount, setMoneyCount] = useState<number | undefined>(undefined);
  const [{ wallet }] = useConnectWallet();

  useEffect(() => {
    const getMoneyCount = async () => {
      if (wallet === null) return;
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
        moneyCount={moneyCount}
      />
      {wallet && <BuySeed />}
    </>
  );
}

export default BuySeedPage;