import { Button } from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import { HeaderMenu } from '../components/common/header';
import { useWalletStore } from '../stores';

function Home() {
  const [account, setAccount] = useState<string | undefined>(undefined);
  const { provider, signer } = useWalletStore();
  /* const PlanTreeService = useServiceStore((state) =>
    state.services.get('PlantTreeService')
  ) as PlantTreeService; */
  const saveAccount = useCallback(async () => {
    const address = await signer?.getAddress();
    setAccount(address);
  }, [signer]);

  useEffect(() => {
    saveAccount();
  }, [provider, signer, saveAccount]);

  const plantTree = () => {
    // todo faire un truc avec
  };

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
      <Button onClick={plantTree}>plant a tree</Button>
    </>
  );

  // return <Rive src="/tree.riv" />;
}

export default Home;
