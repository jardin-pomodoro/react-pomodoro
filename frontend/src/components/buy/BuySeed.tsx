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
} from '@mantine/core';
import { useEffect, useState } from 'react';

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

function BuySeed() {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const { classes } = useStyles();
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
  return (
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
        <Text td="line-through">120$</Text>
        <Text pt="md" fw={700}>
          100$
        </Text>
      </Paper>
      <div>
        <Grid justify="center" align="center">
          <Grid.Col style={{ height: '70vh' }} span={4}>
            <Center className={classes.center_button}>
              <Text fs="italic" fz="l" align="center">
                Acheter une graine va vous permettre d'acquérire une graine non
                périssable, celle-ci pourra être planté en plus du nombre de
                graine journellement offertes.
              </Text>
              <Button color="teal">Acheter 100$</Button>
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

export default BuySeed;
