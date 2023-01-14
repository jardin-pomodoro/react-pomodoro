import { Button, Card, Text, Group, Image, Container } from '@mantine/core';
import { useConnectWallet } from '@web3-onboard/react';

export function ConnectWallet() {
  const [, connect] = useConnectWallet();

  return (
    <Container
      style={{
        width: '50%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '15%',
      }}
    >
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Card.Section>
          <div
            style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}
          >
            <Image src="public/human_seed.png" alt="human_seed" />
          </div>
        </Card.Section>

        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>Le meilleur PONZI</Text>
        </Group>

        <Text size="sm" color="dimmed">
          Connecter ton wallet pour rejoindre l'aventure
        </Text>

        <Button
          variant="light"
          color="blue"
          fullWidth
          mt="md"
          radius="md"
          onClick={() => connect()}
        >
          Connect Wallet
        </Button>
      </Card>
    </Container>
  );
}
