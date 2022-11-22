import {
  Card,
  Group,
  Button,
  Badge,
  Image,
  Text,
  Container,
  createStyles,
  Title,
} from '@mantine/core';

const useStyle = createStyles(() => ({
  main: {
    margin: '2rem',
  },
}));

function Home() {
  const { classes } = useStyle();
  return (
    <Container className={classes.main}>
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Card.Section>
          <Image
            src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
            height={160}
            alt="Norway"
          />
        </Card.Section>

        <Group position="apart" mt="md" mb="xs">
          <Title order={1} weight={500}>
            Hello World
          </Title>
          <Badge color="pink" variant="light">
            On Sale
          </Badge>
        </Group>

        <Text size="sm" color="dimmed">
          With Fjord Tours you can explore more of the magical fjord landscapes
          with tours and activities on and around the fjords of Norway
        </Text>

        <Button variant="light" color="blue" fullWidth mt="md" radius="md">
          Book classic tour now
        </Button>
      </Card>
    </Container>
  );
}

export default Home;
