/* eslint-disable react/no-unescaped-entities */
import { Container, createStyles, Text, Flex, Paper } from '@mantine/core';

export interface ConnectWalletProps {
  networkErrorMessage: string;
  dismiss: () => void;
}

const useStyles = createStyles(() => ({
  container: {
    width: '100%',
    height: '50vh',
  },
}));

// eslint-disable-next-line import/prefer-default-export
export function InstallPlugin() {
  const { classes } = useStyles();
  return (
    <Container className={classes.container}>
      <Flex justify="center" align="center" direction="column" h="100%">
        <Paper withBorder p="lg" radius="md" mb="xs" ta="center" bg="teal">
          <Text c="white">
            Pour utilisé ce site vous avez besoin d'installer le plugin metamask
          </Text>
        </Paper>
      </Flex>
    </Container>
  );
}
