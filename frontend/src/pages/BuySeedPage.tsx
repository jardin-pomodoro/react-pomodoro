import { useEffect, useState } from 'react';
import { useConnectWallet } from '@web3-onboard/react';
import BuySeed from '../components/buy/BuySeed';
import { HeaderMenu } from '../components/common/header';
import { GetMoneyCountService } from '../services/get-money-count.service';
import { MapServices } from '../stores/singletonServiceStore';

function BuySeedPage() {
  const [moneyCount, setMoneyCount] = useState<number | undefined>(undefined);
  const [{ wallet }] = useConnectWallet();

  const getMoneyCountService = MapServices.getInstance().getService(
    'GetMoneyCountService'
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
