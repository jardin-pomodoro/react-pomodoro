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
import { BuyFirstNftService } from '../services/buy-first-nft.service';
import { MetamaskNftRepository } from '../repositories/nft/metamask-nft.repository';
import type { GetNftsService } from '../services/get-nfts.service';
import { Nft } from '../core/nft';
import { useConnectWallet } from '@web3-onboard/react';
import { useServiceStore, useWalletStore } from '../stores';

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

export default function BuyNft() {
  const { classes } = useStyles();
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [{ wallet }] = useConnectWallet();
  const getNftsService = useServiceStore((state) =>
    state.services.get('GetNftsService')
  ) as GetNftsService;
  const buyFirstNftService = useServiceStore((state) =>
    state.services.get('GetNftsService')
  ) as GetNftsService;

  const BuyFirstNft = async () => {
    if (wallet === null) return;
    // const buyFirstNftService = new BuyFirstNftService(
    //   new MetamaskNftRepository(wallet)
    // );
    await buyFirstNftService.handle(nfts);
  };

  useEffect(() => {
    const getNfts = async () => {
      console.log('getNfts');
      console.log(getNftsService);
      console.log('getNfts fin');
      const result = await getNftsService.handle();
      setNfts(result);
    };
    console.log('devant le getnfts');
    getNfts();
  }, [wallet, getNftsService]);

  return (
    <Container mt="lg">
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
