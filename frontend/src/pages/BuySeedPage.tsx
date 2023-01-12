import { useConnectWallet } from '@web3-onboard/react';
import BuySeed from '../components/buy/BuySeed';
import { HeaderMenu } from '../components/common/header';

export function BuySeedPage({
  moneyCount,
}: {
  moneyCount: number | undefined;
}) {
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
