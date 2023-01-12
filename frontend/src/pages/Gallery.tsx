import { useConnectWallet } from '@web3-onboard/react';
import { HeaderMenu } from '../components/common/header';
import { MyGallery } from '../components/gallery/MyGallery';

export function Gallery({ moneyCount }: any) {
  const [{ wallet }] = useConnectWallet();

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
