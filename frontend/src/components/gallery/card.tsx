/* eslint-disable import/prefer-default-export */
/* eslint-disable react/no-unescaped-entities */
import { Badge, Button, Card, createStyles, Group, Image } from '@mantine/core';
import { IconCurrencyEthereum } from '@tabler/icons';
import { Link } from 'react-router-dom';
import { NftDetails } from '../../core';

interface FeaturesCardProps {
  backgroundColor: string;
  textColor: string;
  title: string;
  textButtonMerge: string;
  improveButtonShow: boolean;
  // eslint-disable-next-line react/require-default-props
  imageUrl?: string;
  nftDetails: NftDetails;
  selectMerge: (id: string) => void;
  selectImproveLeaves: (id: string) => void;
  selectImproveTrunk: (id: string) => void;
}

interface FeaturesCardStyle {
  cardBackgroundColor: string;
  textColor: string;
}

const useStyles = createStyles(
  (_theme, { cardBackgroundColor, textColor }: FeaturesCardStyle) => ({
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
  nftDetails,
  selectMerge,
  selectImproveLeaves,
  selectImproveTrunk,
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
      <Link to={`/gallery/${title}`}>
        <Card.Section>
          <Image
            src={
              !imageUrl
                ? 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80'
                : imageUrl
            }
            alt="Norway"
          />
        </Card.Section>
      </Link>

      <Group position="apart" mt="md" mb="xs">
        <Badge color="teal.7" variant="light">
          {title}
        </Badge>
        <Badge color="teal.7" variant="light">
          En pleine santé
        </Badge>
      </Group>

      <Button
        disabled={!improveButtonShow}
        variant="light"
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        className={classes.button_color}
        onClick={() => {
          selectImproveLeaves(title);
        }}
      >
        Améliorer les feuilles <IconCurrencyEthereum size={20} />{' '}
        {nftDetails.leavesUpgradePrice}
      </Button>
      <Button
        disabled={!improveButtonShow}
        variant="light"
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        className={classes.button_color}
        onClick={() => {
          selectImproveTrunk(title);
        }}
      >
        Améliorer le tronc <IconCurrencyEthereum size={20} />{' '}
        {nftDetails.trunkUpgradePrice}
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
