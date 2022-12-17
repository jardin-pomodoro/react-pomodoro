/* eslint-disable import/prefer-default-export */
import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';

export function FeaturesCard() {
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section component="a" href="https://mantine.dev/">
        <Image
          src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
          height={160}
          alt="Norway"
        />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>Norway Fjord Adventures</Text>
        <Badge color="teal.7" variant="light">
          Disponible
        </Badge>
      </Group>

      <Text size="sm" color="dimmed">
        Cette NFT vous donnera la force de vosu concentrer
      </Text>

      <Button variant="light" color="blue" fullWidth mt="md" radius="md">
        Améliorer l'arbre
      </Button>
      <Button variant="light" color="blue" fullWidth mt="md" radius="md">
        fusionner l'arbre
      </Button>
    </Card>
  );
}
