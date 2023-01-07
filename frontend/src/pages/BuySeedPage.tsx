import { useEffect, useState } from 'react';
import BuySeed from '../components/buy/BuySeed';
import { HeaderMenu } from '../components/common/header';
import type { GetMoneyCountService } from '../services';
import { useServiceStore, useWalletStore } from '../stores';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BuySeedPage() {
  const { provider, signer } = useWalletStore();
  const [account, setAccount] = useState<string | undefined>(undefined);
  const [moneyCount, setMoneyCount] = useState<number | undefined>(undefined);
  const getMoneyCountService = useServiceStore((state) =>
    state.services.get('GetMoneyCountService')
  ) as GetMoneyCountService;
  useEffect(() => {
    const getAdress = async () => {
      if (!signer) {
        throw new Error('signer is null');
      }
      const accountFromSerice = await signer.getAddress();
      setAccount(accountFromSerice);
    };
    if (provider && signer) {
      getAdress();
    }
  }, [provider, signer]);

  useEffect(() => {
    const getMoneyCount = async () => {
      const money = await getMoneyCountService.handle();
      setMoneyCount(money);
    };
    if (provider && signer) {
      getMoneyCount();
    }
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
        moneyCount={moneyCount}
      />
      {provider && signer && <BuySeed provider={provider} signer={signer} />}
    </>
  );
}

export default BuySeedPage;
