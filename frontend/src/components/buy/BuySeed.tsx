import { Container, Text } from '@mantine/core';
import { BuyCard } from './BuyCard';

function BuySeed() {
  return (
    <Container>
      <div>
        <Text fz="xl">
          Acheter une graine va vous permettre d'acquérire une graine payante
          non périssable, celle-ci pourra être planté en plus du nombre de
          graine journellement offertes.
        </Text>
        <BuyCard />
      </div>
    </Container>
  );
}

export default BuySeed;
