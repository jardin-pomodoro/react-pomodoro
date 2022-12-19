import { Container, Text, Grid } from '@mantine/core';
import { BuyCard } from './BuyCard';

function BuySeed() {
  return (
    <Container>
      <div>
        <Grid justify="center" align="center">
          <Grid.Col span={6}>
            <Text fz="xl">
              Acheter une graine va vous permettre d'acquérire une graine
              payante non périssable, celle-ci pourra être planté en plus du
              nombre de graine journellement offertes.
            </Text>
          </Grid.Col>
          <Grid.Col span={4} offset={2}>
            <BuyCard />
          </Grid.Col>
        </Grid>
      </div>
    </Container>
  );
}

export default BuySeed;
