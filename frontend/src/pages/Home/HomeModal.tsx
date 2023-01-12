import { SimpleGrid, Image, Button } from '@mantine/core';
import { useState } from 'react';

export interface HomeModalProps {
  urls: string[];
}

export interface NftCardProps {
  onClick: (url: string) => void;
  url: string;
  isSelected: boolean;
}

export function NftCard({ url, isSelected, onClick }: NftCardProps) {
  const wapperStyle = {
    maxHeight: 240,
    padding: 20,
    marginBottom: 20,
    background: isSelected ? 'blue' : 'transparent',
    borderRadius: 10,
    cursor: 'pointer',
    border: '2px solib lightBlue',
  };
  return (
    <div style={wapperStyle}>
      <Image
        onClick={() => onClick(url)}
        radius="sm"
        src={url}
        alt="nft tree"
        withPlaceholder
      />
    </div>
  );
}

export function HomeModal({ urls }: HomeModalProps) {
  const [nftParent, setParent] = useState<string | null>(null);
  const onImageClick = (url: string) => {
    setParent(url);
  };

  const onSubmit = () => {
    // eslint-disable-next-line no-console
    console.log(nftParent);
  };

  return (
    <>
      <SimpleGrid cols={3}>
        {urls.map((url) => (
          <NftCard
            key={url}
            url={url}
            onClick={onImageClick}
            isSelected={url === nftParent}
          />
        ))}
      </SimpleGrid>
      <div
        id="bottom-submit-bar"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <Button onClick={onSubmit}>submit</Button>
      </div>
    </>
  );
}
