import BuySeed from '../components/buy/BuySeed';
import { HeaderMenu } from '../components/common/header';

function BuySeedPage({ provider, signer }: any) {
  return (
    <>
      <HeaderMenu
        links={[
          { link: '/', label: 'Home', links: [] },
          { link: '/gallery', label: 'Gallery', links: [] },
          { link: '/buy', label: 'Acheter', links: [] },
        ]}
      />
      <BuySeed />
    </>
  );
}

export default BuySeedPage;
