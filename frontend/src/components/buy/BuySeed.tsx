import {
  Container,
  Text,
  Grid,
  Image,
  Center,
  Button,
  createStyles,
  Badge,
  Paper,
  Group,
  Modal,
  Radio,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { Nft } from '../../core/nft';
import { InMemoryNftRepository } from '../../repositories/nft-repository/in-memory-nft.repository';
import { InMemorySeedRepository } from '../../repositories/seed-free/in-memory-seed.reposotory';
import { BuySeedService } from '../../services/buy-seed.service';
import { GetNftsService } from '../../services/get-nfts.service';
import { GetSeedPriceService } from '../../services/get-seed-price.service';
import MetamaskSeedRepository from '../../repositories/seed-free/metamask-seed.repository';
import { contractAbi, treeToken } from '../../utils/constants';
import { ethers } from 'ethers';

const useStyles = createStyles((theme) => ({
  center_button: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    button: {
      marginTop: '1rem',
    },
  },
  center_image: {
    width: '100%',
    height: '100%',
  },
}));

function BuySeed({ provider, signer }: any) {
  const [seedPrice, setSeedPrice] = useState(0);
  const [tokenIdValue, setTokenIdValue] = useState('');
  const initalNfts: string[] = [];
  const [nfts, setNfts] = useState(initalNfts);
  const [opened, setOpened] = useState(false);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const { classes } = useStyles();

  useEffect(() => {
    if (provider && signer) {
      const getSeedPriceService = new GetSeedPriceService(
        new MetamaskSeedRepository(
          provider,
          signer,
          new ethers.Contract(
            treeToken.Token,
            contractAbi,
            provider.getSigner(0)
          )
        )
      );
      getSeedPriceService.handle().then((price) => {
        setSeedPrice(price);
      });
    }
  }, [provider, signer]);

  useEffect(() => {
    const getNftsService = new GetNftsService(new InMemoryNftRepository());
    getNftsService.handle().then((nftsfromService: Nft[]) => {
      const nfts = nftsfromService.map((nft) => nft.id);
      setNfts(nfts);
    });
  }, []);

  useEffect(() => {
    const deadline = 'Februray, 01, 2023';
    const getTime = (_deadline: string) => {
      const time = Date.parse(_deadline) - Date.now();
      setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((time / 1000 / 60) % 60));
      setSeconds(Math.floor((time / 1000) % 60));
      return {
        total: time,
        days,
        hours,
        minutes,
        seconds,
      };
    };
    const interval = setInterval(() => getTime(deadline), 1000);
    return () => clearInterval(interval);
  }, [days, hours, minutes, seconds]);

  const buy = (tokenId: string) => {
    const buySeedService = new BuySeedService(new InMemorySeedRepository());
    buySeedService.handle({ tokenId, amount: 1 }).then((result) => {
      console.log('achat effectué');
      setOpened(false);
    });
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Finalisez votre achat de graine"
      >
        <Radio.Group
          name="select"
          label="Selectionné le nft racroché à la graine"
          withAsterisk
          onChange={setTokenIdValue}
        >
          {nfts.map((nft) => {
            return <Radio key={nft} value={nft} label={nft} />;
          })}
        </Radio.Group>
        <Center pt="1rem">
          <Button onClick={() => buy(tokenIdValue)}>Confirmer l'achat</Button>
        </Center>
      </Modal>
      <Container>
        <Paper withBorder p="lg" radius="md" shadow="md" mb="xs">
          <Group position="apart" mb="xs">
            <Text size="md" weight={500}>
              Réduction exceptionnel
            </Text>

            <Badge size="xl" variant="filled">
              20% de réduction
            </Badge>
          </Group>
          <Text size="l">
            Plus que {days} jours {hours} heures {minutes} minutes et {seconds}{' '}
            secondes pour profiter de la réduction
          </Text>
          <Text td="line-through">1,2 name Money</Text>
          <Text pt="md" fw={700}>
            {seedPrice !== 0 && seedPrice} name Money
          </Text>
        </Paper>
        <div>
          <Grid justify="center" align="center">
            <Grid.Col style={{ height: '70vh' }} span={4}>
              <Center className={classes.center_button}>
                <Text fs="italic" fz="l" align="center">
                  Acheter une graine va vous permettre d'acquérire une graine
                  non périssable, celle-ci pourra être planté en plus du nombre
                  de graine journellement offertes.
                </Text>
                <Button onClick={() => setOpened(true)} color="teal">
                  {seedPrice !== 0 && `Acheter ${seedPrice} name Money`}
                </Button>
              </Center>
            </Grid.Col>

            <Grid.Col style={{ height: '70vh' }} span={6} offset={2}>
              <Center className={classes.center_button}>
                <Image
                  radius="md"
                  height="100%"
                  src="/human_seed.png"
                  alt="humain avec graines"
                />
              </Center>
            </Grid.Col>
          </Grid>
        </div>
      </Container>
    </>
  );
}

export default BuySeed;
