/* eslint-disable import/prefer-default-export */
import { Grid, Container } from '@mantine/core';
import { useState, useEffect } from 'react';
import { FeaturesCard } from './card';
import { InMemoryNftRepository } from '../../repositories/nft-repository/in-memory-nft.repository';
import { GetNftsService } from '../../services/get-nfts.service';
import { Nft } from '../../core/nft';
import { Banner } from './Banner';
import { MergeNftsService } from '../../services/merge-nfts.service';

interface BannerProps {
  backgroundColor: string;
  textColor: string;
  title: string;
  description: string;
  buttonValidity: boolean;
  buttonText: string;
}

interface FeaturesCardUI {
  backgroundColor: string;
  textColor: string;
  textButtonMerge: string;
  improveButtonShow: boolean;
  title: string;
}

const modifyBanner = (selectedNfts: Nft[]): BannerProps => {
  const banner: BannerProps = {
    backgroundColor: '#4B8673',
    textColor: 'white',
    title: `Fusionnez vos arbres`,
    description:
      "Il ne vous manque qu'un arbre pour pouvoir procéder à la fusion",
    buttonText: 'Fusionner',
    buttonValidity: true,
  };

  if (selectedNfts.length === 1) {
    banner.title = `Fusionnez vos arbres ${selectedNfts
      .map((nft) => nft.id)
      .join(', ')}`;
    banner.description =
      "Il ne vous manque qu'un arbre pour pouvoir procéder à la fusion";
    banner.buttonText = 'Ajoutez en un de plus';
    banner.buttonValidity = false;
  } else if (selectedNfts.length === 2) {
    banner.title = `Fusionnez vos arbres ${selectedNfts
      .map((nft) => nft.id)
      .join(', ')}`;
    banner.description = 'Vous pouvez fusionner vos arbres';
    banner.buttonText = 'Fusionner';
    banner.buttonValidity = true;
  }
  return banner;
};

const modifyFeaturesCard = (
  featuresCardUI: FeaturesCardUI[],
  selectedNfts: Nft[]
): FeaturesCardUI[] => {
  return featuresCardUI.map((featuresCard) => {
    const nftIsAlreadysSelected = selectedNfts.find(
      (nftFromResearch) => nftFromResearch.id === featuresCard.title
    );
    if (nftIsAlreadysSelected) {
      return {
        ...featuresCard,
        textButtonMerge: 'Annuler la sélection',
        improveButtonShow: false,
        backgroundColor: '#F0F0F0',
        textColor: '#4B8673',
      };
    }
    return {
      ...featuresCard,
      improveButtonShow: true,
      textButtonMerge: "Fusionner l'arbre",
      backgroundColor: '#4B8673',
      textColor: 'white',
    };
  });
};

const loadFeatureCardProps = (): Promise<FeaturesCardUI[]> => {
  const getNftsService = new GetNftsService(new InMemoryNftRepository());
  return getNftsService.handle().then((nftsfromService: Nft[]) => {
    return nftsfromService.map((nft) => {
      return {
        backgroundColor: '#4B8673',
        textColor: 'white',
        textButtonMerge: "Fusionner l'arbre",
        improveButtonShow: true,
        title: nft.id,
      };
    });
  });
};

export function MyGallery() {
  const initialNfts: Nft[] = [];
  const initialFeatureCardProps: FeaturesCardUI[] = [];
  const [featuresCardProps, setFeaturesCardProps] = useState(
    initialFeatureCardProps
  );
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

  const selectNftToMerge = (id: string) => {
    const nft = featuresCardProps.find(
      (nftFromResearch) => nftFromResearch.title === id
    );
    if (nft === undefined) return;
    const nftIsAlreadysSelected = selectedNfts.find(
      (nftFromResearch) => nftFromResearch.id === id
    );
    let newSelectedNfts = selectedNfts;
    if (nftIsAlreadysSelected) {
      const nftFind = selectedNfts.find(
        (nftFromResearch) => nftFromResearch.id === nft.title
      );
      if (nftFind === undefined) return;
      selectedNfts.splice(selectedNfts.indexOf(nftFind), 1);
      newSelectedNfts = selectedNfts;
      setSelectedNfts([...selectedNfts]);
    } else {
      newSelectedNfts = [...selectedNfts, { id: nft.title } as Nft];
      if (newSelectedNfts.length > 2) return;
      setSelectedNfts(newSelectedNfts);
    }
    setBannerProps(modifyBanner(newSelectedNfts));
    setFeaturesCardProps(
      modifyFeaturesCard(featuresCardProps, newSelectedNfts)
    );
  };

  const mergeTwoNfts = () => {
    console.log('je me pointe ici');
    console.log(selectedNfts);
    if (selectedNfts.length !== 2) return;
    const nft1 = selectedNfts[0];
    const nft2 = selectedNfts[1];
    const mergeNftsService = new MergeNftsService(new InMemoryNftRepository());
    mergeNftsService.handle({ nft1: nft1.id, nft2: nft2.id }).then(() => {
      console.log("L'arbre a été fusionné avec succès");
      setSelectedNfts([]);
      loadFeatureCardProps().then((featureCardUi) => {
        console.log('featureCardUi ', featureCardUi);
        setFeaturesCardProps(featureCardUi);
      });
    });
  };

  useEffect(() => {
    const getNftsService = new GetNftsService(new InMemoryNftRepository());
    getNftsService.handle().then((nftsfromService: Nft[]) => {
      const nfts = nftsfromService.map((nft) => {
        return {
          backgroundColor: '#4B8673',
          textColor: 'white',
          textButtonMerge: "Fusionner l'arbre",
          improveButtonShow: true,
          title: nft.id,
        };
      });
      setFeaturesCardProps(nfts);
    });
  }, []);

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
            onClick={mergeTwoNfts}
          />
        )}
        <Grid>
          {featuresCardProps.map((nft: FeaturesCardUI) => {
            return (
              <Grid.Col key={nft.title} span={4}>
                <FeaturesCard
                  improveButtonShow={nft.improveButtonShow}
                  backgroundColor={nft.backgroundColor}
                  textColor={nft.textColor}
                  title={nft.title}
                  textButtonMerge={nft.textButtonMerge}
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
