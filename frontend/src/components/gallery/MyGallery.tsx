/* eslint-disable import/prefer-default-export */
import { Grid, Container } from '@mantine/core';
import { useState, useEffect } from 'react';
import { FeaturesCard } from './card';
import { InMemoryNftRepository } from '../../repositories/nft-repository/in-memory-nft.repository';
import { GetNftsService } from '../../services/get-nfts.service';
import { Nft } from '../../core/nft';

export function MyGallery() {
  const initialNfts: Nft[] = [];
  const selectedNfts: Nft[] = [];
  const [nfts, setNfts] = useState(initialNfts);

  useEffect(() => {
    const getNftsService = new GetNftsService(new InMemoryNftRepository());
    getNftsService.handle().then((nftsfromService: Nft[]) => {
      setNfts(nftsfromService);
    });
  }, []);

  const selectNftToMerge = (id: string) => {
    const nft = nfts.find((nftFromResearch) => nftFromResearch.id === id);
    const nftIsAlreadysSelected = selectedNfts.find(
      (nftFromResearch) => nftFromResearch.id === id
    );
    if (nftIsAlreadysSelected) {
      selectedNfts.splice(selectedNfts.indexOf(nft), 1);
    } else {
      selectedNfts.push(nft);
    }
  };

  return (
    <div className="gallery-body">
      <Container>
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
