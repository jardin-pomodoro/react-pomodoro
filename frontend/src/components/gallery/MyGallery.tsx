/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/prefer-default-export */
import {
  Container,
  Grid,
  Paper,
  Group,
  Text,
  CloseButton,
  createStyles,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Nft } from '../../core/nft';
import { GetNftsService } from '../../services/get-nfts.service';
import { ImproveLeavesNftService } from '../../services/improve-leaves-tree.service';
import { MergeNftsService } from '../../services/merge-nfts.service';
import { Banner } from './Banner';
import { FeaturesCard } from './card';
import { MetamaskNftRepository } from '../../repositories/nft/metamask-nft.repository';
import { contractAbi, treeToken } from '../../utils/constants';
import { GetNftMetadataService } from '../../services/get-nft-metadata.service';
import { useConnectWallet } from '@web3-onboard/react';

interface BannerProps {
  backgroundColor: string;
  textColor: string;
  title: string;
  description: string;
  buttonValidity: boolean;
  buttonText: string;
}

interface SimpleBannerProps {
  title: string;
  description: string;
}

interface FeaturesCardUI {
  backgroundColor: string;
  textColor: string;
  textButtonMerge: string;
  improveButtonShow: boolean;
  title: string;
  imageMetadata?: string;
}

const useStyles = createStyles((theme) => ({
  banner_body: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    marginBottom: '1rem',
  },
}));

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

const loadFeatureCardProps = async (
  getNftsService: GetNftsService
): Promise<FeaturesCardUI[]> => {
  const nftsFromService = await getNftsService.handle();
  return nftsFromService.map((nft) => {
    return {
      backgroundColor: '#4B8673',
      textColor: 'white',
      textButtonMerge: "Fusionner l'arbre",
      improveButtonShow: true,
      title: nft.id,
    };
  });
};

export function MyGallery() {
  const initialNfts: Nft[] = [];
  const initialFeatureCardProps: FeaturesCardUI[] = [];
  const [featuresCardProps, setFeaturesCardProps] = useState(
    initialFeatureCardProps
  );
  const [{ wallet }] = useConnectWallet();
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
  const [simpleBannerProps, setSimpleBannerProps] = useState(
    {} as SimpleBannerProps
  );
  const { classes } = useStyles();

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

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const mergeTwoNfts = async () => {
    if (!wallet) return;
    if (selectedNfts.length !== 2) return;
    const getNftsService = new GetNftsService(
      new MetamaskNftRepository(wallet)
    );
    const nft1 = selectedNfts[0];
    const nft2 = selectedNfts[1];
    const mergeNftsService = new MergeNftsService(
      new MetamaskNftRepository(wallet)
    );
    try {
      await mergeNftsService.handle({ nft1: nft1.id, nft2: nft2.id });
      setSelectedNfts([]);
      const featureCardUi = await loadFeatureCardProps(getNftsService);

      setFeaturesCardProps(featureCardUi);
      setSimpleBannerProps({
        title: 'Succès',
        description:
          "Votre Fusion est un succès, vous pouvez vous rendre dans metamask pour suivre l'historique de votre transaction",
      });
    } catch (e) {
      setSimpleBannerProps({
        title: 'Echec',
        description:
          "Votre Fusion est un echec, vous pouvez vous rendre dans metamask pour suivre l'historique de votre transaction",
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const improveLeavesNft = async (id: string) => {
    if (!wallet) return;
    const improveNftService = new ImproveLeavesNftService(
      new MetamaskNftRepository(wallet)
    );
    const getNftsService = new GetNftsService(
      new MetamaskNftRepository(wallet)
    );
    const nft: Nft = { id };
    await improveNftService.handle({ nft });
    const featureCardUi = await loadFeatureCardProps(getNftsService);
    setFeaturesCardProps(featureCardUi);
    setSimpleBannerProps({
      title: 'Succès',
      description: 'Le tronc de votre arbre a été amélioré avec succès',
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const improveTrunkNft = async (id: string) => {
    if (!wallet) return;
    const improveNftService = new ImproveLeavesNftService(
      new MetamaskNftRepository(wallet)
    );
    const getNftsService = new GetNftsService(
      new MetamaskNftRepository(wallet)
    );
    const nft: Nft = { id };
    await improveNftService.handle({ nft });
    const featureCardUi = await loadFeatureCardProps(getNftsService);
    setFeaturesCardProps(featureCardUi);
    setSimpleBannerProps({
      title: 'Succès',
      description: 'Les feuilles de votre arbre ont été améliorées avec succès',
    });
  };

  useEffect(() => {
    if (!wallet) return;
    const getNftMetadataService = new GetNftMetadataService(
      new MetamaskNftRepository(wallet)
    );
    const getNftsService = new GetNftsService(
      new MetamaskNftRepository(wallet)
    );
    const getNfts = async () => {
      const nfts = await getNftsService.handle();
      const nftsUi = await Promise.all(
        nfts.map(async (nft) => {
          const nftMetadata = await getNftMetadataService.handle(nft);
          const nftE = {
            backgroundColor: '#4B8673',
            textColor: 'white',
            textButtonMerge: "Fusionner l'arbre",
            improveButtonShow: true,
            title: nft.id,
            imageMetadata: nftMetadata,
          };
          return nftE;
        })
      );
      setFeaturesCardProps(nftsUi);
    };
    getNfts();
  }, [wallet]);

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
            onClick={() => mergeTwoNfts()}
          />
        )}
        {simpleBannerProps?.description !== undefined &&
          simpleBannerProps.description !== '' && (
            <Paper
              withBorder
              p="lg"
              radius="md"
              shadow="md"
              className={classes.banner_body}
            >
              <Group position="apart" mb="xs">
                <Text size="md" weight={500}>
                  {simpleBannerProps.title}
                </Text>
                <CloseButton
                  mr={-9}
                  mt={-9}
                  onClick={() =>
                    setSimpleBannerProps({
                      title: '',
                      description: '',
                    })
                  }
                />
              </Group>
              <Text size="xs">{simpleBannerProps.description}</Text>
            </Paper>
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
                  selectMerge={() => selectNftToMerge(nft.title)}
                  selectImproveLeaves={() => improveLeavesNft(nft.title)}
                  selectImproveTrunk={() => improveTrunkNft(nft.title)}
                />
              </Grid.Col>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
}
