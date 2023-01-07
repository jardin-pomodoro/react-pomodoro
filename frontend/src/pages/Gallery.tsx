import { useEffect, useState } from 'react';
import { HeaderMenu } from '../components/common/header';
import { MyGallery } from '../components/gallery/MyGallery';
import MetamaskMoneyRepository from '../repositories/money/metamask-money.repository';
import { GetMoneyCountService } from '../services/get-money-count.service';
import { contractAbi, treeToken } from '../utils/constants';
import { useConnectWallet } from '@web3-onboard/react';
import { useServiceStore, useWalletStore } from '../stores';

function Gallery() {
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
      {wallet && <MyGallery />}
    </>
  );
}

export default Gallery;
