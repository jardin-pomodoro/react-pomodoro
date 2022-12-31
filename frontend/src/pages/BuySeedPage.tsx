import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import BuySeed from '../components/buy/BuySeed';
import { HeaderMenu } from '../components/common/header';
import MetamaskMoneyRepository from '../repositories/money/metamask-money.repository';
import { GetMoneyCountService } from '../services/get-money-count.service';
import { contractAbi, treeToken } from '../utils/constants';

function BuySeedPage({ provider, signer }: any) {
  const [account, setAccount] = useState<string | undefined>(undefined);
  const [moneyCount, setMoneyCount] = useState<number | undefined>(undefined);
  useEffect(() => {
    const getAdress = async () => {
      const accountFromSerice = await signer.getAddress();
      setAccount(accountFromSerice);
    };
    if (provider && signer) {
      getAdress();
    }
  }, [provider, signer]);

  useEffect(() => {
    const getMoneyCount = async () => {
      const getMoneyCountService = new GetMoneyCountService(
        new MetamaskMoneyRepository(
          provider,
          signer,
          new ethers.Contract(
            treeToken.Token,
            contractAbi,
            provider.getSigner(0)
          )
        )
      );
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
