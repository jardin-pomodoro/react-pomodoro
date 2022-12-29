import { Loader, Flex } from '@mantine/core';

export default function LoadingEtherAccount() {
  return (
    <Flex
      mih={50}
      gap="md"
      justify="center"
      align="center"
      direction="row"
      wrap="wrap"
    >
      <Loader color="teal" size="xl" />
      <h1>Loading Ether Account</h1>
    </Flex>
  );
}
