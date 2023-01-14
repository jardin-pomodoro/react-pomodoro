/* eslint-disable react/no-unescaped-entities */
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
import { useConnectWallet } from '@web3-onboard/react';
import { IconCurrencyEthereum } from '@tabler/icons';
import {
  GetSeedPriceService,
  GetNftsService,
  BuySeedService,
} from '../../services';
import { deadline } from '../../utils/constants';
import { MapServices } from '../../stores/singletonServiceStore';
import { WalletError } from '../../services/smart-contract.service';

const useStyles = createStyles(() => ({
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
  // { ethers.providers.Web3provider, ethers.Signer }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [seedPrice, setSeedPrice] = useState(0);
  const [tokenIdValue, setTokenIdValue] = useState('');
  const initalNfts: string[] = [];
  const [nfts, setNfts] = useState(initalNfts);
  const [opened, setOpened] = useState(false);
  const [transactionMessage, setTransactionMessage] = useState<
    string | undefined
  >(undefined);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [{ wallet }] = useConnectWallet();
  const { classes } = useStyles();
  const getSeedPriceService = MapServices.getInstance().getService(
    'GetSeedPriceService'
  ) as GetSeedPriceService;
  const getNftsService = MapServices.getInstance().getService(
    'GetNftsService'
  ) as GetNftsService;
  const buySeedService = MapServices.getInstance().getService(
    'BuySeedService'
  ) as BuySeedService;

  useEffect(() => {
    const getSeePrice = async () => {
      const seedPriceFromService = await getSeedPriceService.handle();
      setSeedPrice(seedPriceFromService);
    };
    getSeePrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  useEffect(() => {
    const getNfts = async () => {
      const nftsFromService = await getNftsService.handle();
      const nftsFormatted = nftsFromService.map((nft) => nft.id);
      setNfts(nftsFormatted);
    };
    getNfts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  useEffect(() => {
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
    try {
      await buySeedService.handle({ tokenId, amount: 1 });
      setTransactionMessage(
        "Votre transaction est un succès, vous pouvez vous rendre dans metamask pour suivre l'historique de votre transaction"
      );
    } catch (error: any) {
      if (error.code && error.code === WalletError.ACTION_REJECTED) {
        setTransactionMessage('Vous avez décidé de rejeter la transaction');
      } else {
        setTransactionMessage(
          'Une erreur est survenue lors de la transaction, vous pouvez potentiellement ne pas avoir assez de fonds sur votre wallet'
        );
      }
    }
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
        {transactionMessage && (
          <Paper
            withBorder
            p="lg"
            radius="md"
            shadow="md"
            className={classes.banner_body}
          >
            <Group position="apart" mb="xs">
              <Text size="md" weight={500}>
                Résultat de la transaction
              </Text>
              <CloseButton
                mr={-9}
                mt={-9}
                onClick={() => setTransactionMessage(undefined)}
              />
            </Group>
            <Text size="xs">{transactionMessage} </Text>
          </Paper>
        )}
        <Paper withBorder p="lg" radius="md" shadow="md" mb="xs">
          <Group position="apart" mb="xs">
            <Text size="md" weight={500}>
              Réduction exceptionnel
            </Text>

            <Badge size="xl" variant="filled">
              50% de réduction
            </Badge>
          </Group>
          <Text size="lg">
            Plus que {days} jours {hours} heures {minutes} minutes et {seconds}{' '}
            secondes pour profiter de la réduction
          </Text>
          <Text td="line-through">
            4 <IconCurrencyEthereum color="black" size={20} />
          </Text>
          <Text pt="md" fw={700}>
            {seedPrice !== 0 && seedPrice}{' '}
            <IconCurrencyEthereum color="black" size={20} />
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
                  {seedPrice !== 0 && `Acheter ${seedPrice}`}
                  <IconCurrencyEthereum size={20} />
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
