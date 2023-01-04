import { useEffect, useState } from 'react';
import { HeaderMenu } from '../components/common/header';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Home({ provider, signer }: any) {
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
      <h1>Hello World !</h1>
    </>
  );

  // return <Rive src="/tree.riv" />;
}

export default Home;
