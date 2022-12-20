import { Modal } from '@mantine/core';
import { useEffect, useState } from 'react';

export interface BuyModalProps {
  opened: boolean;
  setOpened(open: boolean): void;
}

export function BuyModal({ opened, setOpened }: BuyModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Introduce yourself!"
    ></Modal>
  );
}

export default BuyModal;
