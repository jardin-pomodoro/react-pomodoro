import { useEffect, useState } from 'react';
import { HeaderMenu } from '../components/common/header';
import { MyGallery } from '../components/gallery/MyGallery';

function Gallery({ provider, signer }: any) {
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
      {provider && signer && <MyGallery provider={provider} signer={signer} />}
    </>
  );
}

export default Gallery;
