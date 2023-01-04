import {
  Loader,
  Flex,
  Container,
  Paper,
  Text,
  createStyles,
} from '@mantine/core';

interface LoadingMatamaskAccountProps {
  message: string;
}

const useStyles = createStyles((theme) => ({
  container: {
    width: '100%',
    height: '50vh',
  },
}));

export default function LoadingMatamaskAccount({
  message,
}: LoadingMatamaskAccountProps) {
  const { classes } = useStyles();
  return (
    <Container className={classes.container}>
      <Flex justify="center" align="center" direction="column" h="100%">
        <Paper withBorder p="lg" radius="md" mb="xs" ta="center" bg="teal">
          <Loader color="white" size="xl" />
          <Text size="xl" c="white">
            {message}
          </Text>
        </Paper>
      </Flex>
    </Container>
  );
}
