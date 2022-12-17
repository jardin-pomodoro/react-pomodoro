/* eslint-disable import/prefer-default-export */
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  createStyles,
} from '@mantine/core';
import './card.css';

interface FeaturesCardProps {
  backgroundColor: string;
  textColor: string;
}

const useStyles = createStyles(
  (theme, { backgroundColor, textColor }: FeaturesCardProps) => ({
    card_body: {
      backgroundColor,
    },
    text_color: {
      color: textColor,
    },
    button_color: {
      color: backgroundColor,
      backgroundColor: textColor,
      '&:hover': {
        opacity: 0.95,
        color: textColor,
      },
    },
  })
);

export function FeaturesCard({
  backgroundColor,
  textColor,
}: FeaturesCardProps) {
  const { classes } = useStyles({ backgroundColor, textColor });
  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      className={classes.card_body}
      withBorder
    >
      <Card.Section component="a" href="https://mantine.dev/">
        <Image
          src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
          height={160}
          alt="Norway"
        />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500} className={classes.text_color}>
          Norway Fjord Adventures
        </Text>
        <Badge color="teal.7" variant="light">
          Disponible
        </Badge>
      </Group>

      <Text size="sm" className={classes.text_color}>
        Cette NFT vous donnera la force de vosu concentrer
      </Text>

      <Button
        variant="light"
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        className={classes.button_color}
      >
        Améliorer l'arbre
      </Button>
      <Button
        variant="light"
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        className={classes.button_color}
      >
        fusionner l'arbre
      </Button>
    </Card>
  );
}
