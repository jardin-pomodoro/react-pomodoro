/* eslint-disable import/prefer-default-export */
import {
  Badge,
  Button,
  Card,
  createStyles,
  Group,
  Image,
  Text,
} from '@mantine/core';

interface FeaturesCardProps {
  backgroundColor: string;
  textColor: string;
  title: string;
  textButtonMerge: string;
  improveButtonShow: boolean;
  // eslint-disable-next-line react/require-default-props
  imageUrl?: string;
  selectMerge: (id: string) => void;
  selectImprove: (id: string) => void;
}

interface FeaturesCardStyle {
  cardBackgroundColor: string;
  textColor: string;
}

const useStyles = createStyles(
  (theme, { cardBackgroundColor, textColor }: FeaturesCardStyle) => ({
    card_body: {
      backgroundColor: cardBackgroundColor,
    },
    text_color: {
      color: textColor,
    },
    button_color: {
      color: cardBackgroundColor,
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
  title,
  textButtonMerge,
  improveButtonShow,
  imageUrl,
  selectMerge,
  selectImprove,
}: FeaturesCardProps) {
  const { classes } = useStyles({
    cardBackgroundColor: backgroundColor,
    textColor,
  });
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
          src={
            !imageUrl
              ? 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80'
              : imageUrl
          }
          height={160}
          alt="Norway"
        />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500} className={classes.text_color}>
          {title}
        </Text>
        <Badge color="teal.7" variant="light">
          Disponible
        </Badge>
      </Group>

      <Text size="sm" className={classes.text_color}>
        Cette NFT vous donnera la force de vosu concentrer
      </Text>

      <Button
        disabled={!improveButtonShow}
        variant="light"
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        className={classes.button_color}
        onClick={() => {
          selectImprove(title);
        }}
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
        onClick={() => {
          selectMerge(title);
        }}
      >
        {textButtonMerge}
      </Button>
    </Card>
  );
}
