import { useEffect, useState } from 'react';
import BuySeed from '../components/buy/BuySeed';
import { HeaderMenu } from '../components/common/header';

function BuySeedPage({ provider, signer }: any) {
  const [account, setAccount] = useState<string | undefined>(undefined);
  useEffect(() => {
    signer?.getAddress().then((address: string) => {
      setAccount(address);
    });
  }, [provider, signer]);
  return (
    <>
      <HeaderMenu
        links={[
          { link: '/', label: 'Home', links: [] },
          { link: '/gallery', label: 'Gallery', links: [] },
          { link: '/buy', label: 'Acheter', links: [] },
        ]}
        account={account || ''}
      />
      <BuySeed provider={provider} signer={signer} />
    </>
  );
}

export default BuySeedPage;
