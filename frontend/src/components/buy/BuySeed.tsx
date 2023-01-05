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
  CloseButton,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useConnectWallet } from '@web3-onboard/react';
import { BuySeedService } from '../../services/buy-seed.service';
import { GetNftsService } from '../../services/get-nfts.service';
import { GetSeedPriceService } from '../../services/get-seed-price.service';
import MetamaskSeedRepository from '../../repositories/seed/metamask-seed.repository';
import { contractAbi, treeToken } from '../../utils/constants';
import { MetamaskNftRepository } from '../../repositories/nft/metamask-nft.repository';

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

function BuySeed() {
  const [seedPrice, setSeedPrice] = useState(0);
  const [tokenIdValue, setTokenIdValue] = useState('');
  const initalNfts: string[] = [];
  const [nfts, setNfts] = useState(initalNfts);
  const [opened, setOpened] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [{ wallet }] = useConnectWallet();
  const { classes } = useStyles();

  useEffect(() => {
    const getSeePrice = async () => {
      if (wallet === null) return;
      const getSeedPriceService = new GetSeedPriceService(
        new MetamaskSeedRepository(wallet)
      );
      const seedPriceFromService = await getSeedPriceService.handle();
      setSeedPrice(seedPriceFromService);
    };
    getSeePrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  useEffect(() => {
    const getNfts = async () => {
      if (wallet === null) return;
      const getNftsService = new GetNftsService(
        new MetamaskNftRepository(wallet)
      );
      const nftsFromService = await getNftsService.handle();
      const nftsFormatted = nftsFromService.map((nft) => nft.id);
      setNfts(nftsFormatted);
    };
    getNfts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

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

  const buy = async (tokenId: string) => {
    const buySeedService = new BuySeedService(
      new MetamaskSeedRepository(wallet)
    );
    await buySeedService.handle({ tokenId, amount: 1 });
    setTransactionSuccess(true);
    setOpened(false);
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
        {transactionSuccess && (
          <Paper
            withBorder
            p="lg"
            radius="md"
            shadow="md"
            className={classes.banner_body}
          >
            <Group position="apart" mb="xs">
              <Text size="md" weight={500}>
                Achat bien finalisé
              </Text>
              <CloseButton
                mr={-9}
                mt={-9}
                onClick={() => setTransactionSuccess(false)}
              />
            </Group>
            <Text size="xs">
              Votre transaction est un succès, vous pouvez vous rendre dans
              metamask pour suivre l'historique de votre transaction
            </Text>
          </Paper>
        )}
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
