/* eslint-disable import/prefer-default-export */
import {
  Button,
  Paper,
  Text,
  Group,
  CloseButton,
  Container,
  createStyles,
} from '@mantine/core';

interface BannerProps {
  backgroundColor: string;
  textColor: string;
  title: string;
  description: string;
  buttonValidity: boolean;
  buttonText: string;
}

const useStyles = createStyles(
  (_, { backgroundColor, textColor }: BannerProps) => ({
    container_banner: {
      marginBottom: '1.5rem',
    },
    banner_body: {
      backgroundColor,
      color: textColor,
    },
    banner_button_color: {
      color: backgroundColor,
      backgroundColor: textColor,
      '&:hover': {
        opacity: 0.95,
        color: textColor,
      },
    },
  })
);

export function Banner({
  backgroundColor,
  textColor,
  title,
  description,
  buttonValidity,
  buttonText,
}: BannerProps) {
  const { classes } = useStyles({
    backgroundColor,
    textColor,
    title,
    description,
    buttonValidity,
    buttonText,
  });

  return (
    <Container className={classes.container_banner}>
      <Paper
        withBorder
        p="lg"
        radius="md"
        shadow="md"
        className={classes.banner_body}
      >
        <Group position="apart" mb="xs">
          <Text size="md" weight={500}>
            {title}
          </Text>
          <CloseButton mr={-9} mt={-9} />
        </Group>
        <Text size="xs">{description}</Text>
        <Group position="right" mt="xs">
          <Button
            variant="outline"
            size="xs"
            disabled={!buttonValidity}
            className={classes.banner_button_color}
          >
            {buttonText}
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}
