import { useEffect, useState } from 'react';
import { useConnectWallet } from '@web3-onboard/react';
import { HeaderMenu } from '../components/common/header';
import { MyGallery } from '../components/gallery/MyGallery';
import { GetMoneyCountService } from '../services/get-money-count.service';
import { MapServices } from '../stores/singletonServiceStore';

export function Gallery() {
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
      {wallet && <MyGallery />}
    </>
  );
}
