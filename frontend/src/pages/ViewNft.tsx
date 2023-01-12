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
  Chip,
} from '@mantine/core';
import { MetamaskNftRepository, MetamaskSeedRepository } from '../repositories';
import {
  GetNftDetailsService,
  NftDetails,
} from '../services/get-nft-details.service';
import { GetSeedService } from '../services/get-seed.service';
import { GetMoneyCountService, GetNftMetadataService } from '../services';
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons';
import { HeaderMenu } from '../components/common/header';
import { MapServices } from '../stores';

const useStyles = createStyles(() => ({
  imageSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: '1rem',
  },
  main_stats: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  chip: {
    color: '#4B8673',
  },
  card: {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '1rem',
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
  },
  stats_chips: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip_element: {
    pointerEvents: 'none',
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
  const [moneyCount, setMoneyCount] = useState<number | undefined>();
  const [{ wallet }] = useConnectWallet();
  const { id } = useParams();
  const getMoneyCountService = MapServices.getInstance().getService(
    'GetMoneyCountService'
  ) as GetMoneyCountService;

  useEffect(() => {
    const getMoneyCount = async () => {
      const money = await getMoneyCountService.handle();
      setMoneyCount(money);
    };
    if (wallet) {
      getMoneyCount();
    }
  }, [wallet, getMoneyCountService]);
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
      <>
        <HeaderMenu
          links={[
            { link: '/', label: 'Home', links: [] },
            { link: '/gallery', label: 'Gallery', links: [] },
            { link: '/buy', label: 'Acheter', links: [] },
          ]}
          moneyCount={moneyCount}
        />
        <Container className={classes.card}>
          <div className={classes.imageSection}>
            <img src={imageLink} alt="nft" />
            <Chip className={classes.chip_element} m="sm">
              <span className={classes.chip}>#{nftDetails.seed}</span>
            </Chip>
            <div className={classes.stats_chips}>
              <Chip className={classes.chip_element} m="sm">
                <span className={classes.chip}>
                  {nftDetails.maxBreed} fusions maximum
                </span>
              </Chip>
              <Chip className={classes.chip_element} m="sm">
                <span className={classes.chip}>
                  {nftDetails.leavesUpgradePrice} pour upgrade les feuilles
                </span>
              </Chip>
              <Chip className={classes.chip_element} m="sm">
                <span className={classes.chip}>
                  {nftDetails.trunkUpgradePrice} pour upgrade le tronc
                </span>
              </Chip>
            </div>
          </div>
          <div className={classes.main_stats}>
            <div className={classes.stats}>
              <Group>
                <RingProgress
                  size={80}
                  roundCaps
                  thickness={8}
                  sections={[
                    {
                      value:
                        (nftDetails.trunkStats /
                          (nftDetails.trunkStats + nftDetails.maxUpgrade)) *
                        100,
                      color: '#4B8673',
                    },
                  ]}
                  label={
                    <Center>
                      <IconArrowUpRight size={22} stroke={1.5} />
                    </Center>
                  }
                />
                <div>
                  <Text
                    color="dimmed"
                    size="xs"
                    transform="uppercase"
                    weight={700}
                  >
                    Statistique du tronc
                  </Text>
                  <Text weight={700} size="xl">
                    {nftDetails.trunkStats} /
                    {nftDetails.trunkStats + nftDetails.maxUpgrade}
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
                        (nftDetails.leavesStats /
                          (nftDetails.leavesStats + nftDetails.maxUpgrade)) *
                        100,
                      color: '#4B8673',
                    },
                  ]}
                  label={
                    <Center>
                      <IconArrowUpRight size={22} stroke={1.5} />
                    </Center>
                  }
                />
                <div>
                  <Text
                    color="dimmed"
                    size="xs"
                    transform="uppercase"
                    weight={700}
                  >
                    Statistique des feuilles
                  </Text>
                  <Text weight={700} size="xl">
                    {nftDetails.leavesStats} /{' '}
                    {nftDetails.leavesStats + nftDetails.maxUpgrade}
                  </Text>
                </div>
              </Group>
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
                        (nftDetails.leavesUpgradeCount /
                          nftDetails.maxUpgrade) *
                        100,
                      color: '#4B8673',
                    },
                  ]}
                  label={
                    <Center>
                      <IconArrowUpRight size={22} stroke={1.5} />
                    </Center>
                  }
                />

                <div>
                  <Text
                    color="dimmed"
                    size="xs"
                    transform="uppercase"
                    weight={700}
                  >
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
                      color: '#4B8673',
                    },
                  ]}
                  label={
                    <Center>
                      <IconArrowUpRight size={22} stroke={1.5} />
                    </Center>
                  }
                />

                <div>
                  <Text
                    color="dimmed"
                    size="xs"
                    transform="uppercase"
                    weight={700}
                  >
                    Nombre d'update du tronc
                  </Text>
                  <Text weight={700} size="xl">
                    {nftDetails.trunkUpgradeCount} / {nftDetails.maxUpgrade}
                  </Text>
                </div>
              </Group>
            </div>
          </div>
        </Container>
      </>
    );
  }
  return <div>Loading...</div>;
}
