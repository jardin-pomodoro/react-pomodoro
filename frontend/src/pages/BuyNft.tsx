/* eslint-disable @typescript-eslint/no-explicit-any */
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
  CloseButton,
} from '@mantine/core';
import { useState, useEffect } from 'react';
import { useConnectWallet } from '@web3-onboard/react';
import { Nft } from '../core';
import {
  GetNftsService,
  BuyFirstNftService,
  WalletError,
  SmartContractService,
} from '../services';
import { MapServices } from '../stores';

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

export function BuyNft() {
  const { classes } = useStyles();
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [{ wallet }] = useConnectWallet();
  const [transactionMessage, setTransactionMessage] = useState<
    string | undefined
  >(undefined);

  const buyFirstNftService = MapServices.getInstance().getService(
    'BuyFirstNftService'
  ) as BuyFirstNftService;
  const getNftsService = MapServices.getInstance().getService(
    'GetNftsService'
  ) as GetNftsService;

  const BuyFirstNft = async () => {
    if (wallet === null) return;
    try {
      await buyFirstNftService.handle(nfts);
    } catch (error: any) {
      if (error.code && error.code === WalletError.ACTION_REJECTED) {
        setTransactionMessage('Vous avez décidé de rejeter la transaction');
      } else {
        setTransactionMessage(
          'Une erreur est survenue lors de la transaction, vous pouvez potentiellement ne pas avoir assez de fonds sur votre wallet'
        );
      }
    }
  };

  useEffect(() => {
    if (!wallet) return;

    const getNfts = async () => {
      const result = await getNftsService.handle();
      setNfts(result);
    };
    getNfts();
    SmartContractService.listenToEvent('TreeMinted', (event: any) => {
      console.log('TreeMinted', event);
      setTransactionMessage(
        'Votre transaction est un succès, vous allez être redirigé vers votre gallerie'
      );
      setTimeout(() => {
        window.location.href = '/';
        window.location.reload();
      }, 2000);
    });
  }, [getNftsService, wallet]);

  return (
    <Container mt="lg">
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
          <Text size="xs">{transactionMessage}</Text>
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
        <Text size="lg">
          Plus que 4 jours pour profiter de cette réduction exceptionnel
        </Text>
        <Text td="line-through">0.8 Matic</Text>
        <Text pt="md" fw={700}>
          0.1 Matic
        </Text>
      </Paper>
      <div>
        <Grid justify="center" align="center">
          <Grid.Col style={{ height: '70vh' }} span={4}>
            <Center className={classes.center_button}>
              <Text fs="italic" fz="l" align="center">
                Acheter votre première NFT pour commencer votre périple
              </Text>
              <Button onClick={() => BuyFirstNft()} color="teal">
                Acheter 0.1 Matic
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
  );
}
