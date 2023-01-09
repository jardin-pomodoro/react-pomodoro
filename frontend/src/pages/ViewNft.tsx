import { useConnectWallet } from '@web3-onboard/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  RingProgress,
  Text,
  Group,
  Progress,
  createStyles,
  Center,
  Icon,
} from '@mantine/core';
import { MetamaskNftRepository, MetamaskSeedRepository } from '../repositories';
import {
  GetNftDetailsService,
  NftDetails,
} from '../services/get-nft-details.service';
import { GetSeedService } from '../services/get-seed.service';
import { GetNftMetadataService } from '../services';
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons';

const useStyles = createStyles(() => ({
  imageSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  progress: {
    display: 'flex',
  },
}));

const icons = {
  up: IconArrowUpRight,
  down: IconArrowDownRight,
};

export default function VewNft() {
  const { classes } = useStyles();
  const [nftDetails, setNftDetails] = useState<NftDetails | undefined>();
  const [imageLink, setImageLink] = useState<string | undefined>();
  const [{ wallet }] = useConnectWallet();
  const { id } = useParams();
  useEffect(() => {
    const getNftDetailsFunc = async () => {
      if (!wallet || !id) return;
      const getSeedService = new GetSeedService(
        new MetamaskSeedRepository(wallet)
      );
      const getNftDetails = new GetNftDetailsService(
        new MetamaskNftRepository(wallet),
        getSeedService
      );
      const getNftMetadataService = new GetNftMetadataService(
        new MetamaskNftRepository(wallet)
      );
      const nftDetailsResponse = await getNftDetails.handle(Number(id));
      const imageLinkResponse = await getNftMetadataService.handle({
        id,
      });
      setImageLink(imageLinkResponse);
      setNftDetails(nftDetailsResponse);
    };
    getNftDetailsFunc();
  }, [id, wallet]);

  if (imageLink && nftDetails) {
    return (
      <Container>
        <div className={classes.imageSection}>
          <img src={imageLink} alt="nft" />
        </div>
        <div className={classes.stats}>
          <Group>
            <RingProgress
              size={80}
              roundCaps
              thickness={8}
              sections={[
                {
                  value:
                    (nftDetails.leavesUpgradeCount / nftDetails.maxUpgrade) *
                    100,
                  color: 'blue',
                },
              ]}
              label={
                <Center>
                  <IconArrowUpRight size={22} stroke={1.5} />
                </Center>
              }
            />

            <div>
              <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                Nombre d'update des feuilles
              </Text>
              <Text weight={700} size="xl">
                {nftDetails.leavesUpgradeCount} / {nftDetails.maxUpgrade}
              </Text>
            </div>
          </Group>
          <Group>
            <RingProgress
              size={80}
              roundCaps
              thickness={8}
              sections={[
                {
                  value:
                    (nftDetails.trunkUpgradeCount / nftDetails.maxUpgrade) *
                    100,
                  color: 'blue',
                },
              ]}
              label={
                <Center>
                  <IconArrowUpRight size={22} stroke={1.5} />
                </Center>
              }
            />

            <div>
              <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                Nombre d'update du tronc
              </Text>
              <Text weight={700} size="xl">
                {nftDetails.trunkUpgradeCount} / {nftDetails.maxUpgrade}
              </Text>
            </div>
          </Group>
        </div>
        <Text size="xl">Attributs</Text>
        <div>
          <Text> Nombre de fusion maximum</Text>
          <Text>{nftDetails.maxBreed}</Text>
        </div>
        <div>
          <div className={classes.progress}>
            <span>statistique du tronc</span>
            <Progress value={(nftDetails.trunkStats / 30) * 100} mt={5} />
          </div>
          <div className={classes.progress}>
            <span>statistique des feuilles</span>
            <Progress value={(nftDetails.leavesStats / 30) * 100} mt={5} />
          </div>
        </div>
      </Container>
    );
  }
  return <div>Loading...</div>;
}
