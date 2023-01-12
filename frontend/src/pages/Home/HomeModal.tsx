/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { SimpleGrid, Image, Button } from '@mantine/core';
import { useState } from 'react';
import { Nft } from '../../core';
import { useNftStore } from '../../stores';

export interface HomeModalProps {
  nfts: Nft[];
  closeModal: () => void;
}

export interface NftCardProps {
  onClick: (id: string) => void;
  url: string;
  id: string;
  isSelected: boolean;
  fert?: number;
}

export function NftCard({ id, url, isSelected, onClick, fert }: NftCardProps) {
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
        onClick={() => onClick(id)}
        radius="sm"
        src={url}
        alt="nft tree"
        withPlaceholder
      />
      <div>{ fert }</div>
    </div>
  );
}

export function HomeModal({ nfts, closeModal }: HomeModalProps) {
  const [nftParent, setParent] = useState<string | null>(null);
  const plantATree = useNftStore((store) => store.plantATree);
  const onImageClick = (id: string) => {
    setParent(id);
  };

  const onSubmit = () => {
    // eslint-disable-next-line no-console
    console.log(nftParent);
    if (nftParent) {
      plantATree(nftParent);
      closeModal();
    }
  };

  return (
    <>
      <SimpleGrid cols={3}>
        {nfts.map((nft) => (
          <NftCard
            id={nft.id}
            key={nft.id}
            url={nft.image!}
            onClick={onImageClick}
            isSelected={nft.id === nftParent}
            fert={nft.detail?.seed}
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
