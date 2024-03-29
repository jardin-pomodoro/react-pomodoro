/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
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
import { useConnectWallet } from '@web3-onboard/react';
import { Nft, NftDetails } from '../../core/nft';
import { GetNftsService } from '../../services/get-nfts.service';
import { ImproveLeavesNftService } from '../../services/improve-leaves-tree.service';
import { MergeNftsService } from '../../services/merge-nfts.service';
import { Banner } from './Banner';
import { FeaturesCard } from './card';
import { GetNftMetadataService } from '../../services/get-nft-metadata.service';
import { GetNftDetailsService } from '../../services';
import { MapServices } from '../../stores';
import { ImproveTrunkNftService } from '../../services/improve-trunk-tree.service';
import {
  SmartContractService,
  WalletError,
} from '../../services/smart-contract.service';

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
  nftDetails: NftDetails;
}

const useStyles = createStyles(() => ({
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
    banner.title = `Fusionnez vos arbres (${selectedNfts
      .map((nft) => nft.id)
      .join(', ')})`;
    banner.description =
      "Il ne vous manque qu'un arbre pour pouvoir procéder à la fusion";
    banner.buttonText = 'Ajoutez en un de plus';
    banner.buttonValidity = false;
  } else if (selectedNfts.length === 2) {
    banner.title = `Fusionnez vos arbres (${selectedNfts
      .map((nft) => nft.id)
      .join(', ')})`;
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
  getNftsService: GetNftsService,
  getNftDetailsService: GetNftDetailsService,
  getNftMetadataService: GetNftMetadataService
): Promise<FeaturesCardUI[]> => {
  const nftsFromService = await getNftsService.handle();
  return Promise.all(
    nftsFromService.map(async (nft) => {
      const nftMetadata = await getNftMetadataService.handle(nft);
      const nftDetails = await getNftDetailsService.handle(Number(nft.id));
      return {
        backgroundColor: '#4B8673',
        textColor: 'white',
        textButtonMerge: "Fusionner l'arbre",
        improveButtonShow: true,
        title: nft.id,
        imageMetadata: nftMetadata,
        nftDetails,
      };
    })
  );
};

export function MyGallery() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

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
  const getNftsService = MapServices.getInstance().getService(
    'GetNftsService'
  ) as GetNftsService;

  const getNftDetailsService = MapServices.getInstance().getService(
    'GetNftDetailsService'
  ) as GetNftDetailsService;

  const getNftMetadataService = MapServices.getInstance().getService(
    'GetNftMetadataService'
  ) as GetNftMetadataService;

  const improveLeavesNftService = MapServices.getInstance().getService(
    'ImproveLeavesNftService'
  ) as ImproveLeavesNftService;

  const improveTrunkNftService = MapServices.getInstance().getService(
    'ImproveTrunkNftService'
  ) as ImproveTrunkNftService;

  const mergeNftsService = MapServices.getInstance().getService(
    'MergeNftsService'
  ) as MergeNftsService;
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

  useEffect(() => {
    if (!wallet) return;
    SmartContractService.listenToEvent('TreeUpgraded', (event) => {
      setSimpleBannerProps({
        title: `Félicitations`,
        description:
          'Vos arbres a bien été amélioré, vous pouvez décourvir vos nouvelles stats dans ses détails',
      });
      loadFeatureCardProps(
        getNftsService,
        getNftDetailsService,
        getNftMetadataService
      ).then((featureCardUiResponse) => {
        setFeaturesCardProps(featureCardUiResponse);
      });
    });
  }, [wallet]);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const mergeTwoNfts = async () => {
    if (!wallet) return;
    if (selectedNfts.length !== 2) return;
    const nft1 = selectedNfts[0];
    const nft2 = selectedNfts[1];
    try {
      await mergeNftsService.handle({ nft1: nft1.id, nft2: nft2.id });
      setSelectedNfts([]);
    } catch (error: any) {
      if (error.code && error.code === WalletError.ACTION_REJECTED) {
        setSimpleBannerProps({
          title: 'Echec',
          description: 'Vous avez décidé de rejeter la transaction',
        });
      } else if (
        error.reason &&
        error.reason === 'execution reverted: Breeding limit reached'
      ) {
        setSimpleBannerProps({
          title: 'Echec',
          description:
            "Vous avez atteint la limite de fusion pour l'un des ces arbres",
        });
      } else {
        setSimpleBannerProps({
          title: 'Echec',
          description:
            "Votre Fusion est un echec, vous pouvez vous rendre dans metamask pour suivre l'historique de votre transaction",
        });
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const improveLeavesNft = async (id: string) => {
    if (!wallet) return;

    const nft: Nft = { id };
    try {
      await improveLeavesNftService.handle({ nft });
    } catch (error: any) {
      if (error.code && error.code === WalletError.ACTION_REJECTED) {
        setSimpleBannerProps({
          title: 'Echec',
          description: 'Vous avez décidé de rejeter la transaction',
        });
      } else {
        setSimpleBannerProps({
          title: 'Echec',
          description:
            "Votre amélioration est un echec, vous pouvez vous rendre dans metamask pour suivre l'historique de votre transaction",
        });
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const improveTrunkNft = async (id: string) => {
    if (!wallet) return;
    const nft: Nft = { id };
    try {
      await improveTrunkNftService.handle({ nft });
    } catch (error: any) {
      if (error.code && error.code === WalletError.ACTION_REJECTED) {
        setSimpleBannerProps({
          title: 'Echec',
          description: 'Vous avez décidé de rejeter la transaction',
        });
      } else {
        setSimpleBannerProps({
          title: 'Echec',
          description:
            "Votre amélioration est un echec, vous pouvez vous rendre dans metamask pour suivre l'historique de votre transaction",
        });
      }
    }
  };

  useEffect(() => {
    if (!wallet) return;
    const getNfts = async () => {
      const nfts = await getNftsService.handle();
      const nftsUi = await Promise.all(
        nfts.map(async (nft) => {
          const nftMetadata = await getNftMetadataService.handle(nft);
          const nftDetails = await getNftDetailsService.handle(Number(nft.id));
          const nftE = {
            backgroundColor: '#4B8673',
            textColor: 'white',
            textButtonMerge: "Fusionner l'arbre",
            improveButtonShow: true,
            title: nft.id,
            imageMetadata: nftMetadata,
            nftDetails,
          };
          return nftE;
        })
      );
      setFeaturesCardProps(nftsUi);
    };
    getNfts();
    SmartContractService.listenToEvent('TreeMinted', (event) => {
      setSimpleBannerProps({
        title: `Félicitations`,
        description:
          'Vos arbres ont bien fusionné, vous pouvez retrouver votre nouveau NFT dans votre gallerie',
      });
      getNfts();
    });
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
                  imageUrl={nft.imageMetadata}
                  textColor={nft.textColor}
                  title={nft.title}
                  textButtonMerge={nft.textButtonMerge}
                  nftDetails={nft.nftDetails}
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
