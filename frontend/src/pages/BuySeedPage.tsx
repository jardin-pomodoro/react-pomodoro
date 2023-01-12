import { useConnectWallet } from '@web3-onboard/react';
import BuySeed from '../components/buy/BuySeed';
import { HeaderMenu } from '../components/common/header';

function BuySeedPage({ moneyCount }: any) {
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
      {wallet && <BuySeed />}
    </>
  );
}

export default BuySeedPage;
