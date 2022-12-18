/* eslint-disable import/prefer-default-export */
import { Grid, Container } from '@mantine/core';
import { useState, useEffect } from 'react';
import { FeaturesCard } from './card';
import { InMemoryNftRepository } from '../../repositories/nft-repository/in-memory-nft.repository';
import { GetNftsService } from '../../services/get-nfts.service';
import { Nft } from '../../core/nft';
import { Banner } from './Banner';

interface BannerProps {
  backgroundColor: string;
  textColor: string;
  title: string;
  description: string;
  buttonValidity: boolean;
  buttonText: string;
}

const modifyBanner = (selectedNfts: Nft[]): BannerProps => {
  return {
    backgroundColor: '#4B8673',
    textColor: 'white',
    title: 'Fusionnez vos arbres',
    description:
      "Il ne vous manque qu'un arbre pour pouvoir procéder à la fusion",
    buttonText: 'Fusionner',
    buttonValidity: true,
  };
};

export function MyGallery() {
  const initialNfts: Nft[] = [];
  const [nfts, setNfts] = useState(initialNfts);
  const [selectedNfts, setSelectedNfts] = useState(initialNfts);
  const [bannerProps, setBannerProps] = useState({
    backgroundColor: '#4B8673',
    textColor: 'white',
    title: 'Fusionnez vos arbres',
    description:
      "Il ne vous manque qu'un arbre pour pouvoir procéder à la fusion",
    buttonText: 'Fusionner',
    buttonValidity: true,
  });

  useEffect(() => {
    const getNftsService = new GetNftsService(new InMemoryNftRepository());
    getNftsService.handle().then((nftsfromService: Nft[]) => {
      setNfts(nftsfromService);
    });
  }, []);

  const selectNftToMerge = (id: string) => {
    const nft = nfts.find((nftFromResearch) => nftFromResearch.id === id);
    if (nft === undefined) return;
    const nftIsAlreadysSelected = selectedNfts.find(
      (nftFromResearch) => nftFromResearch.id === id
    );
    if (nftIsAlreadysSelected) {
      selectedNfts.splice(selectedNfts.indexOf(nft), 1);
      setSelectedNfts([...selectedNfts]);
    } else {
      setSelectedNfts([...selectedNfts, nft]);
    }
    setBannerProps(modifyBanner(selectedNfts));
  };

  return (
    <div className="gallery-body">
      <Container>
        {selectedNfts.length > 0 && (
          <Banner
            backgroundColor={bannerProps.backgroundColor}
            textColor={bannerProps.textColor}
            title={bannerProps.title}
            description={bannerProps.description}
            buttonText={bannerProps.buttonText}
            // eslint-disable-next-line react/jsx-boolean-value
            buttonValidity={bannerProps.buttonValidity}
          />
        )}
        <Grid>
          {nfts.map((nft: Nft, index: number) => {
            return (
              <Grid.Col key={nft.id} span={4}>
                <FeaturesCard
                  backgroundColor={index % 2 === 0 ? '#4B8673' : '#76BA99'}
                  textColor="#FFFFFF"
                  title={nft.id}
                  selectMerge={selectNftToMerge}
                />
              </Grid.Col>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
}
