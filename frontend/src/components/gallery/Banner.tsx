/* eslint-disable import/prefer-default-export */
import {
  Button,
  Paper,
  Text,
  Group,
  CloseButton,
  Container,
} from '@mantine/core';
import './banner.css';

interface BannerProps {
  backgroundColor: string;
  textColor: string;
  title: string;
  description: string;
}

export function Banner({
  backgroundColor,
  textColor,
  title,
  description,
}: BannerProps) {
  return (
    <Container className="banner-body">
      <Paper withBorder p="lg" radius="md" shadow="md">
        <Group position="apart" mb="xs">
          <Text size="md" weight={500}>
            Allow cookies
          </Text>
          <CloseButton mr={-9} mt={-9} />
        </Group>
        <Text color="dimmed" size="xs">
          So the deal is, we want to spy on you. We would like to know what did
          you have for todays breakfast, where do you live, how much do you earn
          and like 50 other things. To view our landing page you will have to
          accept all cookies. That&apos;s all, and remember that we are
          watching...
        </Text>
        <Group position="right" mt="xs">
          <Button variant="default" size="xs">
            Cookies preferences
          </Button>
          <Button variant="outline" size="xs">
            Accept all
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}
